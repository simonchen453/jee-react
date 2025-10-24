import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Tree,
  Button,
  Space,
  message,
  Card
} from 'antd';
import { createRoleApi, updateRoleApi, getRoleMenuTreeApi } from '../../api/role';
import type { RoleEntity, MenuTreeNode } from '../../types';
import { RoleStatus, SystemConfig } from '../../types';

interface RoleFormProps {
  role?: RoleEntity | null;
  menuOptions: MenuTreeNode[];
  onSuccess: () => void;
  onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, menuOptions, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<string[]>([]);

  // 表单验证规则
  const rules = {
    name: [
      { required: true, message: '角色编号不能为空' }
    ],
    display: [
      { required: true, message: '角色显示名称不能为空' }
    ],
    status: [
      { required: true, message: '请选择状态' }
    ],
    system: [
      { required: true, message: '请选择系统配置' }
    ]
  };

  // 初始化表单数据
  useEffect(() => {
    if (role) {
      form.setFieldsValue({
        name: role.name,
        display: role.display,
        status: role.status,
        system: role.system
      });
      
      // 如果是编辑模式，获取角色的菜单权限
      if (role.id) {
        fetchRoleMenus(role.name);
      }
    } else {
      // 新增模式，设置默认值
      form.setFieldsValue({
        status: RoleStatus.ACTIVE,
        system: SystemConfig.NO
      });
    }
  }, [role, form]);

  // 获取角色的菜单权限
  const fetchRoleMenus = async (roleName: string) => {
    try {
      const response = await getRoleMenuTreeApi(roleName);
      setCheckedKeys(response.data.checkedKeys || []);
      setHalfCheckedKeys([]);
    } catch (error) {
      console.error('获取角色菜单权限失败:', error);
      message.error('获取角色菜单权限失败');
    }
  };

  // 菜单选择变化类型定义
  interface MenuCheckInfo {
    checked?: string[];
    halfChecked?: string[];
  }

  // 处理菜单选择变化
  const handleMenuCheck = (checked: string[] | MenuCheckInfo) => {
    if (Array.isArray(checked)) {
      setCheckedKeys(checked);
    } else {
      setCheckedKeys(checked.checked || []);
      setHalfCheckedKeys(checked.halfChecked || []);
    }
  };

  // 获取所有选中的菜单节点（包括半选中的）
  const getAllCheckedKeys = () => {
    return [...checkedKeys, ...halfCheckedKeys];
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData: RoleEntity = {
        id: role?.id || '',
        code: values.name || '',
        ...values,
        menuNames: getAllCheckedKeys()
      };

      if (role?.id) {
        // 编辑模式
        await updateRoleApi({ ...formData, id: role.id });
        message.success('角色更新成功');
      } else {
        // 新增模式
        await createRoleApi(formData);
        message.success('角色创建成功');
      }

      onSuccess();
    } catch (error) {
      console.error('提交失败:', error);
      message.error(role?.id ? '角色更新失败' : '角色创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <Form
          form={form}
          layout="vertical"
        >
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            label="编号"
            name="name"
            rules={rules.name}
          >
            <Input placeholder="请输入角色编号" />
          </Form.Item>

          <Form.Item
            label="显示名称"
            name="display"
            rules={rules.display}
          >
            <Input placeholder="请输入角色显示名称" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={rules.status}
          >
            <Radio.Group>
              <Radio value={RoleStatus.ACTIVE}>正常</Radio>
              <Radio value={RoleStatus.INACTIVE}>停用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="系统配置"
            name="system"
            rules={rules.system}
          >
            <Radio.Group>
              <Radio value={SystemConfig.YES}>是</Radio>
              <Radio value={SystemConfig.NO}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Card>

        <Card size="small" title="菜单权限" style={{ marginBottom: 16 }}>
          <div style={{ 
            maxHeight: '300px', 
            overflow: 'auto', 
            border: '1px solid #f0f0f0', 
            borderRadius: '6px', 
            padding: '12px',
            background: '#fafafa'
          }}>
            <Tree
              checkable
              checkedKeys={checkedKeys}
              onCheck={handleMenuCheck}
              treeData={menuOptions.map(item => ({
                key: item.id,
                title: item.label,
                children: item.children?.map(child => ({
                  key: child.id,
                  title: child.label
                }))
              }))}
              checkStrictly={false}
            />
          </div>
        </Card>
      </Form>

      <div style={{ textAlign: 'right', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
        <Space>
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            {role?.id ? '更新' : '创建'}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default RoleForm;
