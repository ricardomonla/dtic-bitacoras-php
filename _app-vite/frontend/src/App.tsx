import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tecnicos from './pages/TecnicosRefactored'
import Tareas from './pages/Tareas'
import Reportes from './pages/Reportes'
import Usuarios from './pages/Usuarios'
import Calendario from './pages/Calendario'
import Recursos from './pages/Recursos'
import Estadoproyecto from './pages/Estadoproyecto'
import PrivateRoute from './components/auth/PrivateRoute'

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/tecnicos" element={<PrivateRoute><Tecnicos /></PrivateRoute>} />
          <Route path="/tareas" element={<PrivateRoute><Tareas /></PrivateRoute>} />
          <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
          <Route path="/calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
          <Route path="/recursos" element={<PrivateRoute><Recursos /></PrivateRoute>} />
          <Route path="/estadoproyecto" element={<PrivateRoute><Estadoproyecto /></PrivateRoute>} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App