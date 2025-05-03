import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

import NotFound from './components/NotFound/NotFound.jsx';

import HomePage from './pages/HomePage.jsx';
import VacanciesPage from './pages/VacanciesPage.jsx';
import VacancieLookPage from './pages/VacancieLookPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx'
import ContactsPage from './pages/ContactsPage.jsx';

import LoginPage from './pages/LoginPage.jsx';
import LogOut from './components/LogOut/LogOut.jsx';
import Unauthorized from './components/Unauthorized/Unauthorized.jsx';

import VacanciesResponses from './pages/VacanciesResponses.jsx';
import ResponsePage from './pages/ResponsePage.jsx';
import VacanciesList from './pages/VacanciesList.jsx';
import VacancyCreate from './pages/VacancyCreate.jsx';
import VacancyEdit from './pages/VacancyEdit.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<NotFound />} />



        <Route path="/home" element={<HomePage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/vacancies/:id" element={<VacancieLookPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contacts" element={<ContactsPage />} />



        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/unauthorized" element={<Unauthorized />} />



        <Route path="/vacancies-responses/" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <VacanciesResponses />
          </ProtectedRoute>
        } />
        <Route path="/vacancies-responses/:id" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ResponsePage />
          </ProtectedRoute>
        } />
        <Route path="/vacancies-list" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <VacanciesList />
          </ProtectedRoute>
        } />
        <Route path="/vacancy-create" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <VacancyCreate />
          </ProtectedRoute>
        } />
        <Route path="/vacancy-edit/:id" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <VacancyEdit />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
