// No authenticated pages, API data, or property images are cached offline.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);
self.addEventListener("push", (event) => {
  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || "Office Scout", {
      body: payload.body || "A new update is available.",
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: payload.tag || "office-scout",
      data: { url: payload.url || "/" },
    }),
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  let url = new URL("/", self.location.origin);
  try {
    const requested = new URL(
      event.notification.data.url,
      self.location.origin,
    );
    if (requested.origin === self.location.origin) url = requested;
  } catch {
    /* Open home for malformed targets. */
  }
  event.waitUntil(self.clients.openWindow(url.href));
});
