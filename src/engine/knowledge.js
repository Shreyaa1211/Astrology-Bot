// ─── Vedic Numerology (Mulank / Bhagyank) ─────────────────────────────────
// Mulank = single-digit reduction of birth DAY
// Bhagyank = single-digit reduction of full birth DATE (dd+mm+yyyy)

export const reduceToSingle = (n) => {
  let sum = n;
  while (sum > 9) {
    sum = String(sum).split('').reduce((a, d) => a + Number(d), 0);
  }
  return sum;
};

export const getMulank = (dateStr) => {
  if (!dateStr) return null;
  const day = parseInt(dateStr.split('-')[2], 10);
  return reduceToSingle(day);
};

export const getBhagyank = (dateStr) => {
  if (!dateStr) return null;
  const digits = dateStr.replace(/\D/g, '');
  const total = digits.split('').reduce((a, d) => a + Number(d), 0);
  return reduceToSingle(total);
};

export const getNameNumber = (name) => {
  if (!name) return null;
  const map = { a:1,b:2,c:3,d:4,e:5,f:8,g:3,h:5,i:1,j:1,k:2,l:3,m:4,n:5,o:7,p:8,q:1,r:2,s:3,t:4,u:6,v:6,w:6,w:6,x:5,y:1,z:7 };
  const total = name.toLowerCase().replace(/[^a-z]/g, '').split('').reduce((acc, ch) => acc + (map[ch] || 0), 0);
  return reduceToSingle(total);
};

// ─── Mulank Profiles ───────────────────────────────────────────────────────
export const MULANK_DATA = {
  1: {
    ruler: 'Sun (Surya)',
    deity: 'Surya Dev',
    element: 'Fire',
    day: 'Sunday',
    color: 'Gold / Orange',
    gem: 'Ruby (Manik)',
    metal: 'Gold',
    strengths: ['Leadership', 'Independence', 'Ambition', 'Innovation'],
    weaknesses: ['Ego conflicts', 'Stubbornness', 'Isolation from over-self-reliance'],
    career: ['Entrepreneurship', 'Government roles', 'Politics', 'Administration', 'Senior management'],
    health: 'Heart, eyes, blood pressure. Regular cardiovascular activity recommended.',
    personalAdvice: 'You have a natural authority. Use it to build, not to dominate. Delegate tasks you find mundane—your energy is best applied to strategy and vision.',
    businessAdvice: 'Start ventures independently. Partnerships where you lack control will frustrate you. Ideal sectors: tech startups, consulting, executive coaching.',
    spiritualAdvice: 'Surya Namaskar at dawn strengthens your ruling planet. Chant "Om Suryaya Namaha" 7 times.',
  },
  2: {
    ruler: 'Moon (Chandra)',
    deity: 'Chandra Dev',
    element: 'Water',
    day: 'Monday',
    color: 'White / Silver / Cream',
    gem: 'Pearl (Moti)',
    metal: 'Silver',
    strengths: ['Empathy', 'Diplomacy', 'Creativity', 'Intuition'],
    weaknesses: ['Indecisiveness', 'Emotional sensitivity', 'Dependency on validation'],
    career: ['Counseling', 'Art & design', 'Human resources', 'Nursing', 'Public relations'],
    health: 'Digestive system, water retention, mental health. Hydration and emotional regulation practices are key.',
    personalAdvice: 'Your emotional intelligence is your greatest asset. Do not mistake sensitivity for weakness—it is perceptive power. Set boundaries to prevent energy drain.',
    businessAdvice: 'Partner-oriented businesses suit you. Co-founding with a Mulank 1 or 5 person balances your collaborative nature with drive.',
    spiritualAdvice: 'Moon meditation on full moon nights. Fast on Mondays. Wear white on significant business days.',
  },
  3: {
    ruler: 'Jupiter (Guru/Brihaspati)',
    deity: 'Brihaspati Dev',
    element: 'Ether',
    day: 'Thursday',
    color: 'Yellow / Saffron',
    gem: 'Yellow Sapphire (Pukhraj)',
    metal: 'Gold',
    strengths: ['Teaching ability', 'Optimism', 'Communication', 'Philosophical depth'],
    weaknesses: ['Overcommitment', 'Scattered focus', 'Tendency to preach'],
    career: ['Education', 'Writing', 'Law', 'Journalism', 'Spiritual leadership', 'Finance'],
    health: 'Liver, skin, nervous system. Avoid excessive sugar and alcohol.',
    personalAdvice: 'You attract people naturally. Channel this into mentoring and teaching rather than seeking social approval. Your words carry weight—use them carefully.',
    businessAdvice: 'Knowledge-based businesses thrive for you. Publishing, education platforms, advisory services. Avoid pure manual-labor industries.',
    spiritualAdvice: 'Chant "Om Gurave Namaha". Wear yellow on Thursdays. Donate to educational causes.',
  },
  4: {
    ruler: 'Rahu (North Node)',
    deity: 'Rahu',
    element: 'Air (Shadow)',
    day: 'Saturday (shared)',
    color: 'Blue / Grey / Smoky tones',
    gem: 'Hessonite (Gomed)',
    metal: 'Lead',
    strengths: ['Systematic thinking', 'Technical skill', 'Persistence', 'Unconventional intelligence'],
    weaknesses: ['Restlessness', 'Sudden mood changes', 'Rebelliousness', 'Difficulty with authority'],
    career: ['Engineering', 'IT & software', 'Research', 'Construction', 'Architecture'],
    health: 'Respiratory system, bones, chronic fatigue. Maintain consistent routines.',
    personalAdvice: 'You think differently from others—this is your power, not a flaw. Structure your unconventional ideas into systems that others can follow.',
    businessAdvice: 'Technology, construction, and research-driven sectors. You will face initial resistance; persistence past the 4th year is when returns compound.',
    spiritualAdvice: 'Rahu is pacified through service and charity. Donate to underprivileged causes. Avoid intoxicants strictly.',
  },
  5: {
    ruler: 'Mercury (Budha)',
    deity: 'Budha Dev',
    element: 'Earth',
    day: 'Wednesday',
    color: 'Green / Emerald',
    gem: 'Emerald (Panna)',
    metal: 'Bronze / Brass',
    strengths: ['Adaptability', 'Communication', 'Quick thinking', 'Commercial instinct'],
    weaknesses: ['Inconsistency', 'Nervousness', 'Risk-taking without analysis'],
    career: ['Sales', 'Trading', 'Marketing', 'Travel industry', 'Media', 'E-commerce'],
    health: 'Nervous system, speech-related issues, skin. Practice grounding exercises.',
    personalAdvice: 'You process information faster than most people around you. Slow down enough to let relationships develop at a natural pace rather than cycling through connections.',
    businessAdvice: 'Commerce and communication businesses are your strength. Trading, retail, digital marketing, and consulting. Diversification works for you if controlled.',
    spiritualAdvice: 'Chant "Om Budhaya Namaha". Wear green on Wednesdays. Keep a Tulsi plant at your workspace.',
  },
  6: {
    ruler: 'Venus (Shukra)',
    deity: 'Shukra Dev',
    element: 'Water / Earth',
    day: 'Friday',
    color: 'Pink / White / Pastel shades',
    gem: 'Diamond (Heera)',
    metal: 'Silver / Platinum',
    strengths: ['Aesthetic sense', 'Nurturing', 'Creativity', 'Harmonizing ability'],
    weaknesses: ['Over-attachment', 'Materialism', 'Avoidance of conflict'],
    career: ['Fashion', 'Interior design', 'Hospitality', 'Entertainment', 'Beauty industry', 'Food'],
    health: 'Kidneys, reproductive system, throat. Moderate lifestyle prevents Venus-related excess.',
    personalAdvice: 'Your relationships are central to your wellbeing. Invest in them genuinely, but avoid losing yourself in others. Self-care is not selfish for a Mulank 6.',
    businessAdvice: 'Luxury goods, hospitality, food, and creative services. Your sense of design gives you an edge. Avoid purely technical fields.',
    spiritualAdvice: 'Chant "Om Shukraya Namaha". Donate to women-centric organizations. Wear white or pink on Fridays.',
  },
  7: {
    ruler: 'Ketu (South Node)',
    deity: 'Ketu',
    element: 'Fire (Shadow)',
    day: 'Monday (shared)',
    color: 'Grey / Brown / Earth tones',
    gem: 'Cat\'s Eye (Lehsunia)',
    metal: 'Mixed alloys',
    strengths: ['Analytical depth', 'Intuition', 'Research ability', 'Spiritual inclination'],
    weaknesses: ['Social isolation', 'Overthinking', 'Secretiveness', 'Distrust'],
    career: ['Research', 'Data science', 'Occult sciences', 'Philosophy', 'Investigation', 'Psychology'],
    health: 'Digestive issues, skin, mysterious ailments. Ayurvedic approaches often suit Mulank 7 better.',
    personalAdvice: 'Your inner world is rich, but external connection is essential for balance. Share your findings with others rather than hoarding knowledge.',
    businessAdvice: 'Niche, specialized businesses. Consulting in technical domains, research firms, spiritual practices. Avoid broad-market consumer businesses.',
    spiritualAdvice: 'Meditation and introspection are your natural practices. Chant "Om Ketave Namaha". Study sacred texts regularly.',
  },
  8: {
    ruler: 'Saturn (Shani)',
    deity: 'Shani Dev',
    element: 'Earth / Air',
    day: 'Saturday',
    color: 'Black / Dark blue / Violet',
    gem: 'Blue Sapphire (Neelam) — wear only after proper consultation',
    metal: 'Iron',
    strengths: ['Discipline', 'Resilience', 'Long-term planning', 'Organizational skill'],
    weaknesses: ['Pessimism', 'Slow trust', 'Overbearing control', 'Delayed gratification stress'],
    career: ['Real estate', 'Mining', 'Manufacturing', 'Law enforcement', 'Judiciary', 'Large-scale project management'],
    health: 'Bones, joints, teeth, chronic conditions. Regular check-ups and calcium-rich diet.',
    personalAdvice: 'Life delivers results to you later than to others, but those results are more permanent. Do not compare timelines. Your 40s onward are your strongest decade.',
    businessAdvice: 'Heavy industry, real estate, infrastructure, and organizational management. Avoid speculative ventures. Steady compounding is your model.',
    spiritualAdvice: 'Serve the underprivileged—Saturn rewards genuine service. Chant "Om Shanaishcharaya Namaha". Fast on Saturdays. Oil donation to temples.',
  },
  9: {
    ruler: 'Mars (Mangal)',
    deity: 'Mangal Dev / Hanuman',
    element: 'Fire',
    day: 'Tuesday',
    color: 'Red / Coral / Crimson',
    gem: 'Red Coral (Moonga)',
    metal: 'Copper',
    strengths: ['Courage', 'Execution speed', 'Physical stamina', 'Protective instinct'],
    weaknesses: ['Aggression', 'Impatience', 'Confrontational nature', 'Burnout'],
    career: ['Military', 'Surgery', 'Sports', 'Engineering', 'Emergency services', 'Manufacturing'],
    health: 'Blood pressure, injuries, head. Physical exercise is essential but avoid reckless activity.',
    personalAdvice: 'Your protective instinct is admirable, but learn to distinguish between protection and control. Let people you care about make their own mistakes.',
    businessAdvice: 'Operations-heavy businesses. Manufacturing, logistics, defense-related, and fitness industries. You execute plans others only talk about.',
    spiritualAdvice: 'Chant "Om Mangalaya Namaha" or Hanuman Chalisa on Tuesdays. Donate blood when medically appropriate.',
  }
};

// ─── Sidereal (Vedic) Rashi Data ───────────────────────────────────────────
export const RASHIS = [
  { english: 'Aries', sanskrit: 'Mesha', glyph: '♈', ruler: 'Mars', element: 'Fire' },
  { english: 'Taurus', sanskrit: 'Vrishabha', glyph: '♉', ruler: 'Venus', element: 'Earth' },
  { english: 'Gemini', sanskrit: 'Mithuna', glyph: '♊', ruler: 'Mercury', element: 'Air' },
  { english: 'Cancer', sanskrit: 'Karka', glyph: '♋', ruler: 'Moon', element: 'Water' },
  { english: 'Leo', sanskrit: 'Simha', glyph: '♌', ruler: 'Sun', element: 'Fire' },
  { english: 'Virgo', sanskrit: 'Kanya', glyph: '♍', ruler: 'Mercury', element: 'Earth' },
  { english: 'Libra', sanskrit: 'Tula', glyph: '♎', ruler: 'Venus', element: 'Air' },
  { english: 'Scorpio', sanskrit: 'Vrishchika', glyph: '♏', ruler: 'Mars', element: 'Water' },
  { english: 'Sagittarius', sanskrit: 'Dhanu', glyph: '♐', ruler: 'Jupiter', element: 'Fire' },
  { english: 'Capricorn', sanskrit: 'Makara', glyph: '♑', ruler: 'Saturn', element: 'Earth' },
  { english: 'Aquarius', sanskrit: 'Kumbha', glyph: '♒', ruler: 'Saturn', element: 'Air' },
  { english: 'Pisces', sanskrit: 'Meena', glyph: '♓', ruler: 'Jupiter', element: 'Water' }
];

export const RASHI_DATA = {
  Mesha: {
    english: 'Aries', glyph: '♈', ruler: 'Mars (Mangal)', element: 'Fire', quality: 'Cardinal',
    strengths: ['Initiative', 'Courage', 'Pioneering drive', 'Unyielding spirit'],
    weaknesses: ['Impatience', 'Sudden temper', 'Recklessness', 'Ego conflicts'],
    deity: 'Lord Hanuman / Kartikeya',
    career: ['Defense & Military', 'Engineering & Construction', 'Surgery & Emergency Medicine', 'Startups & Business Leadership'],
    health: 'Governs head and eyes. Avoid heat stroke, fevers, and mental tension.',
    spiritualAdvice: 'Chant Hanuman Chalisa on Tuesdays. Practice breath control (Pranayama) to cool down fiery impulses.',
    description: 'Mesha is the first sign of the zodiac, representing pioneering spirit and active courage. Ruled by Mars, it gives you high energy, directness, and a desire to lead.'
  },
  Vrishabha: {
    english: 'Taurus', glyph: '♉', ruler: 'Venus (Shukra)', element: 'Earth', quality: 'Fixed',
    strengths: ['Patience', 'Reliability', 'Aesthetic appreciation', 'Steady determination'],
    weaknesses: ['Stubbornness', 'Possessiveness', 'Resistance to change', 'Overindulgence'],
    deity: 'Goddess Lakshmi',
    career: ['Finance & Banking', 'Agriculture & Landscaping', 'Arts, Fashion & Luxury', 'Culinary Arts & Hospitality'],
    health: 'Governs neck and throat. Watch for thyroid issues and throat infections.',
    spiritualAdvice: 'Donate white sweets or flowers on Fridays. Chant Venus mantras to attract stability.',
    description: 'Vrishabha represents stability, nourishment, and earth wealth. Lorded by Venus, it makes you steady, artistic, and deeply appreciative of material and sensory comforts.'
  },
  Mithuna: {
    english: 'Gemini', glyph: '♊', ruler: 'Mercury (Budha)', element: 'Air', quality: 'Mutable',
    strengths: ['Adaptability', 'Intellectual curiosity', 'Communication skills', 'Versatility'],
    weaknesses: ['Restlessness', 'Anxiety', 'Superficiality', 'Scattered focus'],
    deity: 'Lord Vishnu',
    career: ['Media & Journalism', 'Sales & Marketing', 'Writing & Translation', 'IT & Communication Services'],
    health: 'Governs shoulders, arms, and nervous system. Practice mindfulness to prevent mental fatigue.',
    spiritualAdvice: 'Keep a Tulsi plant at home and water it daily. Meditate with green crystals.',
    description: 'Mithuna represents dual nature, intellect, and active communication. Ruled by Mercury, it gives you a quick-witted mind, love for study, and dynamic social flexibility.'
  },
  Karka: {
    english: 'Cancer', glyph: '♋', ruler: 'Moon (Chandra)', element: 'Water', quality: 'Cardinal',
    strengths: ['Deep empathy', 'Protective instinct', 'Intuition', 'Emotional depth'],
    weaknesses: ['Moodiness', 'Over-sensitivity', 'Clinginess', 'Passive aggression'],
    deity: 'Lord Shiva / Goddess Parvati',
    career: ['Healthcare & Nursing', 'Psychotherapy & Counseling', 'Hotel management & Food service', 'Real estate & Interior styling'],
    health: 'Governs chest and stomach. Vulnerable to emotional eating, acidity, and water retention.',
    spiritualAdvice: 'Meditate on the Moon during full moon nights (Purnima). Offer water to Shiva Lingam on Mondays.',
    description: 'Karka represents motherly care, home, and emotional sensitivity. Ruled by the Moon, you possess high emotional intelligence, strong family attachment, and deep psychic intuition.'
  },
  Simha: {
    english: 'Leo', glyph: '♌', ruler: 'Sun (Surya)', element: 'Fire', quality: 'Fixed',
    strengths: ['Generosity', 'Leadership', 'Charisma', 'Creativity'],
    weaknesses: ['Pride', 'Need for constant attention', 'Arrogance', 'Inflexibility'],
    deity: 'Lord Shiva / Surya Dev',
    career: ['Public Administration', 'Politics & Senior Executive roles', 'Theatre & Entertainment', 'Luxury Brand Management'],
    health: 'Governs heart and spine. Regular cardio exercise and stress management are highly recommended.',
    spiritualAdvice: 'Offer water to the Sun (Arghya) at sunrise. Chant Gayatri Mantra daily.',
    description: 'Simha represents power, royalty, and creative expression. Lorded by the Sun, it gives you a commanding presence, self-confidence, and a protective, generous heart.'
  },
  Kanya: {
    english: 'Virgo', glyph: '♍', ruler: 'Mercury (Budha)', element: 'Earth', quality: 'Mutable',
    strengths: ['Analytical precision', 'Organization', 'Dedication to service', 'Practicality'],
    weaknesses: ['Over-criticism', 'Perfectionism stress', 'Worrying', 'Shyness'],
    deity: 'Lord Vishnu / Goddess Saraswati',
    career: ['Data Analysis & Research', 'Accounting & Audit', 'Healthcare & Diagnostics', 'Editing & Quality Control'],
    health: 'Governs digestive tract. Eat fiber-rich food and manage anxiety which manifests as gut issues.',
    spiritualAdvice: 'Chant Mercury mantras. Serve or donate to students and schools.',
    description: 'Kanya represents details, analytical skill, and service orientation. Ruled by Mercury, you excel at identifying details, organizing systems, and maintaining daily discipline.'
  },
  Tula: {
    english: 'Libra', glyph: '♎', ruler: 'Venus (Shukra)', element: 'Air', quality: 'Cardinal',
    strengths: ['Diplomacy', 'Fairness', 'Harmonizing ability', 'Aesthetic eye'],
    weaknesses: ['Indecisiveness', 'People-pleasing', 'Avoidance of direct confrontation', 'Co-dependency'],
    deity: 'Goddess Lakshmi / Saraswati',
    career: ['Law & Judiciary', 'Diplomacy & Public Relations', 'Art, Fashion & Design', 'Marriage Counseling & Mediation'],
    health: 'Governs kidneys and lower back. Maintain proper hydration and posture.',
    spiritualAdvice: 'Keep your workspace clean and beautiful. Practice gratitude meditation.',
    description: 'Tula represents balance, partnerships, and justice. Lorded by Venus, it drives you to seek harmony in relationships and beauty in all environments.'
  },
  Vrishchika: {
    english: 'Scorpio', glyph: '♏', ruler: 'Mars (Mangal)', element: 'Water', quality: 'Fixed',
    strengths: ['Intensity', 'Transformation', 'Psychic depth', 'Resilience'],
    weaknesses: ['Jealousy', 'Secretiveness', 'Resentment', 'Control issues'],
    deity: 'Lord Shiva / Lord Kartikeya',
    career: ['Research & Investigation', 'Psychology & Esoteric sciences', 'Crisis management', 'Surgery & Pathology'],
    health: 'Governs reproductive organs. Prone to deep-seated toxins; periodic detox is recommended.',
    spiritualAdvice: 'Practice meditation on transformation. Chant Shiva mantras to release past attachments.',
    description: 'Vrishchika represents deep mystery, spiritual death and rebirth, and emotional intensity. Ruled by Mars, it gives you magnetic charisma, profound willpower, and strong investigative capability.'
  },
  Dhanu: {
    english: 'Sagittarius', glyph: '♐', ruler: 'Jupiter (Guru)', element: 'Fire', quality: 'Mutable',
    strengths: ['Optimism', 'Philosophical wisdom', 'Generosity', 'Love for truth'],
    weaknesses: ['Over-confidence', 'Tactlessness', 'Preachiness', 'Commitment phobia'],
    deity: 'Lord Dakshinamurthy / Jupiter',
    career: ['Higher Education & Teaching', 'Law & Philosophy', 'Publishing & Journalism', 'Foreign trade & Spiritual guidance'],
    health: 'Governs thighs, hips, and liver. Avoid excessive rich foods and alcohol.',
    spiritualAdvice: 'Respect teachers and elders. Wear yellow on Thursdays and study sacred texts.',
    description: 'Dhanu represents higher knowledge, law, and spiritual travel. Lorded by Jupiter, it gives you a philosophical attitude, high ethical principles, and an optimistic outlook.'
  },
  Makara: {
    english: 'Capricorn', glyph: '♑', ruler: 'Saturn (Shani)', element: 'Earth', quality: 'Cardinal',
    strengths: ['Discipline', 'Resilience', 'Practical ambition', 'Loyalty'],
    weaknesses: ['Pessimism', 'Workaholism', 'Coldness', 'Emotional suppression'],
    deity: 'Lord Shani / Lord Shiva',
    career: ['Real estate & Infrastructure', 'Corporate Management', 'Judiciary & Governance', 'Heavy industry & Mining'],
    health: 'Governs knees, bones, and joints. Watch for arthritis and calcium deficiencies.',
    spiritualAdvice: 'Serve the needy on Saturdays. Chant Shani mantras to align with Saturn\'s discipline.',
    description: 'Makara represents hard work, structured ambition, and duty. Ruled by Saturn, it grants you deep resilience, patience, and the ability to build massive long-term structures.'
  },
  Kumbha: {
    english: 'Aquarius', glyph: '♒', ruler: 'Saturn (Shani)', element: 'Air', quality: 'Fixed',
    strengths: ['Humanitarianism', 'Independent thinking', 'Innovation', 'Objectivity'],
    weaknesses: ['Detachment', 'Rebelliousness', 'Stubbornness disguised as principles', 'Aloofness'],
    deity: 'Lord Shiva',
    career: ['IT & Software Engineering', 'Social work & NGOs', 'Scientific Research', 'Aviation & Space science'],
    health: 'Governs ankles and circulatory system. Maintain regular physical movement to prevent stiffness.',
    spiritualAdvice: 'Donate to old-age homes. Meditate on the cosmic grid and oneness of humanity.',
    description: 'Kumbha represents global community, humanitarian values, and innovative systems. Ruled by Saturn, it gives you an objective, unique mind focused on collective development.'
  },
  Meena: {
    english: 'Pisces', glyph: '♓', ruler: 'Jupiter (Guru)', element: 'Water', quality: 'Mutable',
    strengths: ['Compassion', 'Spiritual detachment', 'Imaginative creativity', 'Intuitive wisdom'],
    weaknesses: ['Escapism', 'Lack of boundaries', 'Victim mindset', 'Dreaminess'],
    deity: 'Lord Vishnu',
    career: ['Creative arts & Film-making', 'Spiritual retreats & Charity work', 'Marine biology & Shipping', 'Psychology & Dream analysis'],
    health: 'Governs feet and lymphatic system. Susceptible to foot aches and allergies; sleep hygiene is vital.',
    spiritualAdvice: 'Spend time in silence near water bodies. Practice selfless service (Seva) and meditation.',
    description: 'Meena is the final sign, representing spiritual liberation (Moksha) and universal compassion. Lorded by Jupiter, it grants you a dreamy, artistic, and deeply spiritual soul.'
  }
};

// ─── Standard Western Zodiac Sign Data ─────────────────────────────────────
export const getZodiacFromDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if ((m===3&&d>=21)||(m===4&&d<=19)) return 'Aries';
  if ((m===4&&d>=20)||(m===5&&d<=20)) return 'Taurus';
  if ((m===5&&d>=21)||(m===6&&d<=20)) return 'Gemini';
  if ((m===6&&d>=21)||(m===7&&d<=22)) return 'Cancer';
  if ((m===7&&d>=23)||(m===8&&d<=22)) return 'Leo';
  if ((m===8&&d>=23)||(m===9&&d<=22)) return 'Virgo';
  if ((m===9&&d>=23)||(m===10&&d<=22)) return 'Libra';
  if ((m===10&&d>=23)||(m===11&&d<=21)) return 'Scorpio';
  if ((m===11&&d>=22)||(m===12&&d<=21)) return 'Sagittarius';
  if ((m===12&&d>=22)||(m===1&&d<=19)) return 'Capricorn';
  if ((m===1&&d>=20)||(m===2&&d<=18)) return 'Aquarius';
  return 'Pisces';
};

export const ZODIAC_DATA = {
  Aries:       { ruler: 'Mars', element: 'Fire', quality: 'Cardinal', house: 1, glyph: '♈', body: 'Head, face', traits: 'Initiative, courage, directness', shadow: 'Impulsiveness, anger, short attention span' },
  Taurus:      { ruler: 'Venus', element: 'Earth', quality: 'Fixed', house: 2, glyph: '♉', body: 'Throat, neck', traits: 'Stability, patience, sensory appreciation', shadow: 'Possessiveness, stubbornness, resistance to change' },
  Gemini:      { ruler: 'Mercury', element: 'Air', quality: 'Mutable', house: 3, glyph: '♊', body: 'Arms, lungs, nervous system', traits: 'Communication, curiosity, versatility', shadow: 'Superficiality, inconsistency, anxiety' },
  Cancer:      { ruler: 'Moon', element: 'Water', quality: 'Cardinal', house: 4, glyph: '♋', body: 'Stomach, chest', traits: 'Nurturing, emotional depth, protectiveness', shadow: 'Moodiness, clinginess, passive aggression' },
  Leo:         { ruler: 'Sun', element: 'Fire', quality: 'Fixed', house: 5, glyph: '♌', body: 'Heart, spine', traits: 'Creativity, warmth, leadership', shadow: 'Vanity, need for constant validation, domineering' },
  Virgo:       { ruler: 'Mercury', element: 'Earth', quality: 'Mutable', house: 6, glyph: '♍', body: 'Digestive system', traits: 'Analytical precision, service orientation, practicality', shadow: 'Over-criticism, anxiety, perfectionism' },
  Libra:       { ruler: 'Venus', element: 'Air', quality: 'Cardinal', house: 7, glyph: '♎', body: 'Kidneys, lower back', traits: 'Diplomacy, fairness, aesthetic sense', shadow: 'Indecisiveness, people-pleasing, conflict avoidance' },
  Scorpio:     { ruler: 'Mars/Pluto', element: 'Water', quality: 'Fixed', house: 8, glyph: '♏', body: 'Reproductive system', traits: 'Intensity, transformation, investigative ability', shadow: 'Jealousy, manipulation, obsessive control' },
  Sagittarius: { ruler: 'Jupiter', element: 'Fire', quality: 'Mutable', house: 9, glyph: '♐', body: 'Hips, thighs, liver', traits: 'Optimism, philosophical mind, adventure', shadow: 'Overconfidence, tactlessness, commitment phobia' },
  Capricorn:   { ruler: 'Saturn', element: 'Earth', quality: 'Cardinal', house: 10, glyph: '♑', body: 'Knees, bones, teeth', traits: 'Discipline, ambition, long-term planning', shadow: 'Pessimism, workaholism, emotional suppression' },
  Aquarius:    { ruler: 'Saturn/Uranus', element: 'Air', quality: 'Fixed', house: 11, glyph: '♒', body: 'Ankles, circulatory system', traits: 'Innovation, humanitarianism, independent thinking', shadow: 'Detachment, stubbornness disguised as principle, emotional distance' },
  Pisces:      { ruler: 'Jupiter/Neptune', element: 'Water', quality: 'Mutable', house: 12, glyph: '♓', body: 'Feet, lymphatic system', traits: 'Compassion, imagination, spiritual sensitivity', shadow: 'Escapism, victim mentality, boundary issues' },
};

// ─── Compatibility ─────────────────────────────────────────────────────────
export const MULANK_COMPAT = {
  1: { friends: [1,3,5,9], neutral: [2,6], difficult: [4,7,8] },
  2: { friends: [1,2,3], neutral: [5,6,9], difficult: [4,7,8] },
  3: { friends: [1,2,3,5,6,9], neutral: [7], difficult: [4,8] },
  4: { friends: [4,5,6,8], neutral: [1,7], difficult: [2,3,9] },
  5: { friends: [1,3,4,5,6,7,8,9], neutral: [2], difficult: [] },
  6: { friends: [3,4,5,6,9], neutral: [1,2,8], difficult: [7] },
  7: { friends: [5,7], neutral: [1,3,4], difficult: [2,6,8,9] },
  8: { friends: [4,5,8], neutral: [1,6], difficult: [2,3,7,9] },
  9: { friends: [1,3,5,6,9], neutral: [2], difficult: [4,7,8] },
};

// ─── Day Analysis ──────────────────────────────────────────────────────────
export const DAY_BORN = {
  0: { day: 'Sunday', ruler: 'Sun', meaning: 'Born under the Sun — natural leadership, vitality, and a desire for recognition.' },
  1: { day: 'Monday', ruler: 'Moon', meaning: 'Born under the Moon — emotional sensitivity, strong maternal bonds, creative fluctuations.' },
  2: { day: 'Tuesday', ruler: 'Mars', meaning: 'Born under Mars — high physical energy, competitive drive, short temper if unchecked.' },
  3: { day: 'Wednesday', ruler: 'Mercury', meaning: 'Born under Mercury — intellectual agility, communication skills, tendency toward anxiety.' },
  4: { day: 'Thursday', ruler: 'Jupiter', meaning: 'Born under Jupiter — philosophical, optimistic, drawn to teaching and higher knowledge.' },
  5: { day: 'Friday', ruler: 'Venus', meaning: 'Born under Venus — appreciation for beauty, comfort, and social harmony.' },
  6: { day: 'Saturday', ruler: 'Saturn', meaning: 'Born under Saturn — disciplined, patient, encounters delays that build character.' },
};
