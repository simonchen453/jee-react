import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useAuthStore } from '../../stores/useUserStore.ts';
import type { LoginRequest } from '../../types/index';
import './Login.css';

const loginSchema = z.object({
  userId: z.string().min(1, '请输入用户ID'),
  password: z.string().min(1, '请输入密码'),
  remember: z.boolean().optional()
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // 构建登录请求数据
      const loginData: LoginRequest = {
        userId: data.userId,
        password: data.password,
        platform: 'SYSTEM'
      };
      
      // 调用登录API
      await login(loginData);
      
      message.success('登录成功！');
      
      // 跳转到首页
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(error?.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="tech-grid"></div>
        <div className="floating-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <div className="logo-inner"></div>
            </div>
            <h1 className="logo-text">管理系统</h1>
          </div>
          <p className="login-subtitle">欢迎登录后台管理系统</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <div className="input-wrapper">
              <UserOutlined className="input-icon" />
              <input
                {...register('userId')}
                type="text"
                placeholder="请输入用户ID"
                className={`form-input ${errors.userId ? 'error' : ''}`}
                autoComplete="username"
              />
            </div>
            {errors.userId && (
              <span className="error-message">{errors.userId.message}</span>
            )}
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <LockOutlined className="input-icon" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                className={`form-input ${errors.password ? 'error' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                {...register('remember')}
                type="checkbox"
                className="checkbox"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">记住我</span>
            </label>
            <a href="#" className="forgot-password">忘记密码？</a>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              '登录'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="copyright">© 2024 管理系统. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
