import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GoogleLogin from './components/GoogleLogin';
import CallbackHandler from './components/CallbackHandler';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoogleLogin />} />
        <Route path="/auth/callback" element={<CallbackHandler />} />
        <Route path="/auth/google/callback" element={<CallbackHandler />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;