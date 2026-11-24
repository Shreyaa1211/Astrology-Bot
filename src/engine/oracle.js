import {
  RASHIS,
  RASHI_DATA,
  MULANK_DATA,
  MULANK_COMPAT,
  DAY_BORN
} from './knowledge.js';
import {
  findCity,
  getUTCBirthDate,
  getSiderealSunLongitude,
  getSiderealMoonLongitude,
  getSiderealAscendant,
  getSiderealPlanetLongitude
} from './astronomy.js';

// ─── Intent & Context Classifier ───────────────────────────────────────────
const INTENT_KEYWORDS = {
  numerology:     ['mulank', 'bhagyank', 'birth number', 'destiny number', 'numerology', 'number', 'namank', 'name number'],
  career:         ['career', 'job', 'work', 'profession', 'salary', 'promotion', 'startup', 'company', 'office', 'employment', 'freelance', 'business suitability'],
  finance:        ['finance', 'money', 'wealth', 'rich', 'income', 'debt', 'investment', 'invest', 'savings', 'assets', 'losses', 'stock', 'gold', 'buying house'],
  relationship:   ['relationship', 'love', 'marriage', 'partner', 'wife', 'husband', 'boyfriend', 'girlfriend', 'compatibility', 'dating', 'breakup', 'divorce', 'family'],
  health:         ['health', 'fitness', 'disease', 'body', 'diet', 'exercise', 'illness', 'mental', 'anxiety', 'depression', 'stress', 'sleep', 'weight', 'chronic'],
  spiritual:      ['spiritual', 'meditation', 'mantra', 'prayer', 'temple', 'ritual', 'chakra', 'yoga', 'puja', 'chant', 'god', 'karma', 'dharma', 'moksha', 'vedic', 'deity'],
  education:      ['study', 'exam', 'education', 'school', 'college', 'university', 'learning', 'course', 'degree', 'marks', 'result', 'test'],
  daily:          ['today', 'daily', 'tomorrow', 'this week', 'this month', 'morning', 'routine', 'schedule', 'plan', 'day'],
  gem:            ['gem', 'stone', 'crystal', 'ruby', 'emerald', 'diamond', 'sapphire', 'pearl', 'coral', 'ring', 'wear'],
  compatibility:  ['compatible', 'compatibility', 'match', 'synastry', 'who should i', 'good for me', 'bad for me', 'friend number', 'enemy number'],
  rashi_diff:     ['rashi', 'zodiac sign', 'moon sign', 'sun sign', 'wrong sign', 'wrong rashi', 'not accurate rashi', 'incorrect rashi', 'different sign', 'change sign', 'astrosage', 'drik panchang'],
  about:          ['who are you', 'what are you', 'what can you do', 'help', 'how do you work', 'capabilities'],
  greeting:       ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening', 'good night', 'thanks', 'thank you'],
};

function classifyIntent(text, history = []) {
  const lower = text.toLowerCase();
  
  // 1. First priority: Check if user is asking about why their Rashi is different/wrong
  const isRashiDiff = INTENT_KEYWORDS.rashi_diff.some(kw => lower.includes(kw)) && 
                      (lower.includes('wrong') || lower.includes('not') || lower.includes('accurate') || lower.includes('different') || lower.includes('incorrect') || lower.includes('why') || lower.includes('change'));
  if (isRashiDiff) return 'rashi_diff';

  // 2. Standard keyword matching with weights
  let bestIntent = 'general';
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        // Higher weight for exact or multi-word matches
        score += kw.split(' ').length * 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  // 3. Contextual Fallback: If no high scoring intent, check previous message context
  if (bestScore < 2 && history.length > 0) {
    const lastMsg = history[history.length - 1];
    if (lastMsg.sender === 'user') {
      const parentIntent = classifyIntent(lastMsg.text, []);
      if (parentIntent !== 'general' && parentIntent !== 'greeting') {
        return parentIntent;
      }
    }
  }

  return bestIntent;
}

// ─── Extract birth profile from text if users type it ──────────────────────
function parseBirthText(text) {
  // ISO format YYYY-MM-DD
  let m = text.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  let dateStr = null;
  if (m) {
    dateStr = `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
  } else {
    // DD/MM/YYYY or DD-MM-YYYY
    m = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (m) {
      dateStr = `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
    }
  }

  // Time extraction
  let timeStr = "12:00";
  const timeMatch = text.match(/(\d{1,2})[:\.](\d{2})\s*(am|pm)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const ampm = timeMatch[3];
    if (ampm) {
      if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
    }
    timeStr = `${String(hours).padStart(2,'0')}:${minutes}`;
  }

  // Place extraction (Fuzzy name following "in" or "at" or "place:")
  let placeStr = "Delhi";
  const placeMatch = text.match(/(?:born in|place[:\s]+|at\s+)([a-zA-Z\s,]+)/i);
  if (placeMatch) {
    placeStr = placeMatch[1].trim().split(/\s+/)[0]; // pick first word
  }

  if (dateStr) {
    const cityInfo = findCity(placeStr) || { name: "Delhi, India", lat: 28.61, lng: 77.20, tz: 5.5 };
    const tz = cityInfo.tz;
    const birthUTC = getUTCBirthDate(dateStr, timeStr, tz);

    const sunLong = getSiderealSunLongitude(birthUTC);
    const moonLong = getSiderealMoonLongitude(birthUTC);
    const ascLong = getSiderealAscendant(birthUTC, cityInfo.lat, cityInfo.lng);

    const sunR = RASHIS[Math.floor(sunLong / 30) % 12];
    const moonR = RASHIS[Math.floor(moonLong / 30) % 12];
    const ascR = RASHIS[Math.floor(ascLong / 30) % 12];

    const mulank = parseInt(dateStr.split('-')[2], 10) % 9 || 9;
    const digits = dateStr.replace(/\D/g, '');
    const bhagyank = digits.split('').reduce((a, d) => a + Number(d), 0) % 9 || 9;

    return {
      name: 'Seeker',
      birthDate: dateStr,
      birthTime: timeStr,
      birthPlace: cityInfo.name,
      tzOffset: String(tz),
      mulank,
      bhagyank,
      chandraRashi: moonR.sanskrit,
      suryaRashi: sunR.sanskrit,
      lagna: ascR.sanskrit,
      chandraLong: moonLong,
      suryaLong: sunLong,
      lagnaLong: ascLong
    };
  }

  return null;
}

// ─── Generative Response Compiler ──────────────────────────────────────────
// Generates deep, dynamic, non-repetitive paragraphs based on the user's specific birth chart combinations.
function compileGenerativeResponse(profile, category, queryText) {
  if (!profile) {
    return {
      type: 'structured',
      title: 'Calibration Required',
      sections: [{
        heading: 'Chart Setup',
        content: 'I need your birth details to generate an accurate reading. Please enter your birth date (e.g. "15 March 1995") or open the Calibration panel in the top right to create your chart.'
      }]
    };
  }

  const cSign = profile.chandraRashi || 'Mesha';
  const sSign = profile.suryaRashi || 'Mesha';
  const lSign = profile.lagna || 'Mesha';
  
  const chandra = RASHI_DATA[cSign] || RASHI_DATA.Mesha;
  const surya = RASHI_DATA[sSign] || RASHI_DATA.Mesha;
  const lagna = RASHI_DATA[lSign] || RASHI_DATA.Mesha;

  const mData = MULANK_DATA[profile.mulank] || MULANK_DATA[1];
  const bData = MULANK_DATA[profile.bhagyank] || MULANK_DATA[1];

  let title = '';
  const sections = [];

  // Helper arrays for human-like variations
  const openings = [
    `Analyzing your Vedic planetary grid: Chandra Rashi is **${cSign} (${chandra.english})**, Surya Rashi is **${sSign} (${surya.english})**, and Lagna (Ascendant) is **${lSign} (${lagna.english})**.`,
    `Based on your sidereal placements, your Moon sits in **${cSign} (${chandra.english})** and your rising sign is **${lSign} (${lagna.english})** under the Lahiri Ayanamsha system.`,
    `Examining your active houses: Your emotional foundation is ruled by **${cSign} (${chandra.english})**, while your outer path is directed by your Ascendant, **${lSign} (${lagna.english})**.`
  ];
  const selectedOpening = openings[Math.floor((new Date().getSeconds() + cSign.length) % openings.length)];

  switch (category) {
    case 'finance': {
      title = 'Dynamic Wealth & Finance Analysis';
      
      // Paragraph 1: Moon Sign Element & Financial Personality
      let elementP = '';
      if (chandra.element === 'Earth') {
        elementP = `Having an Earth Moon sign in **${cSign}** makes you naturally practical and risk-averse. You prioritize physical assets like real estate, gold, and stable term deposits over speculative shares. However, watch for stubborn attachment to outdated financial models.`;
      } else if (chandra.element === 'Fire') {
        elementP = `Your Fire Moon sign in **${cSign}** indicates an adventurous, pioneering financial style. You are drawn to startups, high-risk equity, and rapid execution. The danger lies in impulsive expenditures and overextending your credit during high-confidence periods.`;
      } else if (chandra.element === 'Air') {
        elementP = `With an Air Moon sign in **${cSign}**, your financial strengths lie in commercial intelligence, trading, and information exchange. You process market data quickly. However, you can suffer from inconsistent savings patterns and scattered investment strategies.`;
      } else {
        elementP = `Your Water Moon sign in **${cSign}** gives you a highly intuitive feel for market tides, but also makes your financial decisions emotionally driven. You may spend or hoard based on stress levels. Establishing clear logical boundaries is vital for your wealth accumulation.`;
      }

      // Paragraph 2: Ascendant Lord's Financial Direction
      const ascLord = lagna.ruler.split(' ')[0];
      const ascLordAdvice = {
        'Mars': `Lorded by Mars, your Lagna **${lSign}** drives you to compete aggressively for resources. Wealth is seen as a conquest. Ideal wealth venues include land acquisition and operational leadership.`,
        'Venus': `Lorded by Venus, your Lagna **${lSign}** indicates that your wealth is closely tied to aesthetics, premium consumer goods, and collaborative partnerships. You accumulate wealth best when your environment is harmonious.`,
        'Mercury': `Lorded by Mercury, your Lagna **${lSign}** indicates a commercial mindset where wealth is generated through intellectual property, brokerage, agency, or trade. Quick turnovers suit you.`,
        'Moon': `Lorded by the Moon, your Lagna **${lSign}** indicates that your income is highly cyclic. You thrive in sectors catering to the public, hospitality, or organic elements. Maintain a strong cash reserve for transit dips.`,
        'Sun': `Lorded by the Sun, your Lagna **${lSign}** drives you toward administrative authority and government projects. Wealth comes from status, organization, and independent consulting.`,
        'Jupiter': `Lorded by Jupiter, your Lagna **${lSign}** connects your wealth to counseling, educational management, advisory fields, and long-term asset compounding. Ethics play a major role in your financial stability.`,
        'Saturn': `Lorded by Saturn, your Lagna **${lSign}** demands extreme patience. Wealth is delayed but highly permanent. Avoid speculative trading strictly; your model is slow compounding through brick-and-mortar industries.`
      }[ascLord] || `Your Ascendant lord governs your physical path and wealth-accumulation vectors.`;

      // Paragraph 3: Numerology Finance Combination
      const numFinance = `Numerologically, your Mulank **${profile.mulank}** (ruled by ${mData.ruler.split(' ')[0]}) combined with Bhagyank **${profile.bhagyank}** (${bData.ruler.split(' ')[0]}) indicates that ${
        profile.mulank === 5 || profile.mulank === 3
          ? 'you possess a natural talent for business and negotiation. Speculative or knowledge-driven business sectors are highly recommended.'
          : profile.mulank === 8
          ? 'financial success is a marathon. Avoid quick-money schemes; your compounding takes off after your 36th year under Saturn\'s guidance.'
          : 'your finance is driven by individual drive and self-reliant career paths. Partnerships require very strict contracts.'
      }`;

      // Section Assembly
      sections.push({ heading: 'Celestial Foundation', content: `${selectedOpening}\n\n${elementP}` });
      sections.push({ heading: 'Wealth Acquisition Vectors', content: ascLordAdvice });
      sections.push({ heading: 'Numerological Destiny influence', content: numFinance });
      sections.push({
        heading: 'Actionable Financial Guidance',
        list: [
          `Your wealth ruling planet is ${chandra.ruler}. Worshipping or donating to its associated deity (${chandra.deity}) strengthens your financial chart.`,
          `Favorable investment days align with your Lagna lord's day: **${lagna.ruler.includes('Venus') ? 'Friday' : lagna.ruler.includes('Mars') ? 'Tuesday' : lagna.ruler.includes('Mercury') ? 'Wednesday' : lagna.ruler.includes('Jupiter') ? 'Thursday' : lagna.ruler.includes('Saturn') ? 'Saturday' : 'Sunday'}**.`,
          `Keep your workspace organized in the North direction (ruled by Kubera, the lord of wealth).`
        ]
      });
      break;
    }

    case 'career': {
      title = 'Dynamic Career & Business Path';
      
      const careerIntro = `Your rising sign **${lSign}** represents your physical capabilities and professional interactions, while your Moon in **${cSign}** dictates your work satisfaction.`;
      
      // Placements matching career fields
      const lagnaCareer = `Your Lagna **${lSign}** governs your natural inclinations. Traditionally, this supports career paths in: ${lagna.career.join(', ')}.`;
      const moonSatisfaction = `Your Moon in **${cSign}** requires specific work environments to avoid burnout: ${
        chandra.element === 'Water' ? 'You need empathetic, non-toxic teams and creative freedom.' :
        chandra.element === 'Fire' ? 'You need autonomy, high-stakes tasks, and rapid progression.' :
        chandra.element === 'Earth' ? 'You need clear structures, set working hours, and physical milestones.' :
        'You need social interactions, research opportunities, and intellectual variety.'
      }`;
      
      const numCareer = `Your Mulank **${profile.mulank}** (${mData.ruler}) combined with Destiny Bhagyank **${profile.bhagyank}** (${bData.ruler}) supports: ${mData.career.slice(0, 3).join(', ')}. ${
        profile.mulank === 8 ? 'Be prepared for slow start but massive heights in secondary management or real estate.' : ''
      }`;

      sections.push({ heading: 'Vedic Placement Alignment', content: `${selectedOpening}\n\n${careerIntro}` });
      sections.push({ heading: 'Ascendant (Lagna) Skillsets', content: lagnaCareer });
      sections.push({ heading: 'Emotional Satisfaction (Moon)', content: moonSatisfaction });
      sections.push({ heading: 'Numerology Professional Influence', content: numCareer });
      sections.push({
        heading: 'Auspicious Fields & Roles',
        list: [
          ...lagna.career,
          `Leadership focus: roles leveraging your strengths of ${chandra.strengths.slice(0, 2).join(', ')}.`
        ]
      });
      break;
    }

    case 'relationship': {
      title = 'Love, Marriage & Relationships';
      
      const relationshipIntro = `In Vedic compatibility, the Moon sign **${cSign}** governs emotional harmony, while your Ascendant **${lSign}** governs how you express physical affection and partnership expectations.`;
      
      // Matchmaking parameters
      const moonLove = `With Moon in **${cSign}**, you express care through: ${
        cSign === 'Karka' || cSign === 'Meena' ? 'Unconditional emotional support and intuitive nursing.' :
        cSign === 'Mesha' || cSign === 'Simha' ? 'Fiery protection, motivation, and passionate loyalty.' :
        cSign === 'Vrishabha' || cSign === 'Kanya' ? 'Practical service, financial security, and household stability.' :
        'Intellectual debate, shared travel, and social communication.'
      }`;

      const partnerMatch = `Your Mulank compatibility indicates best compatibility with individuals carrying birth numbers: **${MULANK_COMPAT[profile.mulank].friends.join(', ')}**. If marrying or partnering with individuals of number **${MULANK_COMPAT[profile.mulank].difficult.join(', ') || 'None'}**, extra communication and spiritual patience are required.`;

      sections.push({ heading: 'Emotional Blueprint', content: `${selectedOpening}\n\n${relationshipIntro}` });
      sections.push({ heading: 'Affection Pattern (Moon)', content: moonLove });
      sections.push({ heading: 'Vedic Matchmaking Factors', content: partnerMatch });
      sections.push({
        heading: 'Relationship Calibration Advice',
        list: [
          `To balance emotional friction, practice active listening on ${chandra.ruler.includes('Moon') ? 'Mondays' : ' Fridays'}.`,
          `Avoid making relationship commitments during transit retrograde periods of Venus or Mercury.`,
          chandra.personalAdvice
        ]
      });
      break;
    }

    case 'health': {
      title = 'Dynamic Health & Wellness Guidance';
      
      const healthIntro = `In Vedic anatomy, the Ascendant represents the physical body (Deha), and the Moon represents the mind (Manas).`;
      const bodyPart = `Your Lagna **${lSign}** governs the physical frame, making you naturally vulnerable to stress in the: **${
        lSign === 'Mesha' ? 'Head, forehead, brain' :
        lSign === 'Vrishabha' ? 'Throat, neck, vocal cords' :
        lSign === 'Mithuna' ? 'Shoulders, hands, lungs' :
        lSign === 'Karka' ? 'Chest, stomach, digestion' :
        lSign === 'Simha' ? 'Heart, spine, upper back' :
        lSign === 'Kanya' ? 'Intestines, abdominal area' :
        lSign === 'Tula' ? 'Kidneys, lower back, ovaries' :
        lSign === 'Vrishchika' ? 'Reproductive and excretory systems' :
        lSign === 'Dhanu' ? 'Thighs, hips, liver' :
        lSign === 'Makara' ? 'Knees, bones, joints' :
        lSign === 'Kumbha' ? 'Ankles, shins, blood circulation' :
        'Feet, lymphatic system'
      }**.`;
      
      const mentalStress = `Your Moon in **${cSign}** shows that your physical health is highly dependent on your mental peace. ${chandra.health}`;

      sections.push({ heading: 'Vedic Health Grid', content: `${selectedOpening}\n\n${healthIntro}` });
      sections.push({ heading: 'Physical Vulnerability (Lagna)', content: bodyPart });
      sections.push({ heading: 'Mental-Physical Axis (Moon)', content: mentalStress });
      sections.push({
        heading: 'Holistic Wellness Recommendations',
        list: [
          `Incorporate yoga poses that target your Lagna's body zone.`,
          `Water therapy: Moon-ruled signs benefit greatly from drinking water charged under moonlight.`,
          `Practice regular breathing exercises (Pranayama) on days ruled by your Moon lord.`
        ]
      });
      break;
    }

    case 'spiritual': {
      title = 'Spiritual Path & Deity Alignment';
      
      const spiritIntro = `Your Moon in **${cSign}** represents your soul's emotional thirst, while your Lagna **${lSign}** represents the path you walk in this incarnation.`;
      
      sections.push({ heading: 'Karmic Blueprint', content: `${selectedOpening}\n\n${spiritIntro}` });
      sections.push({ heading: 'Ishta Devta / Deity Association', content: `Based on your Chandra Rashi **${cSign}**, your primary devotional resonance is with **${chandra.deity}**. Worshipping this energy grants you protection from planetary afflictions.` });
      sections.push({ heading: 'Spiritual Practice (Sadhana)', content: chandra.spiritualAdvice });
      sections.push({
        heading: 'Sadhana Checkpoints',
        list: [
          `Chant the planetary mantra for ${chandra.ruler} on ${chandra.ruler.includes('Mars') ? 'Tuesdays' : 'Mondays'}.`,
          `Perform acts of charity corresponding to your Destiny number **${profile.bhagyank}** to resolve past karmas.`
        ]
      });
      break;
    }

    case 'gem': {
      title = 'Gemstone & Crystal Calibration';
      
      sections.push({ heading: 'Placements Overview', content: selectedOpening });
      sections.push({ heading: 'Lagna Gem (Primary)', content: `Your life-force stone (Lagna Mani) is based on your Ascendant **${lSign}** (ruled by ${lagna.ruler}). We recommend wearing a premium **${
        lSign === 'Mesha' || lSign === 'Vrishchika' ? 'Red Coral (Moonga) in copper/gold' :
        lSign === 'Vrishabha' || lSign === 'Tula' ? 'Diamond (Heera) or White Sapphire in silver' :
        lSign === 'Mithuna' || lSign === 'Kanya' ? 'Emerald (Panna) in gold/bronze' :
        lSign === 'Karka' ? 'Natural Pearl (Moti) in silver' :
        lSign === 'Simha' ? 'Ruby (Manik) in gold' :
        lSign === 'Dhanu' || lSign === 'Meena' ? 'Yellow Sapphire (Pukhraj) in gold' :
        'Blue Sapphire (Neelam) in iron/silver - wear ONLY after a 3-day trial'
      }** on a ${lagna.ruler.includes('Venus') ? 'Friday' : lagna.ruler.includes('Mars') ? 'Tuesday' : lagna.ruler.includes('Mercury') ? 'Wednesday' : lagna.ruler.includes('Jupiter') ? 'Thursday' : lagna.ruler.includes('Saturn') ? 'Saturday' : 'Sunday'} morning.` });
      
      sections.push({ heading: 'Moon Gem (Emotional balance)', content: `To balance your emotions, your Chandra Rashi **${cSign}** supports wearing a **${chandra.ruler.includes('Moon') ? 'Pearl' : chandra.ruler.includes('Venus') ? 'Diamond' : 'Moonstone'}** or performing charities matching its color.` });
      
      sections.push({
        heading: 'Important wearing rules',
        list: [
          'Gemstones should touch the skin directly for planetary energy transfer.',
          'Purify new stones by dipping them in raw milk and gangajal before wearing.',
          'If you experience headaches or sudden irritability within 72 hours of wearing, remove the stone immediately.'
        ]
      });
      break;
    }

    case 'daily': {
      title = 'Personalized Planetary Forecast';
      const today = new Date();
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Calculate daily transit numbers
      const dayNum = today.getDate() % 9 || 9;
      
      sections.push({ heading: 'Universal Transit', content: `Today is **${dayName}**, carrying the universal vibration of number **${dayNum}** (ruled by ${MULANK_DATA[dayNum]?.ruler || 'Planet'}).` });
      
      const compatibility = MULANK_COMPAT[profile.mulank].friends.includes(dayNum) 
        ? 'highly harmonious. Doors open easily and communication flows.'
        : MULANK_COMPAT[profile.mulank].difficult.includes(dayNum)
        ? 'challenging. Saturn or Rahu transits urge you to double-check paperwork and keep your temper in check.'
        : 'neutral. Good for steady, administrative work.';

      sections.push({ heading: 'Personal Transit Alignment', content: `For your Mulank **${profile.mulank}**, today's vibration is ${compatibility}` });
      sections.push({
        heading: 'Recommended Daily Focus',
        list: [
          `Lucky Color for today: ${chandra.color || 'Pastels'}`,
          `Key focus: Leverage your natural strengths of ${chandra.strengths[0]} to navigate tasks today.`
        ]
      });
      break;
    }

    case 'education': {
      title = 'Learning Style & Study Calibration';
      
      const studyStyle = `Your Moon sign **${cSign}** represents how you absorb information, while your Lagna **${lSign}** represents your focus levels.`;
      
      const learningP = `With Moon in **${cSign}** (${chandra.element} element), your learning style is: ${
        chandra.element === 'Earth' ? 'Methodical and structured. You learn best by copying notes, building spreadsheets, and organizing flashcards.' :
        chandra.element === 'Fire' ? 'Action-oriented. You absorb knowledge by teaching others, solving rapid quizzes, and setting tight competitive deadlines.' :
        chandra.element === 'Air' ? 'Conceptual and social. You thrive in group discussions, listening to podcasts, and linking ideas across fields.' :
        'Intuitive and quiet. You need a completely silent study space and absorb details best through visual charts and quiet reflection.'
      }`;

      sections.push({ heading: 'Educational Blueprint', content: `${selectedOpening}\n\n${studyStyle}` });
      sections.push({ heading: 'Cognitive Absorption Style', content: learningP });
      sections.push({
        heading: 'Exam & Study Guidelines',
        list: [
          `Favorable study days: ${lagna.ruler.includes('Mercury') ? 'Wednesdays' : lagna.ruler.includes('Jupiter') ? 'Thursdays' : 'Mondays'}.`,
          `Wear your Rashi color (${chandra.color || 'White'}) on important test days to calm your nervous system.`,
          `For mental blockages, study in 45-minute blocks followed by a 10-minute walk.`
        ]
      });
      break;
    }

    case 'rashi_diff': {
      title = 'Understanding Your Vedic Rashi Accuracy';
      
      sections.push({
        heading: 'Why is my Rashi different from Western Astrology?',
        content: `You may notice that your Rashi computed here differs from what you see on generic Western websites. This is completely accurate and intentional. Here is the astronomical reason:\n\n1. **Sidereal vs. Tropical Zodiacs**:\n   Western astrology uses the *Tropical Zodiac* (aligned with seasons, starting 0° Aries at the Spring Equinox). Vedic astrology uses the *Sidereal Zodiac* (aligned with actual stellar constellations) incorporating the **Lahiri Ayanamsha** (the shift angle).\n\n2. **The Precession Shift (Ayanamsha)**:\n   Due to the Earth's axial wobble, the tropical and sidereal zodiacs drift apart by about 50.3 arcseconds per year. Currently, they are separated by **about 24.2 degrees**. This means your placements shift backward by nearly an entire zodiac sign when calculated using Vedic sidereal math!\n\n3. **Sun Sign vs. Moon Sign (Chandra Rashi)**:\n   In Western astrology, your sign is based solely on the Sun's position. In Vedic astrology, your primary sign—your **Rashi**—is your **Moon Sign (Chandra Rashi)**. Since the Moon moves very fast (changing signs every 2.25 days), it is highly dependent on your exact birth time and coordinates, unlike the Sun which stays in a sign for 30 days.`
      });
      
      sections.push({
        heading: 'Your Computations',
        content: `• **Chandra Rashi (Vedic Moon Sign)**: ${cSign} (${chandra.english}) — representing your mind, emotions, and inner self.\n• **Surya Rashi (Vedic Sun Sign)**: ${sSign} (${surya.english}) — representing your soul, vitality, and external ego.\n• **Lagna (Vedic Ascendant)**: ${lSign} (${lagna.english}) — representing your physical frame and how you interact with the world.`
      });
      break;
    }

    default: {
      title = 'Generative Astrological Synthesis';
      sections.push({
        heading: 'Your Birth Chart Placements',
        content: `${selectedOpening}\n\nThis is a highly personalized Vedic profile calibrated with the Lahiri Sidereal Zodiac. Ask me specific questions about your career, business, investments, relationship compatibility, health, or spiritual practices to receive detailed guidance customized to your placements.`
      });
      sections.push({
        heading: 'Personal Placements Summary',
        content: `• Moon Sign (Chandra Rashi): **${cSign} (${chandra.english})**\n• Sun Sign (Surya Rashi): **${sSign} (${surya.english})**\n• Ascendant (Lagna): **${lSign} (${lagna.english})**\n• Mulank (Birth Number): **${profile.mulank}** (ruled by ${mData.ruler})\n• Bhagyank (Destiny Number): **${profile.bhagyank}** (ruled by ${bData.ruler})`
      });
      break;
    }
  }

  return { type: 'structured', title, sections };
}

// ─── Main Processor ────────────────────────────────────────────────────────
export function processMessage(text, currentProfile, history = []) {
  const intent = classifyIntent(text, history);

  // Check if message contains calibration details in text (e.g. "I was born on 15 March 1995")
  const textProfile = parseBirthText(text);
  let profile = currentProfile;
  let newProfile = null;

  if (textProfile && !currentProfile) {
    newProfile = textProfile;
    profile = newProfile;
  }

  let response;
  
  if (intent === 'greeting') {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const extra = profile
      ? ` Your chart is calibrated (Chandra Rashi: **${profile.chandraRashi}**, Lagna: **${profile.lagna}**). How can I guide you today? Ask about finance, career, love, gems, or daily forecasts.`
      : ' Share your birth details (Date, Time, Place) in the chat or click "Enter Birth Details" in the top bar to calibrate your chart and receive real readings.';
    response = {
      type: 'text',
      text: `${greeting}! Welcome to Aura Oracle.${extra}`
    };
  } else if (intent === 'about') {
    response = {
      type: 'structured',
      title: 'About Aura Oracle',
      sections: [
        {
          heading: 'Astronomically Verified Readings',
          content: 'I calculate planetary positions using Keplerian equations and Meeus perturbation terms adjusted by the Lahiri Ayanamsha (Sidereal Zodiac). All readings combine your Moon Sign (Chandra Rashi), Sun Sign (Surya Rashi), Ascendant (Lagna), and Vedic Numerology (Mulank/Bhagyank).'
        },
        {
          heading: 'What You Can Ask Me',
          list: [
            'Finance: investments, wealth attraction, debts, purchasing assets',
            'Career & Business: job changes, entrepreneurship suitability, corporate scaling',
            'Love & Marriage: compatibility matching, marriage timings, relationship blocks',
            'Spiritual Sadhana: Ishta Devta, mantras, daily spiritual practices',
            'Gemstones: primary and secondary stones, purifying rituals'
          ]
        }
      ]
    };
  } else {
    // Generate astronomical response
    response = compileGenerativeResponse(profile, intent, text);
  }

  // Attach new profile if parsed
  if (newProfile) {
    response.newProfile = newProfile;
    // Overwrite response with a welcome & first numerology report
    const welcomeReport = compileGenerativeResponse(newProfile, 'numerology', text);
    response = {
      ...welcomeReport,
      newProfile,
      text: `Chart Calibrated Successfully! Name: ${newProfile.name}, Born: ${newProfile.birthDate} at ${newProfile.birthTime} in ${newProfile.birthPlace}.\n\nHere is your core chart structure:`
    };
  }

  return response;
}
