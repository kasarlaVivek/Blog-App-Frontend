import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from "./Components/Home"
import RootLayout from './Components/RootLayout'
import Login from './Components/Login'
import Register from './Components/Register'
import UserDashboard from './Components/UserDashboard'
import AuthorDashboard from './Components/AuthorDashboard'
import AdminDashboard from './Components/AdminDashboard'
import { Toaster } from "react-hot-toast";
import ArticleByID from './Components/ArticleById'
import AuthorArticle from "./Components/AuthorArticle"
import WriteArticle from './Components/WriteArticle'
import EditArticle from './Components/EditArticleForm'
import ProtectedRoute from './Components/ProtectedRoute'
import Unauthorized from './Components/Unauthorized'
import { useEffect } from 'react'
import { useAuth } from './store/globalStore'

function App() {
  let { currentUser, isAuthenticated, checkAuth, loading } = useAuth();

  const routerObj = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          path: '',
          element: <Home />
        }, {
          path: 'login',
          element: <Login />
        }, {
          path: 'register',
          element: <Register />
        }, {
          path: 'user-dashboard',
          element:
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
        }, {
          path: 'author-dashboard',
          element:
            <ProtectedRoute allowedRoles={["AUTHOR"]}>
              <AuthorDashboard />
            </ProtectedRoute>,
          children: [
            {
              index: true,
              element: <AuthorArticle />,
            },
            {
              path: "articles",
              element: <AuthorArticle />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            }, 
          ],
        }, {
          path: 'admin-dashboard',
          element: <AdminDashboard />
        }, {
          path: "article/:id",
          element: <ArticleByID />,
        }, {
          path: "unauthorized",
          element: <Unauthorized />
        },
        { path: "edit-article/:id", element: <EditArticle /> }
      ]
    }
  ]);
  useEffect(() => {
    checkAuth();
  }, []);
  


  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>)
}

export default App
