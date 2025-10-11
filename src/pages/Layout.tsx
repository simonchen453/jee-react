import { Layout as AntLayout, Menu, theme, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined, DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type {MenuItem} from '../types/index';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const location = useLocation();

    const menuItems: MenuItem[] = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: '仪表盘',
            path: '/',
        },
        {
            key: '/users',
            icon: <UserOutlined />,
            label: '用户管理',
            path: '/users',
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人资料',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '设置',
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
        },
    ];

    const handleUserMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'logout':
                localStorage.removeItem('token');
                navigate('/login');
                break;
            default:
                console.log('点击了:', key);
        }
    };

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider 
                collapsible 
                collapsed={collapsed} 
                onCollapse={(value) => setCollapsed(value)}
                trigger={null}
                breakpoint="lg"
                collapsedWidth="0"
                width={250}
            >
                <div className="logo">
                    {collapsed ? 'JEE' : 'JEE React 管理系统'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems.map(item => ({
                        key: item.key,
                        icon: item.icon,
                        label: <Link to={item.path!}>{item.label}</Link>,
                    }))}
                />
            </Sider>
            <AntLayout>
                <Header style={{ 
                    padding: '0 16px', 
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    
                    <Space>
                        <Dropdown
                            menu={{
                                items: userMenuItems,
                                onClick: handleUserMenuClick,
                            }}
                            placement="bottomRight"
                        >
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} />
                                <Text>管理员</Text>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>
                <Content style={{ 
                    margin: '16px', 
                    padding: '24px', 
                    background: colorBgContainer, 
                    minHeight: 360,
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}>
                    <Outlet />
                </Content>
            </AntLayout>
        </AntLayout>
    );
}

export default MainLayout;