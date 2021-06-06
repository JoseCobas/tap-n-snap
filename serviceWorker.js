importScripts('/src/utilities/idb-min.js');
importScripts('/src/utilities/IDB.js');

const cacheName = 'v1'

const cacheAssets = [
  'index.html',
  '/src/App.jsx'
]


self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed')

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files')
        cache.addAll(cacheAssets)
      })
      .then(() => self.skipWaiting())
  )

})


self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated')

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache != cacheName) {
            console.log('Service Worker: Clearing Old Cache')
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  if (!(e.request.url.indexOf('http') === 0)) return;

  console.log('Service Worker: Fetching')
  e.respondWith(
    fetch(e.request)
    .then(res => {
      const resClone = res.clone();
      caches
        .open(cacheName)
        .then(cache => {
          cache.put(e.request, resClone)
        })
      return res
    })
    .catch(err => caches.match(e.request).then(res => res))

  )
})

// 'sync' triggers when the service worker has
// access to the network
self.addEventListener('sync', evt => {
  if(evt.tag === 'sync-new-messages') {
    evt.waitUntil(onBackgroundSync());
  }
});

async function onBackgroundSync() {
  // get saved messages
  let posts = await IDB.getAll('sync-messages');

  // loop messages and send to server
  for (let post of posts) {
    let res = await fetch('http://localhost:4000/posts', {
      method: "post",
      headers: { 'Accept': 'application/json',
      'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });

    // when a message has been posted successfully 
    // we remove that message from indexedDB
    // so we don't resend it every time we go online
    res.ok && await IDB.remove('sync-messages', post.uuid);
  }
}
