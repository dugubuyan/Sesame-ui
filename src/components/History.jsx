import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchPendingTransactions, clearAuthToken } from '../api/data';

const History = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getHistoryData = async () => {
      try {
        const walletAddress = localStorage.getItem('connectedWalletAddress');
        if (!walletAddress) {
          console.log('钱包未连接');
          setData([]);
          clearAuthToken();
          message.error('Wallet not connected');
          return;
        }
        const chainId = localStorage.getItem('chainId');
        setLoading(true);

        const result = await fetchPendingTransactions(walletAddress,chainId, 1);
        setData(result.transactions.map((transaction, index) => ({
          key: String(index + 1),
          ...transaction
        })));
      } catch (error) {
        console.error('获取历史数据失败:', error);
        message.error(error.message || 'no data fetched');
      } finally {
        setLoading(false);
      }
    };

    getHistoryData();
  }, []);

  const expandedRowRender = (record) => {
    console.log("record:",record)
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Base',
        dataIndex: 'base',
        key: 'base',
        render: (value) => `$${value}`,
      },
      {
        title: 'Bonus',
        dataIndex: 'bonus',
        key: 'bonus',
        render: (value) => `$${value}`,
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (value) => `$${value}`,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.transaction_details}
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: 'Payment Time',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (value) => new Date(value).toISOString().split('T')[0],
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      render: (value) => `$${value}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => window.open(`https://sepolia.etherscan.io/tx/${record.commit_hash}`, '_blank')}
          >
            View Transaction
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="history">
      <Card 
        title="Payment History"
        extra={<Button type="primary" onClick={() => navigate('/payroll')}>Back to Payroll</Button>}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{
            pageSize: 10,
          }}
        />
      </Card>
    </div>
  );
};

export default History;