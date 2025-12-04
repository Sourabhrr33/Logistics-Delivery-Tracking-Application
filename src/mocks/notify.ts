// Event bus for MSW → Frontend notifications
export const listeners: any[] = []

export const subscribe = (fn: any) => {
  listeners.push(fn)
}

export const broadcast = (msg: any) => {
  listeners.forEach((fn) => fn(msg))
}

// MSW will call this function when a notification-worthy event happens
export const pushNotificationEvent = (notification: any) => {
  broadcast(notification)
}
