export const openapi = {
  openapi: '3.0.0',
  info: { title: 'Watchlist API', version: '1.0.0' },
  paths: {
    '/auth/login': { post: { summary: 'Login', responses: { '200': { description: 'OK' } } } },
    '/auth/register': { post: { summary: 'Register (may be disabled)', responses: { '200': { description: 'OK' }, '403': { description: 'Disabled' } } } },
    '/reviews': { get: { summary: 'List reviews' }, post: { summary: 'Create review' } },
    '/reviews/{slug}': { get: { summary: 'Get review detail' } },
    '/watchlist': { get: { summary: 'List watchlist' }, post: { summary: 'Upsert watchlist' } },
    '/viewings/{id}': { get: { summary: 'Get viewing' } },
    '/search': { get: { summary: 'Search external APIs' } },
  },
}


