self.addEventListener('push', function(event) {
  // console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  /*
   * response format: (https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification)
   * ----------------
    {
      "title": "残響散歌（Aimer Official YouTube Channel）",
      "body": "Aimer「残響散歌」MUSIC VIDEO（テレビアニメ「鬼滅の刃」遊郭編オープニングテーマ）",
      "icon": "https://blog.lalacube.com/mei/img/icon/icon-push-messaging-aimer.png",
      "badge": "https://blog.lalacube.com/mei/img/icon/icon-push-messaging-aimer.png",
      "vibrate": [200, 100, 200, 100, 200, 100, 200],
      "data": {
        "calltoaction": "https://www.youtube.com/watch?v=tLQLa6lM3Us"
      }
    }
  */

  const data = event.data.json();
  const { title, ...options } = data;
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  // notification has been clicked, developers could add tracking here.
  // console.log('[Service Worker] Notification click Received.');
  const { data:{ calltoaction } = {} } = event.notification;

  event.notification.close();
  event.waitUntil(
    clients.openWindow(calltoaction)
  );
});

self.addEventListener('notificationclose', function(event){
  // user doesn't response or close
});