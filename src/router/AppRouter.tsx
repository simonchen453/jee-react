import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import Layout from '../pages/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// 懒加载页面组件
const Login = lazy(() => import('../pages/Login/Login.tsx'));
const Home = lazy(() => import('../pages/Home'));
const UserList = lazy(() => import('../pages/User/UserList'));
const RoleList = lazy(() => import('../pages/Role/RoleList'));
const MenuList = lazy(() => import('../pages/Menu/MenuList'));
const DomainList = lazy(() => import('../pages/Domain/DomainList'));
const ChangePassword = lazy(() => import('../pages/ChangePassword/ChangePassword'));
const NoPermission = lazy(() => import('../pages/NoPermission'));
const NotFound = lazy(() => import('../pages/NotFound'));

// 加载中组件
const LoadingSpinner = () => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
    }}>
        <Spin size="large" />
    </div>
);

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login" 
                    element={
                        <PublicRoute>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Login />
                            </Suspense>
                        </PublicRoute>
                    } 
                />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route 
                        index 
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <Home />
                            </Suspense>
                        } 
                    />
                    <Route 
                        path="home" 
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <Home />
                            </Suspense>
                        } 
                    />
                    <Route
                        path="admin/user" 
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <UserList />
                            </Suspense>
                        } 
                    />
                    <Route
                        path="admin/role" 
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <RoleList />
                            </Suspense>
                        } 
                    />
                    <Route
                        path="admin/menu" 
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <MenuList />
                            </Suspense>
                        } 
                    />
                    <Route
                        path="admin/domain" 
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <DomainList />
                            </Suspense>
                        } 
                    />

                    <Route
                        path="changepwd"
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <ChangePassword />
                            </Suspense>
                        }
                    />
                </Route>

                <Route
                    path="/no-permission" 
                    element={
                        <Suspense fallback={<LoadingSpinner />}>
                            <NoPermission />
                        </Suspense>
                    } 
                />
                <Route 
                    path="*" 
                    element={
                        <Suspense fallback={<LoadingSpinner />}>
                            <NotFound />
                        </Suspense>
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;