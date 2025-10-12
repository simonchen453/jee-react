import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import Layout from '../pages/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// 懒加载页面组件
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const UserList = lazy(() => import('../pages/User/UserList'));
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
                                <Dashboard />
                            </Suspense>
                        } 
                    />
                    <Route 
                        path="users" 
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <UserList />
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;