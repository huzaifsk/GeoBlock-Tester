import { memo } from 'react';

const TestResultsList = memo(({ results, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="text-center px-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="text-slate-400 text-sm sm:text-base">Testing websites from multiple locations...</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🌍</div>
        <p className="text-slate-400 text-xs sm:text-sm">
          No tests yet. Select countries and enter a URL to start testing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3">
      <h3 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
        <span>Test Results</span>
        <span className="text-blue-400 text-xs sm:text-sm bg-blue-500/10 px-2 py-0.5 rounded">({results.length})</span>
      </h3>
      
      <div className="space-y-2.5 sm:space-y-3">
      {results.map((result, index) => (
        <div
          key={index}
          className={`bg-slate-800/60 rounded-lg p-3 sm:p-4 border transition-all ${
            result.status === 'accessible'
              ? 'border-green-500/30 hover:border-green-500/50'
              : result.status === 'blocked'
              ? 'border-red-500/30 hover:border-red-500/50'
              : 'border-slate-700/50'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">{result.country.flag}</span>
              <div>
                <h4 className="text-white font-medium text-xs sm:text-sm">
                  {result.country.name}
                </h4>
                <p className="text-slate-400 text-[10px] sm:text-xs">{result.country.code}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {result.status === 'accessible' ? (
                <span className="flex items-center gap-0.5 sm:gap-1 bg-green-500/20 text-green-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Accessible</span>
                  <span className="sm:hidden">✓</span>
                </span>
              ) : result.status === 'blocked' ? (
                <span className="flex items-center gap-0.5 sm:gap-1 bg-red-500/20 text-red-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Blocked</span>
                  <span className="sm:hidden">✗</span>
                </span>
              ) : (
                <span className="flex items-center gap-0.5 sm:gap-1 bg-yellow-500/20 text-yellow-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium animate-pulse">
                  <span className="hidden sm:inline">Testing...</span>
                  <span className="sm:hidden">...</span>
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs">
            {result.loadTime && (
              <div className="bg-slate-900/50 rounded p-1.5 sm:p-2">
                <p className="text-slate-500 mb-0.5 text-[9px] sm:text-xs">Load Time</p>
                <p className="text-slate-300 font-medium text-[10px] sm:text-xs">{result.loadTime}ms</p>
              </div>
            )}
            
            {result.httpStatus && (
              <div className="bg-slate-900/50 rounded p-1.5 sm:p-2">
                <p className="text-slate-500 mb-0.5 text-[9px] sm:text-xs">HTTP Status</p>
                <p className={`font-medium ${
                  result.httpStatus >= 200 && result.httpStatus < 300
                    ? 'text-green-400'
                    : result.httpStatus >= 400
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`}>
                  {result.httpStatus}
                </p>
              </div>
            )}

            {result.cdn && (
              <div className="bg-slate-900/50 rounded p-1.5 sm:p-2">
                <p className="text-slate-500 mb-0.5 text-[9px] sm:text-xs">CDN</p>
                <p className="text-slate-300 text-[10px] sm:text-xs truncate">{result.cdn}</p>
              </div>
            )}

            {result.server && (
              <div className="bg-slate-900/50 rounded p-1.5 sm:p-2">
                <p className="text-slate-500 mb-0.5 text-[9px] sm:text-xs">Server</p>
                <p className="text-slate-300 text-[10px] sm:text-xs truncate">{result.server}</p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {result.error && (
            <div className="mt-2 sm:mt-3 bg-red-900/20 border border-red-500/30 rounded p-2">
              <p className="text-red-400 text-[10px] sm:text-xs">{result.error}</p>
            </div>
          )}

          {/* VPN Detection */}
          {result.vpnDetected && (
            <div className="mt-2 sm:mt-3 bg-orange-900/20 border border-orange-500/30 rounded p-2 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-orange-400 text-[10px] sm:text-xs">VPN/Proxy detected</p>
            </div>
          )}

          {/* Timestamp */}
          <p className="text-slate-600 text-[10px] sm:text-xs mt-2 sm:mt-3">
            Tested at {new Date(result.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ))}
      </div>
    </div>
  );
});

TestResultsList.displayName = 'TestResultsList';

export default TestResultsList;
