import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import VacanciesPage from './pages/VacanciesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

function App() {
  return (
    <BrowserRouter basename='/yet-hr-platform-frontend/'>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="vacancies" element={<VacanciesPage />} />
        <Route path="login" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  );

}

export default App;
