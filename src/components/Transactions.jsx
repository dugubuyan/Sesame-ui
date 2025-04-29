import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Modal, Button } from 'antd';
import { fetchPendingTransactions, updatePendingTransaction } from '../api/data.js';
import { getPendingTransactions,commitTrans,getBalance } from '../api/trans.js'

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
    const chainId = localStorage.getItem('chainId');
    if (!walletAddress || !chainId) {
      console.log('Wallet not connected or chainId not found');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchPendingTransactions(walletAddress,chainId,0);
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
  const checkPayCondition = async (record) => {
    const walletAddress = localStorage.getItem('connectedWalletAddress');
    const chainId = localStorage.getItem('chainId');
    if (!walletAddress ||!chainId) {
        message.error('Wallet not connected or chainId not found');
        console.log('Wallet not connected or chainId not found');
        return false;
    }
    const balance = await getBalance(chainId, walletAddress );
    console.log("balance:",balance)
    if (balance < record.total) {
        return false;
    }
    return true;
  }
  const handleCommit = async (record) => {
    console.log("record:",record)
    const walletAddress = localStorage.getItem('connectedWalletAddress');
    const chainId = localStorage.getItem('chainId');
    if (!walletAddress || !chainId) {
        message.error('Wallet not connected or chainId not found');
        console.log('Wallet not connected or chainId not found');
        return;
    }
    if(record.propose_address === walletAddress){
        message.error('You don\'t need to commit your own transaction');
        return;
    }
    const ok = await checkPayCondition(record);
    if(!ok){
        message.error('Not enough balance to pay for this transaction');
        return;
    }
    const hide = message.loading('Processing transaction...', 0);
    try {
        const trans = await getPendingTransactions(chainId, record.safe_account)
        console.log("pengding transaction:",trans)
        let matchFound = false;
        for (const tran of trans) {
            if (tran.safeTxHash === record.transaction_hash) {
                matchFound = true;
                const commitHash = await commitTrans(chainId, tran.safeTxHash, record.safe_account);
                console.log("commit transaction:",commitHash)
                const left = tran.confirmationsRequired - tran.confirmations.length;
                if(left === 1 ){
                    const finished = await updatePendingTransaction(walletAddress, record.transaction_hash, 1,chainId, commitHash);
                    if (finished) {
                        message.success('Transaction committed successfully');
                    } else {
                        message.error('Failed to update transaction status');
                    }
                }else{
                    console.log(`Transaction committed successfully, ${left} confirmations left`);
                    message.success(`Transaction committed successfully, ${left} confirmations left`);
                }
                break;
            }
        }
        if (!matchFound) {
            message.info('No matching transaction found');
            await updatePendingTransaction(walletAddress, record.transaction_hash, 1,chainId, '');
        }
    } catch(error) {
        message.error('Failed to commit transaction:',error);
        console.error(error);
        hide();
    }
    hide();
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
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updated_at) => new Date(updated_at).toLocaleString(),
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
      title: 'Proposer',
      dataIndex: 'propose_address',
      key: 'propose_address',
      ellipsis: true,
      render: (propose_address, record) => record.proposer || propose_address,
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