import { useUserStore } from '../../stores/useUserStore';
import { useEffect } from 'react';
import { Button, List, Card, Spin, Alert, Space, Typography } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { User } from '../../types';

const { Title } = Typography;

const mockUsers: User[] = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'user', status: 'active' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user', status: 'inactive' },
];

function UserList() {
    const { users, loading, error, setUsers, setLoading, setError } = useUserStore();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                // 模拟API调用延迟
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUsers(mockUsers);
            } catch (err) {
                setError('加载用户数据失败');
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [setUsers, setLoading, setError]);

    const handleAddUser = () => {
        // 这里可以打开添加用户的模态框
        console.log('添加用户');
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>加载中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="加载失败"
                description={error}
                type="error"
                showIcon
                action={
                    <Button size="small" onClick={() => window.location.reload()}>
                        重试
                    </Button>
                }
            />
        );
    }

    return (
        <div>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={2} style={{ margin: 0 }}>
                        <UserOutlined /> 用户管理
                    </Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
                        添加用户
                    </Button>
                </div>
                
                <List
                    dataSource={users}
                    renderItem={(user) => (
                        <List.Item
                            actions={[
                                <Button type="link" size="small">编辑</Button>,
                                <Button type="link" size="small" danger>删除</Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<UserOutlined style={{ fontSize: 24 }} />}
                                title={
                                    <Space>
                                        {user.name}
                                        <span style={{ 
                                            color: user.status === 'active' ? '#52c41a' : '#ff4d4f',
                                            fontSize: '12px'
                                        }}>
                                            {user.status === 'active' ? '活跃' : '非活跃'}
                                        </span>
                                    </Space>
                                }
                                description={
                                    <Space direction="vertical" size={0}>
                                        <div>{user.email}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            角色: {user.role || 'user'}
                                        </div>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}

export default UserList;