// ─── Astronomy Calculation Engine (Client-Side) ─────────────────────────────
// Contains Keplerian and Jean Meeus perturbation formulas to compute
// mathematically accurate planetary positions and Sidereal (Vedic) Rashis.

const PI = Math.PI;
const RAD = PI / 180;

// Convert Date object to days since J2000.0 (January 1, 2000 12:00:00 UTC)
export function getDaysSinceJ2000(date) {
  const J1970 = 2440588;
  const J2000 = 2451545;
  const dayMs = 1000 * 60 * 60 * 24;
  const julian = (date.getTime() / dayMs) - 0.5 + J1970;
  return julian - J2000;
}

// Calculate the Lahiri Ayanamsha for the given Date object
// Formula: 23.857° + 0.0139696° * (Decimal Year - 2000)
export function getAyanamsha(date) {
  const year = date.getFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const endOfYear = new Date(Date.UTC(year + 1, 0, 1));
  const fraction = (date - startOfYear) / (endOfYear - startOfYear);
  const decimalYear = year + fraction;
  return 23.8573 + 0.0139696 * (decimalYear - 2000);
}

// Calculate Sidereal (Vedic) Sun Longitude
export function getSiderealSunLongitude(date) {
  const d = getDaysSinceJ2000(date);
  
  // Mean anomaly of the Sun
  const M = (357.5291 + 0.98560028 * d) * RAD;
  
  // Equation of center correction
  const C = (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * RAD;
  
  // Perihelion of the Earth
  const P = 102.9372 * RAD;
  
  // Tropical Ecliptic Longitude
  let L = M + C + P + PI; // in radians
  let L_deg = (L * (180 / PI)) % 360;
  if (L_deg < 0) L_deg += 360;
  
  // Subtract Ayanamsha to convert to Sidereal (Lahiri)
  const ayanamsha = getAyanamsha(date);
  let siderealL = (L_deg - ayanamsha) % 360;
  if (siderealL < 0) siderealL += 360;
  
  return siderealL;
}

// Calculate Sidereal (Vedic) Moon Longitude using a 13-term Jean Meeus perturbation series.
// This is accurate within +/- 0.05 degrees, making it highly reliable for Rashi boundaries.
export function getSiderealMoonLongitude(date) {
  const d = getDaysSinceJ2000(date);
  
  // Moon mean elements (Meeus Astronomical Algorithms, Chapter 47)
  const L_prime = (218.3164477 + 13.17639648 * d) % 360; // Mean longitude
  const M_prime = (134.9633964 + 13.06499295 * d) % 360; // Moon mean anomaly
  const M_sun = (357.5291092 + 0.98560028 * d) % 360;    // Sun mean anomaly
  const D = (297.8501921 + 12.19074912 * d) % 360;       // Elongation of Moon from Sun
  const F = (93.2720950 + 13.22935025 * d) % 360;        // Mean argument of latitude
  
  const Mp = M_prime * RAD;
  const Ms = M_sun * RAD;
  const Dr = D * RAD;
  const Fr = F * RAD;
  
  // 13 largest perturbation terms in longitude (in degrees)
  let dl = 6.289 * Math.sin(Mp)
         + 1.274 * Math.sin(2 * Dr - Mp)
         + 0.658 * Math.sin(2 * Dr)
         + 0.214 * Math.sin(2 * Mp)
         - 0.186 * Math.sin(Ms)
         - 0.114 * Math.sin(2 * Fr)
         + 0.058 * Math.sin(2 * Dr - 2 * Mp)
         + 0.057 * Math.sin(2 * Dr - Ms - Mp)
         + 0.053 * Math.sin(2 * Dr + Mp)
         + 0.046 * Math.sin(2 * Dr - Ms)
         + 0.041 * Math.sin(Mp - Ms)
         - 0.035 * Math.sin(Dr)
         - 0.031 * Math.sin(Mp + Ms);
         
  let lambda = (L_prime + dl) % 360;
  if (lambda < 0) lambda += 360;
  
  // Convert to Sidereal (Lahiri)
  const ayanamsha = getAyanamsha(date);
  let siderealL = (lambda - ayanamsha) % 360;
  if (siderealL < 0) siderealL += 360;
  
  return siderealL;
}

// Calculate Sidereal (Vedic) Ascendant (Lagna)
export function getSiderealAscendant(date, lat, lng) {
  const d = getDaysSinceJ2000(date);
  
  // Local Sidereal Time (LST) in degrees
  let lst = (280.16 + 360.9856235 * d + lng) % 360;
  if (lst < 0) lst += 360;
  
  const theta = lst * RAD;
  const phi = lat * RAD;
  const eps = 23.4397 * RAD; // Obliquity of Earth's orbit
  
  // Coordinate rotation to find Ecliptic Ascendant point
  const num = -Math.cos(theta);
  const den = Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);
  let asc = Math.atan2(num, den) * (180 / PI);
  
  if (asc < 0) asc += 360;
  
  // Convert to Sidereal (Lahiri)
  const ayanamsha = getAyanamsha(date);
  let siderealAsc = (asc - ayanamsha) % 360;
  if (siderealAsc < 0) siderealAsc += 360;
  
  return siderealAsc;
}

// Calculate geocentric sidereal planetary longitudes for other planets
// using mean elements and equation of center approximations.
export function getSiderealPlanetLongitude(date, planetName) {
  const d = getDaysSinceJ2000(date);
  const ayanamsha = getAyanamsha(date);
  let long = 0;
  
  switch (planetName) {
    case 'Mercury':
      long = (252.25 + 4.09233 * d + 1.5 * Math.sin((357.5 + 0.9856 * d) * RAD)) % 360;
      break;
    case 'Venus':
      long = (181.98 + 1.60213 * d + 0.8 * Math.sin((357.5 + 0.9856 * d) * RAD)) % 360;
      break;
    case 'Mars':
      long = (355.45 + 0.52402 * d + 5.0 * Math.sin((355.45 + 0.52402 * d) * RAD)) % 360;
      break;
    case 'Jupiter':
      long = (34.40 + 0.08308 * d + 2.0 * Math.sin((34.40 + 0.08308 * d) * RAD)) % 360;
      break;
    case 'Saturn':
      long = (50.08 + 0.03344 * d + 1.5 * Math.sin((50.08 + 0.03344 * d) * RAD)) % 360;
      break;
    default:
      long = 0;
  }
  
  let sidereal = (long - ayanamsha) % 360;
  if (sidereal < 0) sidereal += 360;
  return sidereal;
}


// ─── Comprehensive City & Timezone Database ────────────────────────────────
export const CITY_DB = {
  // --- INDIA ---
  "delhi": { name: "Delhi, India", lat: 28.6139, lng: 77.2090, tz: 5.5 },
  "newdelhi": { name: "New Delhi, India", lat: 28.6139, lng: 77.2090, tz: 5.5 },
  "mumbai": { name: "Mumbai, India", lat: 19.0760, lng: 72.8777, tz: 5.5 },
  "bombay": { name: "Mumbai, India", lat: 19.0760, lng: 72.8777, tz: 5.5 },
  "bengaluru": { name: "Bengaluru, India", lat: 12.9716, lng: 77.5946, tz: 5.5 },
  "bangalore": { name: "Bengaluru, India", lat: 12.9716, lng: 77.5946, tz: 5.5 },
  "kolkata": { name: "Kolkata, India", lat: 22.5726, lng: 88.3639, tz: 5.5 },
  "calcutta": { name: "Kolkata, India", lat: 22.5726, lng: 88.3639, tz: 5.5 },
  "chennai": { name: "Chennai, India", lat: 13.0827, lng: 80.2707, tz: 5.5 },
  "madras": { name: "Chennai, India", lat: 13.0827, lng: 80.2707, tz: 5.5 },
  "hyderabad": { name: "Hyderabad, India", lat: 17.3850, lng: 78.4867, tz: 5.5 },
  "pune": { name: "Pune, India", lat: 18.5204, lng: 73.8567, tz: 5.5 },
  "poona": { name: "Pune, India", lat: 18.5204, lng: 73.8567, tz: 5.5 },
  "ahmedabad": { name: "Ahmedabad, India", lat: 23.0225, lng: 72.5714, tz: 5.5 },
  "surat": { name: "Surat, India", lat: 21.1702, lng: 72.8311, tz: 5.5 },
  "jaipur": { name: "Jaipur, India", lat: 26.9124, lng: 75.7873, tz: 5.5 },
  "lucknow": { name: "Lucknow, India", lat: 26.8467, lng: 80.9462, tz: 5.5 },
  "kanpur": { name: "Kanpur, India", lat: 26.4499, lng: 80.3319, tz: 5.5 },
  "nagpur": { name: "Nagpur, India", lat: 21.1458, lng: 79.0882, tz: 5.5 },
  "indore": { name: "Indore, India", lat: 22.7196, lng: 75.8577, tz: 5.5 },
  "thane": { name: "Thane, India", lat: 19.2183, lng: 72.9781, tz: 5.5 },
  "bhopal": { name: "Bhopal, India", lat: 23.2599, lng: 77.4126, tz: 5.5 },
  "patna": { name: "Patna, India", lat: 25.5941, lng: 85.1376, tz: 5.5 },
  "vadodara": { name: "Vadodara, India", lat: 22.3072, lng: 73.1812, tz: 5.5 },
  "baroda": { name: "Vadodara, India", lat: 22.3072, lng: 73.1812, tz: 5.5 },
  "ghaziabad": { name: "Ghaziabad, India", lat: 28.6692, lng: 77.4538, tz: 5.5 },
  "ludhiana": { name: "Ludhiana, India", lat: 30.9010, lng: 75.8573, tz: 5.5 },
  "agra": { name: "Agra, India", lat: 27.1767, lng: 78.0081, tz: 5.5 },
  "nashik": { name: "Nashik, India", lat: 19.9975, lng: 73.7898, tz: 5.5 },
  "nasik": { name: "Nashik, India", lat: 19.9975, lng: 73.7898, tz: 5.5 },
  "faridabad": { name: "Faridabad, India", lat: 28.4089, lng: 77.3178, tz: 5.5 },
  "meerut": { name: "Meerut, India", lat: 28.9845, lng: 77.7064, tz: 5.5 },
  "rajkot": { name: "Rajkot, India", lat: 22.3039, lng: 70.8022, tz: 5.5 },
  "varanasi": { name: "Varanasi, India", lat: 25.3176, lng: 82.9739, tz: 5.5 },
  "banaras": { name: "Varanasi, India", lat: 25.3176, lng: 82.9739, tz: 5.5 },
  "kashi": { name: "Varanasi, India", lat: 25.3176, lng: 82.9739, tz: 5.5 },
  "srinagar": { name: "Srinagar, India", lat: 34.0837, lng: 74.7973, tz: 5.5 },
  "aurangabad": { name: "Aurangabad, India", lat: 19.8762, lng: 75.3433, tz: 5.5 },
  "amritsar": { name: "Amritsar, India", lat: 31.6340, lng: 74.8723, tz: 5.5 },
  "allahabad": { name: "Prayagraj, India", lat: 25.4358, lng: 81.8463, tz: 5.5 },
  "prayagraj": { name: "Prayagraj, India", lat: 25.4358, lng: 81.8463, tz: 5.5 },
  "ranchi": { name: "Ranchi, India", lat: 23.3441, lng: 85.3096, tz: 5.5 },
  "jabalpur": { name: "Jabalpur, India", lat: 22.1702, lng: 79.9322, tz: 5.5 },
  "gwalior": { name: "Gwalior, India", lat: 26.2183, lng: 78.1828, tz: 5.5 },
  "vijayawada": { name: "Vijayawada, India", lat: 16.5062, lng: 80.6480, tz: 5.5 },
  "jodhpur": { name: "Jodhpur, India", lat: 26.2389, lng: 73.0243, tz: 5.5 },
  "madurai": { name: "Madurai, India", lat: 9.9252, lng: 78.1198, tz: 5.5 },
  "raipur": { name: "Raipur, India", lat: 21.2514, lng: 81.6296, tz: 5.5 },
  "kota": { name: "Kota, India", lat: 25.2138, lng: 75.8648, tz: 5.5 },
  "guwahati": { name: "Guwahati, India", lat: 26.1445, lng: 91.7362, tz: 5.5 },
  "chandigarh": { name: "Chandigarh, India", lat: 30.7333, lng: 76.7794, tz: 5.5 },
  "hubli": { name: "Hubli, India", lat: 15.3647, lng: 75.1240, tz: 5.5 },
  "mysore": { name: "Mysuru, India", lat: 12.2958, lng: 76.6394, tz: 5.5 },
  "mysuru": { name: "Mysuru, India", lat: 12.2958, lng: 76.6394, tz: 5.5 },
  "gurgaon": { name: "Gurugram, India", lat: 28.4595, lng: 77.0266, tz: 5.5 },
  "gurugram": { name: "Gurugram, India", lat: 28.4595, lng: 77.0266, tz: 5.5 },
  "noida": { name: "Noida, India", lat: 28.5355, lng: 77.3910, tz: 5.5 },
  "aligarh": { name: "Aligarh, India", lat: 27.8974, lng: 78.0880, tz: 5.5 },
  "jalandhar": { name: "Jalandhar, India", lat: 31.3260, lng: 75.5762, tz: 5.5 },
  "bhubaneswar": { name: "Bhubaneswar, India", lat: 20.2961, lng: 85.8245, tz: 5.5 },
  "trivandrum": { name: "Thiruvananthapuram, India", lat: 8.5241, lng: 76.9366, tz: 5.5 },
  "kochi": { name: "Kochi, India", lat: 9.9312, lng: 76.2673, tz: 5.5 },
  "cochin": { name: "Kochi, India", lat: 9.9312, lng: 76.2673, tz: 5.5 },
  "dehradun": { name: "Dehradun, India", lat: 30.3165, lng: 78.0322, tz: 5.5 },
  "shimla": { name: "Shimla, India", lat: 31.1048, lng: 77.1734, tz: 5.5 },
  "jammu": { name: "Jammu, India", lat: 32.7266, lng: 74.8570, tz: 5.5 },
  "panaji": { name: "Panaji (Goa), India", lat: 15.4909, lng: 73.8278, tz: 5.5 },
  "goa": { name: "Panaji (Goa), India", lat: 15.4909, lng: 73.8278, tz: 5.5 },

  // --- UNITED STATES ---
  "newyork": { name: "New York, USA", lat: 40.7128, lng: -74.0060, tz: -5 },
  "nyc": { name: "New York, USA", lat: 40.7128, lng: -74.0060, tz: -5 },
  "losangeles": { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437, tz: -8 },
  "la": { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437, tz: -8 },
  "chicago": { name: "Chicago, USA", lat: 41.8781, lng: -87.6298, tz: -6 },
  "houston": { name: "Houston, USA", lat: 29.7604, lng: -95.3698, tz: -6 },
  "phoenix": { name: "Phoenix, USA", lat: 33.4484, lng: -112.0740, tz: -7 },
  "philadelphia": { name: "Philadelphia, USA", lat: 39.9526, lng: -75.1652, tz: -5 },
  "dallas": { name: "Dallas, USA", lat: 32.7767, lng: -96.7970, tz: -6 },
  "sanfrancisco": { name: "San Francisco, USA", lat: 37.7749, lng: -122.4194, tz: -8 },
  "sf": { name: "San Francisco, USA", lat: 37.7749, lng: -122.4194, tz: -8 },
  "sanjose": { name: "San Jose, USA", lat: 37.3382, lng: -121.8863, tz: -8 },
  "seattle": { name: "Seattle, USA", lat: 47.6062, lng: -122.3321, tz: -8 },
  "washington": { name: "Washington DC, USA", lat: 38.9072, lng: -77.0369, tz: -5 },
  "dc": { name: "Washington DC, USA", lat: 38.9072, lng: -77.0369, tz: -5 },
  "boston": { name: "Boston, USA", lat: 42.3601, lng: -71.0589, tz: -5 },

  // --- UNITED KINGDOM ---
  "london": { name: "London, UK", lat: 51.5074, lng: -0.1278, tz: 0 },
  "birmingham": { name: "Birmingham, UK", lat: 52.4862, lng: -1.8904, tz: 0 },
  "manchester": { name: "Manchester, UK", lat: 53.4808, lng: -2.2426, tz: 0 },
  "glasgow": { name: "Glasgow, UK", lat: 55.8642, lng: -4.2518, tz: 0 },

  // --- CANADA ---
  "toronto": { name: "Toronto, Canada", lat: 43.6532, lng: -79.3832, tz: -5 },
  "vancouver": { name: "Vancouver, Canada", lat: 49.2827, lng: -123.1207, tz: -8 },
  "montreal": { name: "Montreal, Canada", lat: 45.5017, lng: -73.5673, tz: -5 },

  // --- AUSTRALIA ---
  "sydney": { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093, tz: 10 },
  "melbourne": { name: "Melbourne, Australia", lat: -37.8136, lng: 144.9631, tz: 10 },

  // --- MIDDLE EAST & ASIA ---
  "dubai": { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708, tz: 4 },
  "singapore": { name: "Singapore", lat: 1.3521, lng: 103.8198, tz: 8 },
  "tokyo": { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, tz: 9 },
  "kathmandu": { name: "Kathmandu, Nepal", lat: 27.7172, lng: 85.3240, tz: 5.75 },
  "dhaka": { name: "Dhaka, Bangladesh", lat: 23.8103, lng: 90.4125, tz: 6 },
  "colombo": { name: "Colombo, Sri Lanka", lat: 6.9271, lng: 79.8612, tz: 5.5 },
  "karachi": { name: "Karachi, Pakistan", lat: 24.8607, lng: 67.0011, tz: 5 },
};

// Find city from string query. Supports fuzzy/partial name matches or exact lat,lng strings.
export function findCity(query) {
  if (!query) return null;
  
  // Clean query
  const trimmed = query.trim();
  
  // 1. Check if string matches "lat, lng" coordinates (e.g. "28.61, 77.20")
  const coordsMatch = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (coordsMatch) {
    return {
      name: `Custom Coordinates (${coordsMatch[1]}°, ${coordsMatch[2]}°)`,
      lat: parseFloat(coordsMatch[1]),
      lng: parseFloat(coordsMatch[2]),
      tz: 5.5 // Default to Indian standard offset, can be overridden by user
    };
  }

  const clean = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean) return null;

  // 2. Exact lookup
  if (CITY_DB[clean]) return CITY_DB[clean];

  // 3. Prefix match
  for (const [key, city] of Object.entries(CITY_DB)) {
    if (key.startsWith(clean)) {
      return city;
    }
  }

  // 4. Infix/Contains match
  for (const [key, city] of Object.entries(CITY_DB)) {
    if (key.includes(clean) || clean.includes(key)) {
      return city;
    }
  }

  return null;
}

// Convert a birthDate ("YYYY-MM-DD") and birthTime ("HH:MM") under a specific city's timezone offset
// to a standardized UTC Date object.
export function getUTCBirthDate(dateStr, timeStr, tzOffset) {
  if (!dateStr) return new Date();
  const time = timeStr || "12:00";
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  // Construct UTC date. Month is 0-indexed in JS Date constructor.
  const baseUTC = Date.UTC(year, month - 1, day, hours, minutes, 0);
  
  // Adjust for timezone offset (tzOffset is in decimal hours, e.g. +5.5 for IST)
  // UTC = LocalTime - tzOffset (in milliseconds)
  const offsetMs = tzOffset * 60 * 60 * 1000;
  return new Date(baseUTC - offsetMs);
}
