// App Component
// App = Router + AuthProvider(AdminAuth) + UserProvider(UserAuth) + PublicRoutes + UserRoutes + PrivateRoutes(AdminLayout)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { PrivateRoute } from './components/PrivateRoute';

// Public Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryArticlesPage from './pages/CategoryArticlesPage';
import TagsPage from './pages/TagsPage';
import TagArticlesPage from './pages/TagArticlesPage';

// User Pages
import RegisterPage from './pages/user/RegisterPage';
import LoginPage from './pages/user/LoginPage';
import ProfilePage from './pages/user/ProfilePage';

// Admin Pages
import AdminLoginPage from './pages/admin/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ArticlesPage from './pages/admin/ArticlesPage';
import ArticleEditorPage from './pages/admin/ArticleEditorPage';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
import AdminTagsPage from './pages/admin/TagsPage';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Public Routes with User Integration */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/articles/:id" element={<ArticleDetailPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/categories/:slug" element={<CategoryArticlesPage />} />
                      <Route path="/tags" element={<TagsPage />} />
                      <Route path="/tags/:slug" element={<TagArticlesPage />} />

                      {/* User Routes */}
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />

            {/* Admin Login (No Auth) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Routes (Auth Required) */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="articles/new" element={<ArticleEditorPage />} />
              <Route path="articles/:id/edit" element={<ArticleEditorPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="tags" element={<AdminTagsPage />} />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}