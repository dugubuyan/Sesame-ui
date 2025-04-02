import { useState } from 'react';
import { Layout, Menu, Avatar, Badge, Dropdown, Button, Select, Space, Divider } from 'antd';
import { BellOutlined, LinkOutlined, UserOutlined, DashboardOutlined, PayCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import sesameLogo from './assets/sesame-logo.svg';
import { BinanceCoin, Ethereum } from '@thirdweb-dev/chain-icons';
import './App.css';
import { createThirdwebClient } from "thirdweb";
import { useConnectModal } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "fa21b2ba088ed4d4d7c11fb43a8cd60d",
});

// 导入组件
import Dashboard from './components/Dashboard';
import Payroll from './components/Payroll';
import Settings from './components/Settings';
import History from './components/History';

const { Header, Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [userAddress, setUserAddress] = useState('0x9145...Bbf5');
  const { connect, isConnecting } = useConnectModal();
  const [selectedChain, setSelectedChain] = useState('');

  async function handleConnect() {
    const wallet = await connect( { client,size: "wide",welcomeScreen: {
      title: "Connect Wallet",
      subtitle: "Connecting your wallet is like “logging in” to Web3. Select your wallet from the options to get started.",
      description: "Custom Description",
    },theme:{
      theme: "dark",
      }
  }); // opens the connect modal
    console.log("connected to", wallet);
    setIsConnected(true);
    console.log("wallet address", wallet.getAccount());
    setUserAddress(wallet.getAccount().address);
  }
  const userMenu = {
    items: [
      {
        key: 'wallet',
        label: (
          <div style={{ padding: '16px', minWidth: '240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Wallet</span>
              <span style={{ color: '#1890ff' }}>MetaMask</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ color: '#666' }}>Balance</span>
              <span style={{ fontWeight: 500 }}>0.55 ETH</span>
            </div>
            <Button type="default" block style={{ marginBottom: '8px', height: '36px' }}>Switch wallet</Button>
            <Button type="default" danger block style={{ height: '36px' }} onClick={() => {
              setIsConnected(false);
              setUserAddress('');
            }}>Disconnect</Button>
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
      icon: <PayCircleOutlined />,
      label: <Link to="/payroll">Payroll</Link>,
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
            <Badge count={5} className="notification-badge">
              <BellOutlined className="header-icon" />
            </Badge>
            <Divider type="vertical" style={{ height: '24px' }} />
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'bnb',
                    label: (
                      <div style={{ minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}>
                          <BinanceCoin width={20} height={20} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>BNB Chain</span>
                            <span style={{ color: '#666', fontSize: '12px', lineHeight: '16px' }}>$0</span>
                          </div>
                        </div>
                      </div>
                    ),
                    onClick: () => setSelectedChain('bnb')
                  },
                  {
                    type: 'divider',
                    label: 'TESTNETS',
                    style: { margin: '4px 0', backgroundColor: '#f0f0f0', color: '#7cb305', fontSize: '12px', fontWeight: 500 }
                  },
                  {
                    key: 'sepolia',
                    label: (
                      <div style={{ minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}>
                          <Ethereum width={20} height={20} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}>Sepolia</span>
                            <span style={{ color: '#666', fontSize: '12px', lineHeight: '16px' }}>$0</span>
                          </div>
                        </div>
                      </div>
                    ),
                    onClick: () => setSelectedChain('sepolia')
                  }
                ]
              }}
              placement="bottomRight"
            >
              <Button 
                type="text" 
                icon={
                  selectedChain === 'bnb' ? 
                  <BinanceCoin style={{ fontSize: '20px', width: '20px', height: '20px' }} /> : 
                  selectedChain === 'sepolia' ? 
                  <Ethereum style={{ fontSize: '20px', width: '20px', height: '20px' }} /> : 
                  <LinkOutlined style={{ fontSize: '20px' }} />
                } 
              >
                {selectedChain === 'bnb' ? 'BNB Chain' : 
                 selectedChain === 'sepolia' ? 'Sepolia' : 
                 'Choose Chain'}
              </Button>
            </Dropdown>
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

export default App;
