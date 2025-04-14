import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Space, message } from 'antd';
import { updateUserInfo, saveSafeAccount, fetchUserInfo } from '../api/data';

const Settings = () => {
  const [form] = Form.useForm();
  const [userName, setUserName] = useState('');
  const [safeAccount, setSafeAccount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSafeAccountEditing, setIsSafeAccountEditing] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const walletAddress = localStorage.getItem('connectedWalletAddress');
        if (!walletAddress) {
          console.log('钱包未连接');
          setUserName('');
          setSafeAccount('');
          return;
        }
        const data = await fetchUserInfo(walletAddress);
        setUserName(data.userName || '');
        setSafeAccount(data.safeAccount || '');
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
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
        throw new Error('钱包未连接');
      }
      await updateUserInfo(walletAddress, { userName: newUserName });
      setUserName(newUserName);
      setIsEditing(false);
      message.success('用户名更新成功');
    } catch (error) {
      console.error('更新用户名失败:', error);
      message.error('更新用户名失败');
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
        throw new Error('钱包未连接');
      }
      await saveSafeAccount(walletAddress, newSafeAccount);
      setSafeAccount(newSafeAccount);
      setIsSafeAccountEditing(false);
      message.success('Safe Account设置成功');
    } catch (error) {
      console.error('设置Safe Account失败:', error);
      message.error('设置Safe Account失败');
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
                <Button type="primary" onClick={handleSave}>保存</Button>
                <Button onClick={handleCancel}>取消</Button>
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
                <Button type="primary" onClick={handleSafeAccountSave}>保存</Button>
                <Button onClick={handleSafeAccountCancel}>取消</Button>
              </Space>
            ) : (
              <Space>
                <span>{safeAccount || '未设置'}</span>
                <Button type="link" onClick={() => setIsSafeAccountEditing(true)}>Edit</Button>
              </Space>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;