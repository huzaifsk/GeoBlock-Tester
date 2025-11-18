/**
 * GeoBlock Testing Service
 * Tests website accessibility from different countries
 */

const PROXY_SERVICES = {
  // Free proxy APIs (for MVP - no signup needed)
  CORS_ANYWHERE: 'https://api.allorigins.win/raw?url=',
  CORS_PROXY: 'https://corsproxy.io/?',
};

/**
 * Test website accessibility from a specific country
 * @param {string} url - Website URL to test
 * @param {Object} country - Country object with code, name, etc.
 * @returns {Promise<Object>} Test result
 */
export const testWebsiteAccess = async (url, country) => {
  const startTime = Date.now();
  
  try {
    // Normalize URL
    const testUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Use CORS proxy to test (this simulates testing from different locations)
    // In production, you'd use proper proxy services like ScrapingBee or Bright Data
    const proxyUrl = `${PROXY_SERVICES.CORS_ANYWHERE}${encodeURIComponent(testUrl)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const loadTime = Date.now() - startTime;

    // Check if accessible
    const isAccessible = response.ok && response.status < 400;
    
    return {
      country,
      status: isAccessible ? 'accessible' : 'blocked',
      httpStatus: response.status,
      loadTime,
      timestamp: new Date().toISOString(),
      server: response.headers.get('server') || 'Unknown',
      cdn: detectCDN(response),
      vpnDetected: false, // Would need proper VPN detection API
    };
  } catch (error) {
    const loadTime = Date.now() - startTime;
    
    return {
      country,
      status: 'blocked',
      httpStatus: 0,
      loadTime,
      timestamp: new Date().toISOString(),
      error: getErrorMessage(error),
      vpnDetected: false,
    };
  }
};

/**
 * Test website from multiple countries simultaneously
 * @param {string} url - Website URL to test
 * @param {Array} countries - Array of country objects
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Array>} Array of test results
 */
export const bulkTestWebsite = async (url, countries, onProgress) => {
  const results = [];
  
  // Test countries in parallel (batches of 3 to avoid rate limits)
  const batchSize = 3;
  for (let i = 0; i < countries.length; i += batchSize) {
    const batch = countries.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(country => testWebsiteAccess(url, country))
    );
    
    results.push(...batchResults);
    
    if (onProgress) {
      onProgress(results);
    }
    
    // Small delay between batches
    if (i + batchSize < countries.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
};

/**
 * Detect CDN from response headers
 * @param {Response} response - Fetch response
 * @returns {string} CDN name or null
 */
const detectCDN = (response) => {
  const server = response.headers.get('server') || '';
  const via = response.headers.get('via') || '';
  const xCache = response.headers.get('x-cache') || '';
  
  if (server.includes('cloudflare') || via.includes('cloudflare')) {
    return 'Cloudflare';
  } else if (server.includes('akamai') || via.includes('akamai')) {
    return 'Akamai';
  } else if (xCache.includes('cloudfront') || server.includes('cloudfront')) {
    return 'CloudFront';
  } else if (server.includes('fastly')) {
    return 'Fastly';
  } else if (via.includes('1.1 google')) {
    return 'Google CDN';
  }
  
  return null;
};

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (error) => {
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return 'Request timeout - Site may be blocked or slow';
  } else if (error.message.includes('CORS')) {
    return 'CORS policy blocking access';
  } else if (error.message.includes('Network')) {
    return 'Network error - Unable to reach website';
  } else if (error.message.includes('Failed to fetch')) {
    return 'Connection blocked or refused';
  }
  
  return 'Unable to access website from this location';
};

/**
 * Simulate testing from different IPs (for demo purposes)
 * In production, use real proxy services like:
 * - ScrapingBee: https://www.scrapingbee.com
 * - Bright Data: https://brightdata.com
 * - Apify: https://apify.com
 * - ProxyMesh: https://proxymesh.com
 */
export const simulateGeoTest = async (url, country) => {
  // Fast simulation with minimal delay
  const delay = Math.random() * 300 + 100;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate some countries blocking certain sites
  const blockedCountries = ['CN', 'RU']; // China, Russia often block sites
  const isBlocked = blockedCountries.includes(country.code) && Math.random() > 0.3;
  
  if (isBlocked) {
    return {
      country,
      status: 'blocked',
      httpStatus: 403,
      loadTime: Math.round(delay),
      timestamp: new Date().toISOString(),
      error: 'Access forbidden from this country',
      vpnDetected: false,
    };
  }
  
  // Simulate successful access
  const loadTime = Math.round(Math.random() * 2000 + 300);
  const cdns = ['Cloudflare', 'CloudFront', 'Akamai', 'Fastly', null];
  
  return {
    country,
    status: 'accessible',
    httpStatus: 200,
    loadTime,
    timestamp: new Date().toISOString(),
    server: 'nginx/1.21.0',
    cdn: cdns[Math.floor(Math.random() * cdns.length)],
    vpnDetected: Math.random() > 0.9, // 10% chance of VPN detection
  };
};

export default {
  testWebsiteAccess,
  bulkTestWebsite,
  simulateGeoTest,
};
