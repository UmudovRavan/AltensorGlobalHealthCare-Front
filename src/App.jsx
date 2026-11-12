import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <AppRouter />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
