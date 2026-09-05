import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/auth/LoginPage';
import UsuariosPage from '../pages/usuarios/UsuariosPage';

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<LoginPage/>}/>
                
                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute>
                        <AppLayout titulo="Usuarios y roles" breadcrumb="Administración / Usuarios">
                            <UsuariosPage />
                        </AppLayout>
                        </ProtectedRoute>
                    }
                />
                
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;