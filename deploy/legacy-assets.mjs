import pins from './mounts.json';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const [, mount, folder] = url.pathname.split('/');
    const pin = Object.hasOwn(pins.mounts, mount) && pins.mounts[mount];
    if (!pin || !pin.folders.includes(folder)) return env.ASSETS.fetch(request);
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, {status: 405, headers: {Allow: 'GET, HEAD'}});
    // All upstream origins are pinned here. Only public content negotiation and range headers travel upstream.
    const upstream = new URL(pin.origin);
    upstream.pathname = url.pathname.slice(mount.length + 1);
    upstream.search = url.search;
    const headers = new Headers();
    for (const name of ['Accept', 'Range', 'If-Range', 'If-None-Match', 'If-Modified-Since']) {
      if (request.headers.has(name)) headers.set(name, request.headers.get(name));
    }
    return fetch(upstream, {method: request.method, headers, redirect: 'manual'});
  }
};
