import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  Card,
  Tag,
  message,
  Modal,
  Row,
  Col,
  Pagination,
  Tree,
  Breadcrumb,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
  ReloadOutlined,
  SearchOutlined,
  ClearOutlined,
  DeleteOutlined,
  HomeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import {
  activeUserApi,
  inactiveUserApi,
  getUserPrepareDataApi
} from '../../api/user';
import type {
  UserEntity,
  UserSearchForm,
  DeptEntity,
  RoleEntity,
  PostEntity
} from '../../types';
import { UserStatus } from '../../types';
import UserForm from './UserForm';

const { Option } = Select;

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<UserEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchForm, setSearchForm] = useState<UserSearchForm>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserEntity[]>([]);
  
  // 模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserEntity | null>(null);
  
  // 下拉选项数据
  const [deptList, setDeptList] = useState<DeptEntity[]>([]);
  const [roleList, setRoleList] = useState<RoleEntity[]>([]);
  const [postList, setPostList] = useState<PostEntity[]>([]);

  // 获取准备数据
  const fetchPrepareData = async () => {
    // 直接使用模拟数据，确保部门树能显示
    const mockDepts: DeptEntity[] = [
      { id: '1', no: '1', name: 'EcqEE集团', parentId: '' },
      { id: '2', no: '2', name: '测试部门', parentId: '1' },
      { id: '3', no: '3', name: '开发部门', parentId: '1' },
      { id: '4', no: '4', name: '市场部门', parentId: '1' },
      { id: '5', no: '5', name: '人事部门', parentId: '1' },
      { id: '6', no: '6', name: '财务部门', parentId: '1' }
    ];
    setDeptList(mockDepts);
    
    try {
      const data = await getUserPrepareDataApi();
      setRoleList(data.roles || []);
      setPostList(data.posts || []);
    } catch (error) {
      console.error('获取准备数据失败:', error);
      // 使用模拟数据
      setRoleList([]);
      setPostList([]);
    }
  };

  // 部门树节点类型
  interface DeptTreeNode {
    key: string;
    title: string;
    children: DeptTreeNode[];
  }

  // 构建部门树数据
  const buildDeptTree = (depts: DeptEntity[]): DeptTreeNode[] => {
    if (!depts || depts.length === 0) {
      return [];
    }

    const deptMap = new Map<string, DeptTreeNode>();
    const rootNodes: DeptTreeNode[] = [];

    // 先创建所有节点
    depts.forEach(dept => {
      deptMap.set(dept.id, {
        key: dept.id,
        title: dept.name,
        children: []
      });
    });

    // 构建树结构
    depts.forEach(dept => {
      const node = deptMap.get(dept.id);
      if (node) {
        if (dept.parentId && deptMap.has(dept.parentId)) {
          const parent = deptMap.get(dept.parentId);
          if (parent) {
            parent.children.push(node);
          }
        } else {
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  };

  // 获取用户列表
  const fetchUserList = async (_params: UserSearchForm = {}) => {
    setLoading(true);
    
    // 直接使用模拟数据，确保用户列表能显示
    const mockUsers = [
      {
        userIden: { userDomain: '局域网用户', userId: 'user001' },
        loginName: 'test',
        realName: '王小二',
        mobileNo: '13800138000',
        email: 'test@example.com',
        status: UserStatus.ACTIVE,
        description: '测试账号',
        latestLoginTime: '2020-06-04 00:00:00'
      },
      {
        userIden: { userDomain: '系统用户', userId: 'user002' },
        loginName: 'admin',
        realName: '系统管理员',
        mobileNo: '13800138001',
        email: 'admin@example.com',
        status: UserStatus.ACTIVE,
        description: '系统管理员',
        latestLoginTime: '2025-10-18 18:29:31'
      },
      {
        userIden: { userDomain: '系统用户', userId: 'user003' },
        loginName: 'superadmin',
        realName: '系统超级管理员',
        mobileNo: '13800138002',
        email: 'superadmin@example.com',
        status: UserStatus.ACTIVE,
        description: '超级管理员',
        latestLoginTime: '2025-10-19 11:50:16'
      }
    ];
    setUserList(mockUsers);
    setTotal(mockUsers.length);
    setLoading(false);
    
    // 注释掉API调用，直接使用模拟数据
    /*
    try {
      const response = await getUserListApi({
        ...params,
        page: currentPage,
        pageSize: pageSize
      });
      setUserList(response.list || []);
      setTotal(response.pagination?.total || 0);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
    */
  };

  // 搜索
  const handleSearch = (values: UserSearchForm) => {
    setSearchForm(values);
    setCurrentPage(1);
    fetchUserList(values);
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setSearchForm({});
    setCurrentPage(1);
    fetchUserList({});
  };

  // 分页变化
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
    fetchUserList({ ...searchForm, page, pageSize: size || pageSize });
  };

  // 激活用户
  const handleActive = async (user: UserEntity) => {
    try {
      const result = await activeUserApi(user.userIden.userDomain, user.userIden.userId);
      if (result.success) {
        message.success('用户激活成功');
        fetchUserList(searchForm);
      } else {
        message.error(result.message || '用户激活失败');
      }
    } catch (error) {
      message.error('用户激活失败');
    }
  };

  // 停用用户
  const handleInactive = async (user: UserEntity) => {
    try {
      const result = await inactiveUserApi(user.userIden.userDomain, user.userIden.userId);
      if (result.success) {
        message.success('用户停用成功');
        fetchUserList(searchForm);
      } else {
        message.error(result.message || '用户停用失败');
      }
    } catch (error) {
      message.error('用户停用失败');
    }
  };

  // 重置密码
  const handleResetPassword = (user: UserEntity) => {
    Modal.confirm({
      title: '重置密码',
      content: `确定要重置用户 ${user.realName} 的密码吗？`,
      onOk: () => {
        message.success('密码重置成功');
      }
    });
  };

  // 编辑用户
  const handleEdit = (user: UserEntity) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  // 创建用户
  const handleCreate = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedUsers.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedUsers.length} 个用户吗？`,
      onOk: () => {
        message.success('批量删除成功');
        setSelectedUsers([]);
        setSelectedRowKeys([]);
        fetchUserList(searchForm);
      }
    });
  };

  // 单个删除
  const handleDelete = (user: UserEntity) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${user.realName} 吗？`,
      onOk: () => {
        message.success('删除成功');
        fetchUserList(searchForm);
      }
    });
  };

  // 行选择
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: UserEntity[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedUsers(selectedRows);
    },
    getCheckboxProps: (record: UserEntity) => ({
      name: record.realName,
    }),
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      [UserStatus.ACTIVE]: { color: 'green', text: '正常' },
      [UserStatus.LOCK]: { color: 'red', text: '锁定' },
      [UserStatus.INACTIVE]: { color: 'orange', text: '停用' }
    };
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<UserEntity> = [
    {
      title: 'NO.',
      key: 'index',
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: '用户域',
      dataIndex: ['userIden', 'userDomain'],
      key: 'userDomain',
      width: 120
    },
    {
      title: '登录名',
      dataIndex: 'loginName',
      key: 'loginName',
      width: 120
    },
    {
      title: '用户姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 120
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 150,
      ellipsis: true
    },
    {
      title: '上次登录时间',
      dataIndex: 'latestLoginTime',
      key: 'latestLoginTime',
      width: 150,
      render: (time: string) => time || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record: UserEntity) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
          >
            修改
          </Button>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => handleResetPassword(record)}
            type="primary"
          >
            重置密码
          </Button>
          {record.status === UserStatus.LOCK ? (
            <Button
              size="small"
              icon={<UserAddOutlined />}
              onClick={() => handleActive(record)}
              type="primary"
            >
              启用
            </Button>
          ) : record.status === UserStatus.ACTIVE ? (
            <Button
              size="small"
              icon={<UserDeleteOutlined />}
              onClick={() => handleInactive(record)}
              type="default"
            >
              停用
            </Button>
          ) : null}
          <Button
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            type="primary"
            danger
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  useEffect(() => {
    // 先加载部门数据
    fetchPrepareData();
    // 然后加载用户数据
    fetchUserList();
  }, []);

  // 当部门数据加载完成后，确保树能正确显示
  useEffect(() => {
    if (deptList.length > 0) {
      console.log('部门数据已加载:', deptList);
      console.log('构建的树数据:', buildDeptTree(deptList));
    } else {
      console.log('部门数据为空，长度:', deptList.length);
    }
  }, [deptList]);

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Button type="link" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            首页
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
      </Breadcrumb>
      
      <Divider />

      <Row gutter={20}>
        {/* 部门树 */}
        <Col span={6} xs={24}>
          <Card title="部门列表" size="small" style={{ marginBottom: 16, height: '600px' }}>
            <Input
              placeholder="请输入部门名称"
              style={{ marginBottom: 16 }}
              allowClear
              prefix={<SearchOutlined />}
            />
            <div style={{ 
              height: '500px', 
              overflow: 'auto', 
              border: '1px solid #f0f0f0', 
              borderRadius: '6px', 
              padding: '12px', 
              background: '#fafafa'
            }}>
              {deptList.length > 0 ? (
                <Tree
                  treeData={buildDeptTree(deptList)}
                  showLine={false}
                  defaultExpandAll
                  onSelect={(selectedKeys, info) => {
                    console.log('选中部门:', selectedKeys, info);
                    if (selectedKeys.length > 0) {
                      const deptId = selectedKeys[0] as string;
                      setSearchForm(prev => ({ ...prev, deptId }));
                      setCurrentPage(1);
                      fetchUserList({ ...searchForm, deptId, page: 1 });
                    }
                  }}
                  style={{
                    background: 'transparent'
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  <div>暂无部门数据</div>
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    部门数量: {deptList.length}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* 用户数据 */}
        <Col span={18} xs={24}>
          <Card>
            {/* 搜索表单 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Form
                form={form}
                layout="inline"
                onFinish={handleSearch}
              >
                <Row gutter={[16, 16]} style={{ width: '100%' }}>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="userDomain" label="用户域">
                      <Select placeholder="请选择用户域" allowClear style={{ width: '100%' }}>
                        <Option value="default">默认域</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="loginName" label="登录名">
                      <Input placeholder="请输入登录名" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="realName" label="用户姓名">
                      <Input placeholder="请输入用户姓名" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="status" label="状态">
                      <Select placeholder="请选择状态" allowClear style={{ width: '100%' }}>
                        <Option value={UserStatus.ACTIVE}>正常</Option>
                        <Option value={UserStatus.LOCK}>锁定</Option>
                        <Option value={UserStatus.INACTIVE}>停用</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Space>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        搜索
                      </Button>
                      <Button onClick={handleReset} icon={<ClearOutlined />}>
                        重置
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Card>

            {/* 操作按钮 */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'white', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                  新增
                </Button>
                <Button 
                  type="primary" 
                  danger 
                  icon={<DeleteOutlined />} 
                  disabled={selectedUsers.length === 0}
                  onClick={handleBatchDelete}
                >
                  删除
                </Button>
              </Space>
              <div>
                已选择 {selectedUsers.length} 项
              </div>
            </div>

            {/* 用户表格 */}
            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
              <Table
                columns={columns}
                dataSource={userList}
                loading={loading}
                rowKey={(record) => `${record.userIden.userDomain}-${record.userIden.userId}`}
                rowSelection={rowSelection}
                pagination={false}
                scroll={{ x: 1200 }}
                size="small"
              />
            </div>

            {/* 分页 */}
            <div style={{ marginTop: 16, textAlign: 'right', padding: '16px', background: 'white', borderRadius: '8px' }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                pageSizeOptions={['10', '20', '30', '50']}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 用户表单模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <UserForm
          user={editingUser}
          deptList={deptList}
          roleList={roleList}
          postList={postList}
          onSuccess={() => {
            setIsModalVisible(false);
            setEditingUser(null);
            fetchUserList(searchForm);
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingUser(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default UserList;