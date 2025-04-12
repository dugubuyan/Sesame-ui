import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchHistoryData } from '../api/data';

const History = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getHistoryData = async () => {
      try {
        setLoading(true);
        const result = await fetchHistoryData();
        setData(result.transactions.map((transaction, index) => ({
          key: String(index + 1),
          ...transaction
        })));
      } catch (error) {
        console.error('获取历史数据失败:', error);
        message.error('获取历史数据失败');
      } finally {
        setLoading(false);
      }
    };

    getHistoryData();
  }, []);

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (value) => `$${value.toLocaleString()}`,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.employees}
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: 'Payment Time',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => window.open(`https://etherscan.io/tx/${record.transactionHash}`, '_blank')}
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