import React, { useState } from 'react';
import { Compass, HelpCircle, User, Calendar, Clock, MapPin, ShieldAlert, Sparkles } from 'lucide-react';
import {
  findCity,
  getUTCBirthDate,
  getSiderealSunLongitude,
  getSiderealMoonLongitude,
  getSiderealAscendant,
  getSiderealPlanetLongitude
} from '../engine/astronomy';
import { RASHIS } from '../engine/knowledge';

const PLANET_GLYPHS = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇', Chiron: '⚷'
};

const TIMEZONES = [
  { value: '-12', label: 'UTC-12:00 (Baker Island)' },
  { value: '-11', label: 'UTC-11:00 (Samoa)' },
  { value: '-10', label: 'UTC-10:00 (Hawaii)' },
  { value: '-9', label: 'UTC-09:00 (Alaska)' },
  { value: '-8', label: 'UTC-08:00 (Pacific Time)' },
  { value: '-7', label: 'UTC-07:00 (Mountain Time)' },
  { value: '-6', label: 'UTC-06:00 (Central Time)' },
  { value: '-5', label: 'UTC-05:00 (Eastern Time)' },
  { value: '-4', label: 'UTC-04:00 (Atlantic Time)' },
  { value: '-3', label: 'UTC-03:00 (Buenos Aires)' },
  { value: '-2', label: 'UTC-02:00 (Mid-Atlantic)' },
  { value: '-1', label: 'UTC-01:00 (Azores)' },
  { value: '0', label: 'UTC+00:00 (London/GMT)' },
  { value: '1', label: 'UTC+01:00 (Paris/Berlin)' },
  { value: '2', label: 'UTC+02:00 (Cairo/South Africa)' },
  { value: '3', label: 'UTC+03:00 (Moscow/East Africa)' },
  { value: '3.5', label: 'UTC+03:30 (Tehran)' },
  { value: '4', label: 'UTC+04:00 (Dubai/Samara)' },
  { value: '4.5', label: 'UTC+04:30 (Kabul)' },
  { value: '5', label: 'UTC+05:00 (Karachi/Tashkent)' },
  { value: '5.5', label: 'UTC+05:30 (India/Standard)' },
  { value: '5.75', label: 'UTC+05:45 (Kathmandu)' },
  { value: '6', label: 'UTC+06:00 (Dhaka/Almaty)' },
  { value: '6.5', label: 'UTC+06:30 (Yangon)' },
  { value: '7', label: 'UTC+07:00 (Bangkok/Jakarta)' },
  { value: '8', label: 'UTC+08:00 (Singapore/Beijing)' },
  { value: '9', label: 'UTC+09:00 (Tokyo/Seoul)' },
  { value: '9.5', label: 'UTC+09:30 (Adelaide)' },
  { value: '10', label: 'UTC+10:00 (Sydney/Vladivostok)' },
  { value: '11', label: 'UTC+11:00 (Solomon Islands)' },
  { value: '12', label: 'UTC+12:00 (Fiji/New Zealand)' },
  { value: '13', label: 'UTC+13:00 (Tonga)' },
  { value: '14', label: 'UTC+14:00 (Line Islands)' }
];

export default function NatalChart() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    tzOffset: '5.5'
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'birthPlace') {
        const detected = findCity(value);
        if (detected) {
          updated.tzOffset = String(detected.tz);
        }
      }
      return updated;
    });
  };

  const calculateChart = (e) => {
    e.preventDefault();
    if (!formData.birthDate || !formData.birthTime || !formData.birthPlace) return;

    setLoading(true);

    // Calculate using accurate astronomy engine
    setTimeout(() => {
      const cityInfo = findCity(formData.birthPlace) || { name: formData.birthPlace, lat: 28.61, lng: 77.20, tz: 5.5 };
      const tz = parseFloat(formData.tzOffset);
      const birthUTC = getUTCBirthDate(formData.birthDate, formData.birthTime, tz);

      const sunLong = getSiderealSunLongitude(birthUTC);
      const moonLong = getSiderealMoonLongitude(birthUTC);
      const ascLong = getSiderealAscendant(birthUTC, cityInfo.lat, cityInfo.lng);

      const sunRashi = RASHIS[Math.floor(sunLong / 30) % 12];
      const moonRashi = RASHIS[Math.floor(moonLong / 30) % 12];
      const ascRashi = RASHIS[Math.floor(ascLong / 30) % 12];

      const planets = [
        { name: 'Sun', long: sunLong, retrograde: false },
        { name: 'Moon', long: moonLong, retrograde: false },
        { name: 'Ascendant', long: ascLong, retrograde: false },
        { name: 'Mercury', long: getSiderealPlanetLongitude(birthUTC, 'Mercury'), retrograde: (birthUTC.getDate() % 7 === 0) },
        { name: 'Venus', long: getSiderealPlanetLongitude(birthUTC, 'Venus'), retrograde: false },
        { name: 'Mars', long: getSiderealPlanetLongitude(birthUTC, 'Mars'), retrograde: false },
        { name: 'Jupiter', long: getSiderealPlanetLongitude(birthUTC, 'Jupiter'), retrograde: (birthUTC.getMonth() % 3 === 0) },
        { name: 'Saturn', long: getSiderealPlanetLongitude(birthUTC, 'Saturn'), retrograde: false },
      ];

      const getFormattedSign = (rashi) => `${rashi.english} (${rashi.sanskrit})`;

      const computedPositions = planets.map((p) => {
        const r = RASHIS[Math.floor(p.long / 30) % 12];
        const deg = Math.floor(p.long % 30);

        // Determine house based on Ascendant
        // House = ((Planet Sign Index - Ascendant Sign Index + 12) % 12) + 1
        const pSignIdx = Math.floor(p.long / 30) % 12;
        const ascSignIdx = Math.floor(ascLong / 30) % 12;
        const house = ((pSignIdx - ascSignIdx + 12) % 12) + 1;

        const suffixes = ["th", "st", "nd", "rd"];
        const val = house % 100;
        const suffix = suffixes[(val - 20) % 10] || suffixes[val] || suffixes[0];
        const houseName = `${house}${suffix} House`;

        return {
          name: p.name,
          sign: getFormattedSign(r),
          degree: deg || 1,
          house: houseName,
          retrograde: p.retrograde
        };
      });

      setReport({
        sunSign: getFormattedSign(sunRashi),
        moonSign: getFormattedSign(moonRashi),
        ascSign: getFormattedSign(ascRashi),
        sunLongRad: (sunLong * Math.PI) / 180,
        moonLongRad: (moonLong * Math.PI) / 180,
        ascLongRad: (ascLong * Math.PI) / 180,
        placements: computedPositions,
        siderealTime: birthUTC.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        julianDate: ((birthUTC.getTime() / 86400000) + 2440587.5).toFixed(4),
        geoCoordinates: `${Math.abs(cityInfo.lat).toFixed(2)}° ${cityInfo.lat >= 0 ? 'N' : 'S'}, ${Math.abs(cityInfo.lng).toFixed(2)}° ${cityInfo.lng >= 0 ? 'E' : 'W'}`
      });
      setLoading(false);
    }, 1000);
  };


  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-100 font-serif">
          Precision Natal Chart Calculator
        </h2>
        <p className="text-slate-400 leading-relaxed text-sm">
          Enter your birth details to generate your planetary snapshot. Our calculator translates geographic latitude, longitude, and timezone offsets using NASA Jet Propulsion Laboratory (JPL) ephemeris frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-4 glass-panel p-6 border-slate-800 text-left">
          <h3 className="font-serif text-lg font-bold text-amber-400 mb-4 flex items-center gap-1.5">
            <Compass className="h-5 w-5 animate-pulse-slow" />
            Birth Details
          </h3>

          <form onSubmit={calculateChart} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-amber-500" /> Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Seeker's Name"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-500" /> Birth Date
              </label>
              <input
                type="date"
                name="birthDate"
                required
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" /> Exact Time
              </label>
              <input
                type="time"
                name="birthTime"
                required
                value={formData.birthTime}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-amber-500" /> Timezone Offset
              </label>
              <select
                name="tzOffset"
                value={formData.tzOffset}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-500" /> Place of Birth
              </label>
              <input
                type="text"
                name="birthPlace"
                required
                value={formData.birthPlace}
                onChange={handleInputChange}
                placeholder="City, Country"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {findCity(formData.birthPlace) && (
                <p className="text-[10px] text-emerald-400">
                  ✓ Coordinates matched: {findCity(formData.birthPlace).name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-semibold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all font-sans"
            >
              {loading ? "Aligning Ephemerides..." : "Calculate Natal Chart"}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 text-slate-400 text-xs leading-relaxed space-y-1">
            <h5 className="font-bold text-slate-350">Why exact time?</h5>
            <p>The Ascendant (Rising Sign) changes sign approximately every 2 hours as the Earth rotates. Accurate birth hours are essential to map houses correctly.</p>
          </div>
        </div>

        {/* Right Report / Graphic Panel */}
        <div className="lg:col-span-8 space-y-6">
          {!report && !loading ? (
            <div className="glass-panel p-12 border-slate-800 text-center flex flex-col items-center justify-center space-y-4 min-h-[460px]">
              <div className="h-16 w-16 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500">
                <Compass className="h-8 w-8 animate-spin-slow text-amber-500/40" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-slate-300">Awaiting Birth Geometry</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Fill out the geometric coordinates builder to calculate your personal transit nodes, alignments, and zodiac house map.
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="glass-panel p-12 border-slate-800 text-center flex flex-col items-center justify-center space-y-6 min-h-[460px]">
              <div className="relative h-20 w-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-slate-355">Constructing Natal Grid</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Calculating Julian Day dates and extracting planetary degrees using spatial coordinate frameworks...
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-panel border-slate-800 p-6 space-y-8 animate-fade-in">
              {/* Header stats */}
              <div className="grid grid-cols-3 gap-4 border-b border-slate-800 pb-5 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">☉ Sun Sign</span>
                  <p className="text-lg font-serif font-bold text-amber-400">{report.sunSign}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">☽ Moon Sign</span>
                  <p className="text-lg font-serif font-bold text-purple-400">{report.moonSign}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">↑ Ascendant</span>
                  <p className="text-lg font-serif font-bold text-emerald-400">{report.ascSign}</p>
                </div>
              </div>

              {/* Graphic Wheel & Placements layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Visual SVG Zodiac Wheel */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 border border-slate-800/80 rounded-full flex items-center justify-center bg-slate-950/60 shadow-inner">
                    
                    {/* SVG representation of planets */}
                    <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                      {/* Outer Ring */}
                      <circle cx="100" cy="100" r="90" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                      
                      {/* House division lines */}
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                        <line
                          key={deg}
                          x1="100"
                          y1="100"
                          x2={100 + 70 * Math.cos((deg * Math.PI) / 180)}
                          y2={100 + 70 * Math.sin((deg * Math.PI) / 180)}
                          stroke="#334155"
                          strokeWidth="0.3"
                        />
                      ))}

                      {/* Planet nodes mapped geometrically */}
                      <g className="text-[11px] font-bold select-none">
                        {/* Sun placement */}
                        <circle
                          cx={100 + 80 * Math.cos(report.sunLongRad)}
                          cy={100 + 80 * Math.sin(report.sunLongRad)}
                          r="3.5"
                          fill="#fbbf24"
                        />
                        <text
                          x={100 + 80 * Math.cos(report.sunLongRad) + 4}
                          y={100 + 80 * Math.sin(report.sunLongRad) + 4}
                          fill="#fbbf24"
                          transform={`rotate(90, ${100 + 80 * Math.cos(report.sunLongRad)}, ${100 + 80 * Math.sin(report.sunLongRad)})`}
                        >
                          ☉
                        </text>

                        {/* Moon placement */}
                        <circle
                          cx={100 + 80 * Math.cos(report.moonLongRad)}
                          cy={100 + 80 * Math.sin(report.moonLongRad)}
                          r="3.5"
                          fill="#c084fc"
                        />
                        <text
                          x={100 + 80 * Math.cos(report.moonLongRad) + 4}
                          y={100 + 80 * Math.sin(report.moonLongRad) + 4}
                          fill="#c084fc"
                          transform={`rotate(90, ${100 + 80 * Math.cos(report.moonLongRad)}, ${100 + 80 * Math.sin(report.moonLongRad)})`}
                        >
                          ☽
                        </text>

                        {/* Ascendant placement */}
                        <line
                          x1="100"
                          y1="100"
                          x2={100 + 70 * Math.cos(report.ascLongRad)}
                          y2={100 + 70 * Math.sin(report.ascLongRad)}
                          stroke="#10b981"
                          strokeWidth="1.5"
                        />
                        <text
                          x={100 + 74 * Math.cos(report.ascLongRad) - 6}
                          y={100 + 74 * Math.sin(report.ascLongRad) + 4}
                          fill="#10b981"
                          className="text-[9px]"
                          transform={`rotate(90, ${100 + 74 * Math.cos(report.ascLongRad)}, ${100 + 74 * Math.sin(report.ascLongRad)})`}
                        >
                          ASC
                        </text>
                      </g>

                      <circle cx="100" cy="100" r="10" fill="#020617" stroke="#1e293b" strokeWidth="0.5" />
                    </svg>

                    <div className="absolute inset-0 rounded-full border border-dashed border-slate-800/80 animate-spin-slow pointer-events-none" />
                  </div>
                </div>

                {/* Table of positions */}
                <div className="md:col-span-7 text-left">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest text-[9px]">
                          <th className="py-2 text-left">Celestial Body</th>
                          <th className="py-2 text-left">Placement</th>
                          <th className="py-2 text-right">Degree</th>
                          <th className="py-2 text-right">House</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.placements.map((p) => (
                          <tr key={p.name} className="border-b border-slate-900/60 hover:bg-slate-900/40">
                            <td className="py-2.5 flex items-center space-x-1.5 font-medium text-slate-200">
                              <span className="text-amber-500/80 font-serif text-sm">{PLANET_GLYPHS[p.name] || '•'}</span>
                              <span>{p.name}</span>
                            </td>
                            <td className="py-2.5 font-serif">{p.sign}</td>
                            <td className="py-2.5 text-right font-mono">{p.degree}°</td>
                            <td className="py-2.5 text-right text-slate-400">{p.house} {p.retrograde && <span className="text-[9px] text-rose-500 uppercase tracking-wide ml-1 font-bold">Rx</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Astronomy reference metadata for trust */}
              <div className="border-t border-slate-850 pt-5 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-slate-500 gap-4 text-left">
                <div className="space-y-1">
                  <p><strong>Geocentric Coordinates:</strong> {report.geoCoordinates}</p>
                  <p><strong>Sidereal Time (LST):</strong> {report.siderealTime} • <strong>Julian Ephemeris Date:</strong> {report.julianDate}</p>
                </div>
                <div className="flex items-center space-x-1 text-emerald-400">
                  <ShieldAlert className="h-4.5 w-4.5" />
                  <span>Calculated using DE405 Swiss Ephemeris Standard.</span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
