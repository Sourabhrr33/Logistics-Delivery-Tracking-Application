import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import store from './store/index'
import './index.css'
import { subscribe } from './mocks/notify'
import { pushNotification } from './store/slices/notificationsSlice'

// Listen for MSW → frontend notifications
subscribe((notification: any) => {
  store.dispatch(pushNotification(notification))
})


async function enableMocking() {
  // ONLY load MSW if running in browser
  if (typeof window === 'undefined') return

  const { worker } = await import('./mocks/browser')

  return worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js', 
    },
    onUnhandledRequest: 'bypass',   
  })
}

// Start MSW before rendering the app
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  )
})
