import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Modal, Button } from 'antd';
import { fetchPendingTransactions, updatePendingTransaction, savePayrollHistory } from '../api/data.js';
import { getPendingTransactions,commitTrans } from '../api/trans.js'

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState([]);
  // TODO: Implement fetchPendingTransactions and updatePendingTransaction functions from your API file
  // TODO: Implement fetchUserInfo function from your API file
  // TODO: Implement updateUserInfo function from your API file
  const loadTransactions = async () => {
    const walletAddress = localStorage.getItem('connectedWalletAddress');
    if (!walletAddress) {
      console.log('Wallet not connected');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchPendingTransactions(walletAddress);
      console.log("data:",data);
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
  }, []);

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
    console.log("record:",record)
    const walletAddress = localStorage.getItem('connectedWalletAddress');
    if (!walletAddress) {
        message.error('Wallet not connected');
        console.log('Wallet not connected');
        return;
    }
    try {
        const trans = await getPendingTransactions(record.safe_account)
        console.log("pengding transaction:",trans)
        let matchFound = false;
        for (const tran of trans) {
            if (tran.safeTxHash === record.transaction_hash) {
                matchFound = true;
                await commitTrans(tran.safeTxHash, record.safe_account);
                const finished = await updatePendingTransaction(walletAddress, record.id, "completed");
                if (finished) {
                    message.success('Transaction committed successfully');
                } else {
                    message.error('Failed to update transaction status');
                }
                // console.log("process transaction:",trans)
                const left = tran.confirmationsRequired - tran.confirmations.length;
                if(left === 1 ){
                    // 保存交易历史记录
                    try {
                        await savePayrollHistory(walletAddress, {
                            transaction_hash: record.transaction_hash,
                            safeAccount: record.safe_account,
                            transactionDetails: record.transaction_details,
                            propose_address: record.propose_address,
                            payment_time: record.created_at
                        });
                    } catch (historyError) {
                        console.error('Failed to save transaction history:', historyError);
                        message.error('Failed to save transaction history');
                    }
                }else{
                    console.log(`Transaction committed successfully, ${left} confirmations left`);
                    message.success(`Transaction committed successfully, ${left} confirmations left`);
                }
                break;
            }
        }
        if (!matchFound) {
            message.error('No matching transaction found');
            await updatePendingTransaction(walletAddress, record.id, "failed");
        }
    } catch(error) {
        message.error('Failed to commit transaction:',error);
        console.error(error);
    }
    loadTransactions();
    setModalVisible(false);
  };

  const showTransactionDetails = (record) => {
    console.log("record:",record)
    setSelectedTransaction(record);
    console.log("details:",record.transaction_details)
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
      title: 'Transaction Hash',
      dataIndex: 'transaction_hash',
      key: 'transaction_hash',
      ellipsis: true,
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
        <Button onClick={() => showTransactionDetails(record)}>View</Button>
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
        footer={
          <Button type="primary" onClick={() => handleCommit(selectedTransaction)}>
            Commit
          </Button>
        }
      >
        {selectedTransaction && (
          <Table
            dataSource={selectedTransaction.transaction_details}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Base',
                dataIndex: 'base',
                key: 'base',
              },
              {
                title: 'Bonus',
                dataIndex: 'bonus',
                key: 'bonus',
              },
              {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
              },
            ]}
            pagination={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default Transactions;