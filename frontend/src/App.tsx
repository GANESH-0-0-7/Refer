import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ProfilePage } from '@/components/profile/ProfilePage'
import { CompanyDetailsPage } from '@/features/marketplace/pages/CompanyDetailsPage'
import { JobDetailsPage } from '@/features/marketplace/pages/JobDetailsPage'
import { MarketplacePage } from '@/features/marketplace/pages/MarketplacePage'
import { RootState } from './store'
import { setUser } from './store/authSlice'

import ProtectedRoute from './components/ProtectedRoute'

import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken && !isAuthenticated) {
      try {
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]))

        dispatch(
          setUser({
            id: tokenPayload.sub ? parseInt(tokenPayload.sub) : 0,
            email: tokenPayload.email || tokenPayload.sub || '',
            firstName: 'User',
            lastName: '',
            roles: tokenPayload.authorities?.split(',') || [],
          })
        )
      } catch (error) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }
  }, [dispatch, isAuthenticated])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
        />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
        />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:slug"
          element={
            <ProtectedRoute>
              <JobDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/companies/:slug"
          element={
            <ProtectedRoute>
              <CompanyDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
