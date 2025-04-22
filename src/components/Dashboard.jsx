import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Divider, Modal, Form, Input, Button, message,Result } from 'antd';
import { ArrowUpOutlined, ExclamationOutlined } from '@ant-design/icons';
import { fetchDashboardData, saveSafeAccount, clearAuthToken } from '../api/data';
import { getPendingTransactions, commitTrans,getBalance, addFunds } from '../api/trans.js';
import { useActiveWallet } from "thirdweb/react";
import { useClient } from '../contexts/ClientContext';

const putSafeAccount = async (safeAddress) => {
  try {
    const walletAddress = localStorage.getItem('connectedWalletAddress');
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }
    await saveSafeAccount(walletAddress, safeAddress);
    return true;
  } catch (error) {
    console.error('Failed to set Safe Account:', error);
    throw error;
  }
};

const Dashboard = () => {
  const [safeAccount, setSafeAccount] = useState('0x0');
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [monthlyPayroll, setMonthlyPayroll] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const [pendingTxModal, setPendingTxModal] = useState(false);
  // const [pendingTxDetails, setPendingTxDetails] = useState(null);
  const [addFundModal, setAddFundModal] = useState(false);
  const [addFundAmount, setAddFundAmount] = useState('');

  const wallet = useActiveWallet();
  const client = useClient();
  const handleSetAccount = async (values) => {
    try {
      setLoading(true);
      await putSafeAccount(values.safeAccount);
      setSafeAccount(values.safeAccount);
      setIsModalOpen(false);
      message.success('Safe Account set successfully');
    } catch (error) {
      message.error(error.message || 'Failed to set Safe Account');
    } finally {
      setLoading(false);
    }
  };

  // const fetchPendingTxDetails = async (safeAccount) => {
  //   try {
  //     const pendingTx = await getPendingTransactions(safeAccount);
  //     if (pendingTx && pendingTx.length > 0) {
  //       const txDetails = pendingTx[0];
  //       setPendingTxDetails({
  //         safeTxHash: txDetails.safeTxHash,
  //         confirmationsRequired: txDetails.confirmationsRequired,
  //         confirmationsCount: txDetails.confirmations.length
  //       });
  //     } else {
  //       setPendingTxDetails(null);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch pending transactions:', error);
  //     message.error('Failed to fetch pending transaction details');
  //     setPendingTxDetails(null);
  //   }
  // };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const walletAddress = localStorage.getItem('connectedWalletAddress');
        if (!walletAddress) {
          console.log('Wallet not connected');
          setTotalEmployees(0);
          setMonthlyPayroll(0);
          setBalance(0);
          clearAuthToken();
          return;
        }
        const data = await fetchDashboardData(walletAddress);
        setTotalEmployees(data.totalEmployees);
        setMonthlyPayroll(data.totalPayroll);
        setSafeAccount(data.safeAccount || '0x0');
        // fetchPendingTxDetails(data.safeAccount);
        const bn = await getBalance(data.safeAccount);
        
        setBalance(bn);
        console.log("balance:", balance)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        message.error('Failed to fetch dashboard data');
      }
    };
    getDashboardData();
    // 监听钱包连接和断开连接事件
    const handleWalletConnected = () => {
      getDashboardData();
    };
    const handleWalletDisconnected = () => {
      setTotalEmployees(0);
      setMonthlyPayroll(0);
      setBalance(0);
    };
    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);

    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, []); // 保持空依赖数组，但通过事件监听器响应钱包连接状态
  
  // const handleCommitClick = async (safeAccount) => {
  //   if (pendingTxDetails) {
  //     setPendingTxModal(true);
  //   } else {
  //     message.info('No pending transactions found');
  //   }
  // };
  
  // const handleConfirmCommit = async (safeAccount) => {
  //   try {
  //     console.log("safeAccount:", safeAccount)
  //     await commitTrans(pendingTxDetails.safeTxHash, safeAccount);
  //     message.success('Transaction committed successfully');
  //     setPendingTxModal(false);
  //   } catch (error) {
  //     console.error('Failed to commit transaction:', error);
  //     message.error('Failed to commit transaction');
  //   }
  // };
  
  const handleAddFund = async () => {
    try {
      console.log("wallet:", wallet)
      if (!wallet) {
        message.error('钱包未连接');
        return;
      }
      await addFunds(client, wallet,safeAccount, addFundAmount);
      message.success('资金添加成功');
      setAddFundModal(false);
      setBalance(addFundAmount);
      setAddFundAmount('');
    } catch (error) {
      message.error('添加资金失败: ' + error.message);
    }
  };

  return (
    <div className="dashboard">
      <h2>Overview</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Employees"
              value={totalEmployees}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Monthly Payroll"
              value={monthlyPayroll}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
        <h2>Safe Account</h2>
        </Col>
        <Col span={18} style={{ display: 'flex', alignItems: 'center' }}>
        {safeAccount === '0x0' ? (
        <>
          <span style={{fontWeight: "bold"}}>You haven't setted a safe acount yet!</span>
          <Button type="link" onClick={() => setIsModalOpen(true)}>Set Account</Button>
          <Modal
            title="Set Safe Account"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleSetAccount}
              layout="vertical"
            >
              <Form.Item
                name="safeAccount"
                label="Safe Account Address"
                rules={[
                  { required: true, message: 'Please enter Safe Account address!' },
                  { pattern: /^0x[a-fA-F0-9]{40}$/, message: 'Please enter a valid wallet address!' }
                ]}
              >
                <Input placeholder="Enter safe wallet address" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Confirm
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : (
        <span style={{fontWeight: "bold"}}>{safeAccount}</span>
      )}
        </Col>
      </Row>
      <Divider />
      <h2>Balance</h2>
      <Row gutter={16}>
        {balance !== 0? (<Col span={6}>
          <Card>
            <Statistic
              value={balance}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#cf1322' }}
            />
            <Button type="link" onClick={() => setAddFundModal(true)}>Add Fund</Button>
          </Card>
        </Col>):<Col span={12}>
          <Card title="Add funds to get started">
          Add funds directly to your bank account and then you can pay.
          <Button type="link" onClick={() => setAddFundModal(true)}>Add Fund</Button>
          </Card>
        </Col>}
      </Row>
      <Divider />
      {/* <Row gutter={16}>
      <Col span={6} style={{ display: 'flex', alignItems: 'center' }}>
        <h2>Pending payments</h2>
        </Col>
        <Col span={18} style={{ display: 'flex', alignItems: 'center' }}>
            {pendingTxDetails && (
              <>
                You have pending payments to commit.<ExclamationOutlined />
                <Button type="link" onClick={() => handleCommitClick(safeAccount)}>commit</Button>
              </>
            )}
        </Col>
      </Row> */}
      {/* <Modal
        title="Pending Transaction Details"
        open={pendingTxModal}
        onCancel={() => setPendingTxModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setPendingTxModal(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={() => handleConfirmCommit(safeAccount)}>Confirm</Button>
        ]}
      >
        {pendingTxDetails && (
          <div>
            <p>Transaction Hash: {pendingTxDetails.safeTxHash}</p>
            <p>Required Confirmations: {pendingTxDetails.confirmationsRequired}</p>
            <p>Current Confirmations: {pendingTxDetails.confirmationsCount}</p>
          </div>
        )}
      </Modal> */}
      <Modal
        title="Add Funds"
        open={addFundModal}
        onCancel={() => setAddFundModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddFundModal(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleAddFund}>Confirm</Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount!' }]}
          >
            <Input
              type="number"
              placeholder="Enter amount"
              value={addFundAmount}
              onChange={(e) => setAddFundAmount(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;