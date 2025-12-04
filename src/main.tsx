import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import store from './store/index'
import './index.css'
import { subscribe } from './mocks/notify'
import { pushNotification } from './store/slices/notificationsSlice'

subscribe((notification: any) => {
store.dispatch(pushNotification(notification))
})



// start MSW in dev
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  })
}


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
