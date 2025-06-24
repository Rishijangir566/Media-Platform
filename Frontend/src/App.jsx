import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'
import GithubCallback from './GithubCallback'
import GoogleCallback from './Googlecallback'
import LinkedinCallback from './LinkedinCallback'
import RegisterPage from './RegisterPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/github-callback",
    element: <GithubCallback />
  },
  {
    path: "/google/callback",
    element: <GoogleCallback />
  },
  {
    path: "/linkedin/callback",
    element: <LinkedinCallback />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App