import React, { useState } from 'react';
import { Table, Card, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  const [data] = useState([
    {
      key: '1',
      paymentTime: '2023-11-01 14:30:00',
      totalAmount: 242000,
      employees: [
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          total: 135000,
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          total: 107000,
        },
      ],
      transactionHash: '0x1234...5678',
    },
    {
      key: '2',
      paymentTime: '2023-10-01 15:00:00',
      totalAmount: 242000,
      employees: [
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          total: 135000,
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          total: 107000,
        },
      ],
      transactionHash: '0x9876...4321',
    },
  ]);

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