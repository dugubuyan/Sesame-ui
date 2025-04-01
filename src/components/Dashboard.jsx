import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

// 模拟从后端获取仪表盘数据的函数
const fetchDashboardData = async () => {
  // 这里将来会实现真正的API调用
  // 暂时返回默认值
  return {
    safeAccount: '0x0',
    totalEmployees: 128,
    monthlyPayroll: 256789,
    balance: 100.12
  };
};

const Dashboard = () => {
  // 初始化所有状态
  const [safeAccount, setSafeAccount] = useState('0x0');
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [monthlyPayroll, setMonthlyPayroll] = useState(0);
  const [balance, setBalance] = useState(0);
  
  useEffect(() => {
    // 组件挂载时获取仪表盘数据
    const getDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setSafeAccount(data.safeAccount);
        setTotalEmployees(data.totalEmployees);
        setMonthlyPayroll(data.monthlyPayroll);
        setBalance(data.balance);
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      }
    };
    
    getDashboardData();
  }, []); // 空依赖数组表示只在组件挂载时执行一次
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
          <span style={{fontWeight: "bold"}}>You don't heave a safe acount yet!</span>
          <a href="/settings">Generate Account</a>
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
          </Card>
        </Col>):<Col span={12}>
          <Card title="Add funds to get started">
          Add funds directly to your bank account and then you can pay.
          </Card>
        </Col>}
      </Row>
    </div>
  );
};

export default Dashboard;