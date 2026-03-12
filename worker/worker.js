const ROUTES = {
  '/api/bis': 'https://services-bs.solutions.hydroquebec.com/pan/web/api/v1/bis',
  '/api/outages': 'https://services5.arcgis.com/0akaykIdiPuMhFIy/arcgis/rest/services/bs_infoPannes_prd_vue/FeatureServer/0/query?where=1%3D1&outFields=*&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&resultType=tile&f=geojson',
  '/api/polygons': 'https://services5.arcgis.com/0akaykIdiPuMhFIy/arcgis/rest/services/bs_infoPannes_prd_vue/FeatureServer/1/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&geometryPrecision=5&resultType=tile&f=geojson',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CACHE_TTL = 30; // seconds

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const upstream = ROUTES[url.pathname];

    if (!upstream) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const cache = caches.default;
    const cacheKey = new Request(url.toString(), { method: 'GET' });

    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(upstream, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; HydroProxy/1.0)',
        },
      });

      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Upstream returned ' + response.status }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      const body = await response.text();
      const result = new Response(body, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=' + CACHE_TTL,
          ...CORS_HEADERS,
        },
      });

      // Store a clone in cache (response body can only be consumed once)
      await cache.put(cacheKey, result.clone());

      return result;
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Upstream fetch failed', detail: err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  },
};
