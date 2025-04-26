import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Space, message } from 'antd';
import { updateUserInfo, saveSafeAccount, fetchUserInfo } from '../api/data';

const Settings = () => {
  const [form] = Form.useForm();
  const [userName, setUserName] = useState('');
  const [safeAccount, setSafeAccount] = useState('');
  const [role, setRole] = useState(''); // 新增role状态
  const [isEditing, setIsEditing] = useState(false);
  const [isSafeAccountEditing, setIsSafeAccountEditing] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const walletAddress = localStorage.getItem('connectedWalletAddress');
        if (!walletAddress) {
          console.log('Wallet not connected');
          setUserName('');
          setSafeAccount('');
          setRole(''); // 重置role
          return;
        }
        const data = await fetchUserInfo(walletAddress);
        setUserName(data.userName || '');
        setSafeAccount(data.safeAccount || '');
        setRole(data.role || ''); // 设置role
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        message.error(error.message||'Failed to fetch user info');
      }
    };
    
    getUserInfo();

    // 监听钱包连接和断开连接事件
    const handleWalletConnected = () => {
      getUserInfo();
    };
    const handleWalletDisconnected = () => {
      setUserName('');
      setSafeAccount('');
    };
    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);

    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, []);

  const handleSave = async () => {
    try {
      const newUserName = form.getFieldValue('userName');
      const walletAddress = localStorage.getItem('connectedWalletAddress');
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }
      await updateUserInfo(walletAddress, { userName: newUserName });
      setUserName(newUserName);
      setIsEditing(false);
      message.success('Username updated successfully');
    } catch (error) {
      console.error('Failed to update username:', error);
      message.error(error.message || 'Failed to update username');
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({ userName });
    setIsEditing(false);
  };

  const handleSafeAccountSave = async () => {
    try {
      const newSafeAccount = form.getFieldValue('safeAccount');
      const walletAddress = localStorage.getItem('connectedWalletAddress');
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }
      await saveSafeAccount(walletAddress, newSafeAccount);
      setSafeAccount(newSafeAccount);
      setIsSafeAccountEditing(false);
      message.success('Safe Account set successfully');
    } catch (error) {
      console.error('Failed to set Safe Account:', error);
      message.error('Failed to set Safe Account');
    }
  };

  const handleSafeAccountCancel = () => {
    form.setFieldsValue({ safeAccount });
    setIsSafeAccountEditing(false);
  };

  return (
    <div className="settings">
      <Card title="User Settings">
        <Form
          labelAlign="left"
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{
            userName,
            safeAccount
          }}
        >
          <Form.Item
            label="User Name"
            name="userName"
          >
            {isEditing ? (
              <Space>
                <Input style={{ width: '200px' }} />
                <Button type="primary" onClick={handleSave}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </Space>
            ) : (
              <Space>
                <span>{userName}</span>
                <Button type="link" onClick={() => setIsEditing(true)}>Edit</Button>
              </Space>
            )}
          </Form.Item>
          <Form.Item
            label="Safe Account"
            name="safeAccount"
          >
            {isSafeAccountEditing ? (
              <Space>
                <Input style={{ width: '200px' }} />
                <Button type="primary" onClick={handleSafeAccountSave}>Save</Button>
                <Button onClick={handleSafeAccountCancel}>Cancel</Button>
              </Space>
            ) : (
              <Space>
                <span>{safeAccount || 'Not set'}</span>
                <Button type="link" onClick={() => setIsSafeAccountEditing(true)}>Edit</Button>
              </Space>
            )}
          </Form.Item>
          <Form.Item
            label="Role"
          >
            <span>{role || 'Not set'}</span>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;