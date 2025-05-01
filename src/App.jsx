import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import VacanciesPage from './pages/VacanciesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import VacanciesResponses from './pages/VacanciesResponses.jsx';
import VacanciesList from './pages/VacanciesList.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx'
import ContactsPage from './pages/ContactsPage.jsx';
import VacancieLookPage from './pages/VacancieLookPage.jsx';
import ResponsePage from './pages/ResponsePage.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import VacancyCreate from './pages/VacancyCreate.jsx';
import VacancyEdit from './pages/VacancyEdit.jsx';

function App() {
  return (
    <BrowserRouter basename='/yet-hr-platform-frontend/'>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/vacancies/:id" element={<VacancieLookPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contacts" element={<ContactsPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/vacancies-responses" element={<VacanciesResponses />} />
        <Route path="/vacancies-responses/:id" element={<ResponsePage />} />
        <Route path="/vacancies-list" element={<VacanciesList />} />
        <Route path="/vacancy-create" element={<VacancyCreate />} />
        <Route path="/vacancy-edit" element={<VacancyEdit />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );

}

export default App;
