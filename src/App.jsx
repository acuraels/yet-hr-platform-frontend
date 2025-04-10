import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';

function App() {
  return (
    <BrowserRouter basename='/yet-hr-platform-frontend/'>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App;
