import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Badge, Dropdown, Button, Select, Space, Divider, message } from 'antd';
import { login, clearAuthToken } from './api/data';
import { BellOutlined, LinkOutlined, TransactionOutlined, DashboardOutlined, BankOutlined, SettingOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import sesameLogo from './assets/sesame-logo.svg';
import { BinanceCoin, Ethereum } from '@thirdweb-dev/chain-icons';
import { bsc, sepolia } from 'viem/chains'
import './App.css';
import { useConnectModal,useSwitchActiveWalletChain,useActiveWallet } from "thirdweb/react";
import '@ant-design/v5-patch-for-react-19';
import { ClientProvider, useClient } from './contexts/ClientContext';
import { getWalletBalance } from "thirdweb/wallets";
// 导入组件
import Dashboard from './components/Dashboard';
import Payroll from './components/Payroll';
import Settings from './components/Settings';
import History from './components/History';
import Transactions from './components/Transactions';

const { Header, Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const { connect, isConnecting } = useConnectModal();
  const [selectedChain, setSelectedChain] = useState(11155111);
  const [walletType,setWalletType] = useState('');
  const [walletBalance,setWalletBalance] = useState(0);
  const client = useClient();
  useEffect(() => {
    if (!isConnected) {
      localStorage.removeItem('connectedWalletAddress');
      localStorage.removeItem('chainId');
      clearAuthToken();
    }
  }, [isConnected]);
  async function handleConnect() {
    try {

      const wallet = await connect( { client, size: "wide", welcomeScreen: {
        title: "Connect Wallet",
        subtitle: "Connecting your wallet is like \"logging in\" to Web3. Select your wallet from the options to get started.",
        description: "Custom Description",
      },theme:{
        theme: "dark",
        }
    }); // opens the connect modal
      console.log("connected to", wallet);
      setIsConnected(true);
      const address = wallet.getAccount().address;
      const chain = wallet.getChain()
      console.log("chain:",chain);
      const walletType = wallet.id;
      console.log("walletType:",walletType);
      setWalletType(walletType);
      // const activeWallet = useActiveWallet()
      getWalletBalance({
        address,
        chain,
        client,
      }).then((balance) => {
        console.log("balance:", balance);
        setWalletBalance(Number(balance.displayValue).toFixed(3));
      });
      setSelectedChain(chain.id);
      console.log("setSelectedChain", chain.id);
      console.log("wallet address", address);
      setUserAddress(address);
      // 保存钱包地址和chainId到localStorage
      localStorage.setItem('connectedWalletAddress', address);
      localStorage.setItem('chainId', chain.id);

      // 调用登录接口获取authToken
      await login(address,chain.id);
      console.log('登录后的存储状态:', {
        authToken: localStorage.getItem('authToken'),
        chainId: localStorage.getItem('chainId'),
        walletAddress: localStorage.getItem('connectedWalletAddress')
      });
      // 触发钱包连接事件
      const walletConnectedEvent = new CustomEvent('walletConnected');
      window.dispatchEvent(walletConnectedEvent);
    } catch (error) {
      console.error('连接钱包或登录失败:', error);
      message.error('连接钱包或登录失败');
      setIsConnected(false);
      setUserAddress('');
      localStorage.removeItem('connectedWalletAddress');
      localStorage.removeItem('chainId');
      clearAuthToken();
    }
}
  const handleDisconnect = () => {
    console.log('Disconnecting wallet event triggered');
    setIsConnected(false);
    setUserAddress('');
    // 清除所有相关的localStorage项
    localStorage.removeItem('connectedWalletAddress');
    localStorage.removeItem('chainId');
    clearAuthToken();
    // 触发钱包断开连接事件
    const walletDisconnectedEvent = new CustomEvent('walletDisconnected');
    window.dispatchEvent(walletDisconnectedEvent);
  };
  const handleSwitchWallet = () => {
    handleDisconnect();
    handleConnect();
  };
  const userMenu = {
    items: [
      {
        key: 'wallet',
        label: (
          <div style={{ padding: '16px', minWidth: '240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Wallet</span>
              <span style={{ color: '#1890ff' }}>{walletType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ color: '#666' }}>Balance</span>
              <span style={{ fontWeight: 500 }}>{walletBalance}</span>
            </div>
            <Button type="default" block style={{ marginBottom: '8px', height: '36px'}} onClick={()=>handleSwitchWallet()}>Switch wallet</Button>
            <Button type="default" danger block style={{ height: '36px' }} onClick={handleDisconnect}>Disconnect</Button>
          </div>
        ),
      },
    ],
  };


  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'payroll',
      icon: <BankOutlined />,
      label: <Link to="/payroll">Payroll</Link>,
    },
    {
      key: 'transactions',
      icon: <TransactionOutlined />,
      label: <Link to="/transactions">Transactions</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <div className="logo">
            <img src={sesameLogo} alt="Sesame Pay Logo" />
            <span>Sesame Pay</span>
          </div>
          <div className="header-right">
            <Badge count={0} className="notification-badge">
              <BellOutlined className="header-icon" />
            </Badge>
            <Divider type="vertical" style={{ height: '24px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedChain === 56 ? (
                  <>
                    <BinanceCoin style={{ fontSize: '20px', width: '20px', height: '20px' }} />
                    <span>BNB Chain</span>
                  </>
                ) : selectedChain === 11155111 ? (
                  <>
                    <Ethereum style={{ fontSize: '20px', width: '20px', height: '20px' }} />
                    <span>Sepolia</span>
                  </>
                ) : (
                  <>
                    <LinkOutlined style={{ fontSize: '20px' }} />
                    <span>Choose Chain</span>
                  </>
                )}
              </div>
            </div>
            <Divider type="vertical" style={{ height: '24px' }} />
            {isConnected ? (
              <Dropdown menu={userMenu} placement="bottomRight">
                <Avatar style={{ background: '#1890ff', fontSize: '14px', width: '140px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px', cursor: 'pointer' }}>{`${userAddress.slice(0, 4)}...${userAddress.slice(-4)}`}</Avatar>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                style={{ height: '32px', marginLeft: '8px' }}
                onClick={
                  handleConnect}
              >
                Connect
              </Button>
            )}
          </div>
        </Header>
        <Layout>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <Menu
              theme="dark"
              defaultSelectedKeys={['dashboard']}
              mode="inline"
              items={menuItems}
            />
          </Sider>
          <Content style={{ background: '#f5f5f5' }}>
            <div className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/history" element={<History />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

const AppWithProviders = () => (
  <ClientProvider>
    <App />
  </ClientProvider>
);

export default AppWithProviders;
