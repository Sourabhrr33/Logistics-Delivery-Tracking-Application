import { Routes, Route } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import ForgotPassword from '../pages/Auth/ForgotPassword'

const PublicRoutes = () => (
  <Routes>
    <Route index element={<Login />} />
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<Signup />} />
    <Route path="forgot" element={<ForgotPassword />} />
  </Routes>
)

export default PublicRoutes
