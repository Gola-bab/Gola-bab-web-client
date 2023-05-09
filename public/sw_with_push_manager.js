// 서비스 워커 캐싱
self.addEventListener('fetch', async (event) => {
  if (
    event.request.url.startsWith('http://dapi.kakao.com/v2/local/search/') ||
    event.request.url.startsWith('https://dapi.kakao.com/v2/local/search/')
  ) {
    try {
      const cache = await caches.open('cache-v1');
      const response = await cache.match(event.request);
      if (response) {
        console.log('cache hit!!');
        console.log(response);
        return response;
      } else {
        const fetchResponse = await fetch(event.request);
        const cacheHeaders = new Headers(fetchResponse.headers);
        cacheHeaders.append('Cache-Control', 'max-age=3600');
        const cachedResponse = new Response(fetchResponse.body, {
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: cacheHeaders,
        });
        await cache.put(event.request, cachedResponse);
        return fetchResponse;
      }
    } catch (error) {
      // if fetching fails, skip the request
    }
  }
});

// 서비스워커 변경시 업데이트
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = event.data.json();
  const image = 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1566557331/noticon/d5hqar2idkoefh6fjtpu.png';
  const options = {
    body: data.teamId,
    icon: image,
  };
  self.registration.showNotification(data.teamName, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  console.log(event.notification.data.json());
  event.waitUntil(self.clients.openWindow('https://web.dev'));
});
