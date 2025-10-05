import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Books from './pages/Books'
import ProtectedRoute from './routes/ProtectedRoute'
import './styles.css'


const router = createBrowserRouter([
	// Mostrar primero Login
	{ path: '/', element: <Login /> },
	// CRUD protegido
	{
		path: '/books',
		element: (
			<ProtectedRoute>
				<Books />
			</ProtectedRoute>
		),
	},
	// Ruta explícita de login con redirect "next"
	{ path: '/login', element: <Login /> },
])


ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<RouterProvider router={router} />
</React.StrictMode>,
)