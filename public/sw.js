self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  // Basic passthrough; hook for offline logic
})

