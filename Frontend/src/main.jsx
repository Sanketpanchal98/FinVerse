import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Authentication from './pages/Authentication.jsx'
import { Provider } from 'react-redux'
import { store } from './Store/Store.jsx'
import RootEndPoint from './components/RootEndPoint.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ExpensesData from './components/ExpensesData.jsx'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'
import ChartVisualization from './Dashboard-comp/ChartVisualization.jsx'
import FinGoals from './Dashboard-comp/FinGoals.jsx'
import Autopay from './Dashboard-comp/Autopay.jsx'
import Calculators from './Dashboard-comp/Calculators.jsx'
import SettingsProf from './Dashboard-comp/SettingsProf.jsx'
import { ErrorBoundary } from 'react-error-boundary'
import CustomErrorFallback from './components/CustomErrorFallback.jsx'
import ResetPass from './components/ResetPass.jsx'
import ResetEmail from './components/ResetEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <ErrorBoundary FallbackComponent={CustomErrorFallback} >
      {/* <NavigationProvider> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route element={<RootEndPoint><ProtectedRoutes /></RootEndPoint>}>
            <Route path="/dashboard" element={<Dashboard />} >
              <Route index element={<ExpensesData />} />
              <Route path='/dashboard/visualization' element={<ChartVisualization />} />
              <Route path='/dashboard/goal' element={<FinGoals />} />
              <Route path='/dashboard/autopay' element={<Autopay />} />
              <Route path='/dashboard/calculators' element={<Calculators />} />
              <Route path='/dashboard/settings' element={<SettingsProf />} />
              <Route path='/dashboard/resetpassword' element={<ResetPass />} />
              <Route path='/dashboard/resetemail' element={<ResetEmail />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
    {/* </NavigationProvider> */}
  </Provider>
  // </StrictMode>,
)
