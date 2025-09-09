import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom"
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './pages/App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Nav from './components/Nav.jsx'
import EmailValidado from './pages/EmailValidado.jsx'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Navigate to="/inicio">
      <Nav />
      <App />
    </Navigate>
  },
  {
    path: "/inicio",
    element: <>
      <Nav />
      <App />
    </>
  },
  {
    path: "/emailValidado",
    element: <>
      <Nav />
      <EmailValidado />
    </>
  }
])

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#ebebeb'
      }
    }
  }
})

createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>,
)
