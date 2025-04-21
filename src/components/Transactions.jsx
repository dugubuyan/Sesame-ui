import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Modal, Button } from 'antd';
import { fetchPendingTransactions, updatePendingTransaction } from '../api/data';

const Transactions = ({ walletAddress, safeAccount }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const loadTransactions = async () => {
    if (!walletAddress || !safeAccount) return;
    setLoading(true);
    try {
      const data = await fetchPendingTransactions(walletAddress, safeAccount);
      setTransactions(data.transactions || []);
    } catch (error) {
      message.error('Failed to load pending transactions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [walletAddress, safeAccount]);

  const getStatusTag = (status) => {
    const statusMap = {
      0: { color: 'gold', text: 'Pending' },
      1: { color: 'green', text: 'Completed' },
      2: { color: 'red', text: 'Failed' }
    };
    const { color, text } = statusMap[status] || { color: 'default', text: 'Unknown' };
    return <Tag color={color}>{text}</Tag>;
  };

  const handleCommit = async (record) => {
    // TODO: Implement commit function
  };

  const showTransactionDetails = (record) => {
    setSelectedTransaction(record);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Propose Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => new Date(created_at).toLocaleString(),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `${total}`,
    },
    {
      title: 'Propose Address',
      dataIndex: 'propose_address',
      key: 'propose_address',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleCommit(record)}>Commit</Button>
          <Button onClick={() => showTransactionDetails(record)}>View</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>Pending Transactions</h2>
      <Table
        loading={loading}
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Transaction Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedTransaction && (
          <pre style={{ margin: 0, maxHeight: '400px', overflow: 'auto' }}>
            {JSON.stringify(selectedTransaction.transactionDetails, null, 2)}
          </pre>
        )}
      </Modal>
    </div>
  );
};

export default Transactions;