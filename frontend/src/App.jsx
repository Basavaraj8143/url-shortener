import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import ProtectedRoute  from './components/ProtectedRoute'
import ErrorBoundary   from './components/ErrorBoundary'
import Landing from './pages/Landing'

// Everything except the landing page loads on demand.
const Login     = lazy(() => import('./pages/Login'))
const Register  = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CreateUrl = lazy(() => import('./pages/CreateUrl'))
const NotFound  = lazy(() => import('./pages/NotFound'))

function PageLoading() {
  return <div className="page auth-loading"><span className="spinner spinner-ink" aria-label="Loading page" /></div>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <ErrorBoundary>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/"         element={<Landing />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/dashboard/new" element={
                <ProtectedRoute><CreateUrl /></ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
