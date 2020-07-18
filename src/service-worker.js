importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js');

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST, {
  ignoreURLParametersMatching: [/.*/]
});

const ignoreQueryStringPlugin = {
  cachedResponseWillBeUsed: ({ request, cachedResponse }) => {
    if (cachedResponse) {
      return cachedResponse;
    }
    return caches.match(request.url, { ignoreSearch: true });
  }
};

workbox.routing.registerRoute(
  /https:\/\/api\.covid19api\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api-covid',
    plugins: [ignoreQueryStringPlugin]
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /https:\/\/stackpath\.bootstrapcdn\.com\/font\-awesome\/4\.7\.0\/css\/font\-awesome\.min\.css/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'fonts-awesome',
  })
);

workbox.routing.registerRoute(
  /https:\/\/www.countryflags\.io/,
  workbox.strategies.cacheFirst({
    cacheName: 'countries-flag',
  })
);
