import { useState } from 'react';

const GeoBlockTester = ({ onTest }) => {
  const [url, setUrl] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸', lat: 37.0902, lng: -95.7129 },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lat: 55.3781, lng: -3.4360 },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', lat: 51.1657, lng: 10.4515 },
    { code: 'FR', name: 'France', flag: '🇫🇷', lat: 46.2276, lng: 2.2137 },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', lat: 36.2048, lng: 138.2529 },
    { code: 'CN', name: 'China', flag: '🇨🇳', lat: 35.8617, lng: 104.1954 },
    { code: 'IN', name: 'India', flag: '🇮🇳', lat: 20.5937, lng: 78.9629 },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', lat: -14.2350, lng: -51.9253 },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', lat: -25.2744, lng: 133.7751 },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', lat: 56.1304, lng: -106.3468 },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', lat: 61.5240, lng: 105.3188 },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', lat: 1.3521, lng: 103.8198 },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', lat: 23.4241, lng: 53.8478 },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', lat: -30.5595, lng: 22.9375 },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', lat: 23.6345, lng: -102.5528 },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', lat: 40.4637, lng: -3.7492 },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', lat: 41.8719, lng: 12.5674 },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', lat: 35.9078, lng: 127.7669 },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', lat: 52.1326, lng: 5.2913 },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', lat: 60.1282, lng: 18.6435 },
  ];

  const toggleCountry = (country) => {
    if (selectedCountries.find(c => c.code === country.code)) {
      setSelectedCountries(selectedCountries.filter(c => c.code !== country.code));
    } else {
      if (selectedCountries.length < 10) {
        setSelectedCountries([...selectedCountries, country]);
      }
    }
  };

  const normalizeUrl = (inputUrl) => {
    let normalized = inputUrl.trim();
    
    // Add https:// if no protocol
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = 'https://' + normalized;
    }
    
    // Add .com if no TLD and no path
    if (!normalized.match(/\.[a-z]{2,}(\/|$)/i)) {
      normalized = normalized + '.com';
    }
    
    return normalized;
  };

  const handleTest = async () => {
    if (!url || selectedCountries.length === 0) return;

    const normalizedUrl = normalizeUrl(url);
    setLoading(true);
    await onTest({ url: normalizedUrl, countries: selectedCountries });
    setLoading(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* URL Input */}
      <div>
        <label className="text-slate-400 text-xs sm:text-sm mb-2 block font-medium">Website URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Country Selection */}
      <div>
        <label className="text-slate-400 text-xs sm:text-sm mb-2 block font-medium">
          Select Countries <span className="text-blue-400">({selectedCountries.length}/10)</span>
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-80 sm:max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
          {countries.map((country) => {
            const isSelected = selectedCountries.find(c => c.code === country.code);
            return (
              <button
                key={country.code}
                onClick={() => toggleCountry(country)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-2.5 sm:py-2 rounded-lg border transition-all text-left active:scale-95 ${
                  isSelected
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-sm shadow-blue-500/20'
                    : 'bg-slate-800/40 border-slate-700/30 text-slate-300 hover:border-slate-600 active:bg-slate-800/60'
                }`}
              >
                <span className="text-lg sm:text-xl">{country.flag}</span>
                <span className="text-xs sm:text-sm flex-1 font-medium">{country.name}</span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Test Button */}
      <button
        onClick={handleTest}
        disabled={!url || selectedCountries.length === 0 || loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-98 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all shadow-lg disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Testing...
          </span>
        ) : (
          <span className="text-sm sm:text-base">
            Test {selectedCountries.length} {selectedCountries.length === 1 ? 'Country' : 'Countries'}
          </span>
        )}
      </button>

      {selectedCountries.length === 0 && (
        <p className="text-slate-500 text-xs text-center">
          Select at least one country to test
        </p>
      )}
    </div>
  );
};

export default GeoBlockTester;
