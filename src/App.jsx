import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import GeoBlockTester from './components/GeoBlockTester';
import TestResultsList from './components/TestResultsList';
import { simulateGeoTest } from './services/geoblock';

// Lazy load the heavy MapView component
const MapView = lazy(() => import('./components/MapView'));

function App() {
  const [testResults, setTestResults] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [testing, setTesting] = useState(false);
  const [testedUrl, setTestedUrl] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Add page title and meta description dynamically
  useEffect(() => {
    document.title = 'GeoBlock Tester - Test Website Accessibility from 20+ Countries';
  }, []);

  // Memoize expensive calculations
  const stats = useMemo(() => {
    const accessible = testResults.filter(r => r.status === 'accessible').length;
    const blocked = testResults.filter(r => r.status === 'blocked').length;
    return { accessible, blocked, total: testResults.length };
  }, [testResults]);

  // Close mobile panels when test starts
  const handleTest = async ({ url, countries }) => {
    setShowControls(false);
    setShowResults(false);
    setTesting(true);
    setTestedUrl(url);
    setSelectedCountries(countries);
    setTestResults([]);

    // Test countries in parallel batches for speed
    const batchSize = 5;
    for (let i = 0; i < countries.length; i += batchSize) {
      const batch = countries.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(country => simulateGeoTest(url, country).catch(err => {
          console.error(`Error testing ${country.name}:`, err);
          return {
            country,
            status: 'error',
            error: 'Test failed',
            timestamp: new Date().toISOString()
          };
        }))
      );
      setTestResults(prev => [...prev, ...batchResults]);
      
      // Small delay between batches for smooth animation
      if (i + batchSize < countries.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    setTesting(false);
    // Auto-open results panel on mobile when test completes
    if (window.innerWidth < 1024) {
      setShowResults(true);
    }
  };



  return (
    <div className="relative w-screen h-screen bg-[#0a0e27] overflow-hidden">
      {/* Main Container */}
      <div className="h-full w-full flex flex-col">
        
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-b border-slate-700/30 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between max-w-[2000px] mx-auto">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowControls(!showControls)}
              className="lg:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg sm:text-xl">🌍</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-white">
                    GeoBlock Tester
                  </h1>
                  <p className="text-slate-400 text-xs hidden sm:block">Test website accessibility worldwide</p>
                </div>
              </div>
              
              {/* Stats Badge */}
              {stats.total > 0 && (
                <div className="ml-2 sm:ml-6 flex items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-1 bg-green-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-green-500/20">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-400 text-xs sm:text-sm font-semibold">
                      <span className="hidden sm:inline">{stats.accessible} Accessible</span>
                      <span className="sm:hidden">{stats.accessible}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-red-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-red-500/20">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-400 text-xs sm:text-sm font-semibold">
                      <span className="hidden sm:inline">{stats.blocked} Blocked</span>
                      <span className="sm:hidden">{stats.blocked}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right side - Social Links & Results Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Results Button */}
              {testResults.length > 0 && (
                <button
                  onClick={() => setShowResults(!showResults)}
                  className="lg:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors relative"
                  aria-label="View results"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>
              )}

              <div className="hidden sm:flex items-center gap-3">
              <a 
                href="https://github.com/huzaifsk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
                title="GitHub"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 1024 1024" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="currentColor"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/huzaif-shaikh/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-[#0A66C2] transition-colors" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"/>
                </svg>
              </a>
              <a 
                href="https://x.com/Huzaif__Shaikh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
                title="Twitter/X"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 1200 1227" fill="currentColor">
                  <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"/>
                </svg>
              </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Sidebar - GeoBlock Tester Controls (Desktop + Mobile Overlay) */}
          <div className={`
            fixed lg:relative
            top-0 left-0 bottom-0
            w-full sm:w-96
            bg-slate-900/98 lg:bg-slate-900/50
            backdrop-blur-sm
            border-r border-slate-700/30
            flex flex-col
            z-40
            transform transition-transform duration-300 ease-in-out
            ${showControls ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700/30">
              <h2 className="text-white font-semibold">Test Controls</h2>
              <button
                onClick={() => setShowControls(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <GeoBlockTester onTest={handleTest} />
            </div>
            
            {/* Info Footer */}
            <div className="p-4 border-t border-slate-700/30 bg-slate-900/30">
              <div className="text-xs text-slate-500 space-y-1">
                <p>💡 <strong className="text-slate-400">Tip:</strong> Test any website from up to 10 countries</p>
                <p>🆓 <strong className="text-slate-400">Free forever</strong> - No signup required</p>
              </div>
            </div>
          </div>

          {/* Backdrop for mobile panels */}
          {(showControls || showResults) && (
            <div
              className="lg:hidden fixed inset-0 bg-black/60 z-30"
              onClick={() => {
                setShowControls(false);
                setShowResults(false);
              }}
            />
          )}

          {/* Center - World Map */}
          <div className="flex-1 relative bg-slate-900/30">
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading globe...</p>
                </div>
              </div>
            }>
              <MapView 
                testResults={testResults} 
                selectedCountries={selectedCountries}
              />
            </Suspense>
            
            {testedUrl && (
              <div className="absolute top-3 left-3 right-3 sm:top-6 sm:left-6 sm:right-auto bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 sm:px-4 shadow-xl max-w-md">
                <p className="text-slate-500 text-xs mb-1">Testing URL</p>
                <p className="text-white text-xs sm:text-sm font-mono truncate">{testedUrl}</p>
              </div>
            )}

            {/* Mobile Action Buttons */}
            <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              <button
                onClick={() => setShowControls(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Test
              </button>
              {testResults.length > 0 && (
                <button
                  onClick={() => setShowResults(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Results ({testResults.length})
                </button>
              )}
            </div>
          </div>

          {/* Right Sidebar - Test Results (Desktop + Mobile Overlay) */}
          <div className={`
            fixed lg:relative
            top-0 right-0 bottom-0
            w-full sm:w-96
            bg-slate-900/98 lg:bg-slate-900/50
            backdrop-blur-sm
            border-l border-slate-700/30
            overflow-y-auto
            z-40
            transform transition-transform duration-300 ease-in-out
            ${showResults ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700/30 sticky top-0 bg-slate-900/95 z-10">
              <h2 className="text-white font-semibold">Test Results</h2>
              <button
                onClick={() => setShowResults(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <TestResultsList results={testResults} loading={testing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
