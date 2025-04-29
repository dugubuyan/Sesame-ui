import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Space, message, List } from 'antd';
import { updateUserInfo, saveSafeAccount, fetchUserInfo } from '../api/data';
import { getSafeSigners } from '../api/trans.js';

const Settings = () => {
  const [form] = Form.useForm();
  const [userName, setUserName] = useState('');
  const [safeAccount, setSafeAccount] = useState('');
  const [role, setRole] = useState(''); // 新增role状态
  const [isEditing, setIsEditing] = useState(false);
  const [isSafeAccountEditing, setIsSafeAccountEditing] = useState(false);
  const [safeInfo, setSafeInfo] = useState(null);

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
        console.log("fetchUserInfo data:",data)
        setUserName(data.userName || '');
        setSafeAccount(data.safeAccount || '');
        setRole(data.role || ''); // 设置role

        // 如果有Safe Account，获取Safe详情
        if (data.safeAccount) {
          const chainId = localStorage.getItem('chainId');
          try {
            const safe = await getSafeSigners(chainId, data.safeAccount);
            setSafeInfo(safe);
          } catch (error) {
            console.error('Failed to get Safe Account details:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        message.error(error.message||'Failed to fetch user info');
      }
    };
    
    getUserInfo();

    // 监听钱包连接和断开连接事件
    const handleWalletConnected = () => {
      console.log('Wallet connected');
      getUserInfo();
    };
    const handleWalletDisconnected = () => {
      console.log('Wallet disconnected');
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
      const chainId = localStorage.getItem('chainId');
      let signers = [];
      try {
        const safe = await getSafeSigners(chainId, newSafeAccount)
        signers = safe.owners;
        setSafeInfo(safe);
        console.log("safe:",safe)
      } catch (error) {
        console.error('Failed to get Safe Account:', error);
        message.error('Safe Account may not exist ,Please check the Safe Account and try again');
        return;
      }

      await saveSafeAccount(walletAddress, newSafeAccount,chainId,signers);
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
      
      {/* {safeAccount && safeInfo && (
        <Card title="Safe Account Details" style={{ marginTop: '20px' }}>
          <List>
            <List.Item>
              <span style={{ fontWeight: 'bold' }}>Threshold:</span> {safeInfo.threshold}
            </List.Item>
            <List.Item>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Signers:</div>
                <List
                  dataSource={safeInfo.owners}
                  renderItem={(signer) => (
                    <List.Item>{signer}</List.Item>
                  )}
                />
              </div>
            </List.Item>
          </List>
        </Card>
      )} */}
      
    </div>
  );
};

export default Settings;