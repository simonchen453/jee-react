import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useUserStore';
import './Login.css';

const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(6, '密码至少6位'),
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
      username: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('登录数据:', data);
      
      // 模拟用户数据
      const userData = {
        id: 1,
        name: data.username,
        email: `${data.username}@example.com`,
        avatar: '',
        role: 'admin',
        status: 'active' as const
      };
      
      // 设置登录状态
      login(userData);
      
      // 跳转到首页
      navigate('/', { replace: true });
    } catch (error) {
      console.error('登录失败:', error);
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
                {...register('username')}
                type="text"
                placeholder="请输入用户名"
                className={`form-input ${errors.username ? 'error' : ''}`}
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <span className="error-message">{errors.username.message}</span>
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
