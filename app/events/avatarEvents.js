const subscribers = new Set();

export function subscribeToAvatarEvents(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

export function sendAvatarEvent(event) {
  subscribers.forEach((cb) => cb(event));
}
