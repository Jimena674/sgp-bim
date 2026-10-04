import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/auth/LoginPage';
import UsuariosPage from '../pages/usuarios/UsuariosPage';
import RolesPage from '../pages/roles/RolesPage';
import AccesosPage from '../pages/accesos/AccesosPage';
import TiposPage from '../pages/configuracion/TiposPage';

function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<LoginPage/>}/>
                
                <Route path="/usuarios" element={
                    <ProtectedRoute>
                        <AppLayout titulo="Usuarios" breadcrumb="Administración / Usuarios">
                            <UsuariosPage />
                        </AppLayout>
                    </ProtectedRoute>
                }/>

                <Route path="/roles" element={
                    <ProtectedRoute>
                        <AppLayout titulo="Roles y permisos" breadcrumb="Administración / Roles">
                            <RolesPage />
                        </AppLayout>
                    </ProtectedRoute>
                }/>

                <Route path="/accesos" element={
                    <ProtectedRoute>
                        <AppLayout titulo="Control de acceso" breadcrumb="Administración / Control de acceso">
                            <AccesosPage />
                        </AppLayout>
                    </ProtectedRoute>
                }/>

                <Route path="*" element={<Navigate to="/usuarios" replace />} />

                <Route path="/configuracion/tipos" element={
                    <ProtectedRoute>
                        <AppLayout titulo="Tipos" breadcrumb="Sistema / Configuración / Tipos">
                            <TiposPage />
                        </AppLayout>
                    </ProtectedRoute>
                }/>
                
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;