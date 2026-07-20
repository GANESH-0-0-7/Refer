import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { store } from './store'
import App from './App'
import { ToastContainer } from './components/ToastContainer'
import { ToastProvider } from './components/ToastProvider'
import './styles/globals.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
