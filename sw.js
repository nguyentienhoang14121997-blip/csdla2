// Service Worker: luôn ưu tiên lấy bản MỚI NHẤT từ máy chủ (network-first),
// chỉ dùng bản lưu tạm khi thực sự mất mạng. Tự dọn cache cũ mỗi khi có bản mới
// để icon trên màn hình chính điện thoại không bị kẹt hiển thị bản cũ.
const CACHE = 'qlhs-cache-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
