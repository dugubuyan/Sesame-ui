import React, { useState, useEffect } from 'react';
import { Table, Card, Space, Button, Form, Input, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchPayrollData, saveEmployeeData, deleteEmployeeData, clearAuthToken, fetchUserInfo, savePendingTransaction } from '../api/data';
import {makeTrans} from '../api/trans.js';
import { ethers } from 'ethers';
const Payroll = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [safeAccount, setSafeAccount] = useState('');

  // 添加获取数据的函数
  const getPayrollData = async () => {
    try {
      const walletAddress = localStorage.getItem('connectedWalletAddress');
      if (!walletAddress) {
        console.log('钱包未连接');
        setData([]);
        // 清除认证信息
        clearAuthToken();
        return;
      }
      const response = await fetchPayrollData(walletAddress);
      const employeesWithKeys = (response.employees || []).map(employee => ({
        ...employee,
        key: employee.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      setData(employeesWithKeys);
    } catch (error) {
      console.error('Failed to fetch payroll data:', error);
      message.error('Failed to fetch payroll data');
    }
  };

  // 在组件挂载时获取数据
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const walletAddress = localStorage.getItem('connectedWalletAddress');
        if (!walletAddress) {
          console.log('钱包未连接');
          setSafeAccount('');
          return;
        }
        const data = await fetchUserInfo(walletAddress);
        setSafeAccount(data.safeAccount || '');
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
      }
    };

    getPayrollData();
    getUserInfo();

    // 监听钱包连接和断开连接事件
    const handleWalletConnected = () => {
      getPayrollData();
    };
    const handleWalletDisconnected = () => {
      setData([]);
    };
    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);

    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, []);

  const [data, setData] = useState([]);

  const [editingKey, setEditingKey] = useState('');

  const handleDelete = async (key) => {
    try {
      const walletAddress = localStorage.getItem('connectedWalletAddress');
      if (!walletAddress) {
        message.error('Wallet not connected');
        return;
      }
      
      const employee = data.find(item => item.key === key);
      if (!employee || !employee.id) {
        message.error('Invalid employee record');
        return;
      }

      await deleteEmployeeData(walletAddress, employee.id);
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
      message.success('Deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      message.error('Delete failed');
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedEmployee = {
          ...item,
          ...row,
          total: Number(row.baseSalary) + Number(row.bonus),
        };
        
        // 获取钱包地址
        const walletAddress = localStorage.getItem('connectedWalletAddress');
        if (!walletAddress) {
          message.error('Wallet not connected');
          return;
        }

        // 调用API保存数据
        const response = await saveEmployeeData(walletAddress, updatedEmployee);
        
        // 获取保存后的数据（包含新的id）
        const savedEmployee = {
          ...updatedEmployee,
          id: response.id || item.id, // 使用返回的id或保持原有id
          key: response.id || item.id || item.key // 优先使用id作为key
        };
        
        // 更新本地状态
        newData.splice(index, 1, savedEmployee);
        setData(newData);
        setEditingKey('');
        message.success('Saved successfully');
      }
    } catch (errInfo) {
      console.error('Save failed:', errInfo);
      message.error('Save failed');
    }
  };

  const addNewRow = () => {
    const newRow = {
      key: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      address: '',
      baseSalary: 0,
      bonus: 0,
      total: 0,
      // 新增记录不需要id字段，id将由后端生成
    };
    setData([newRow, ...data]);
    edit(newRow);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      editable: true,
    },
    {
      title: 'Base',
      dataIndex: 'baseSalary',
      key: 'baseSalary',
      editable: true,
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      title: 'Bonus',
      dataIndex: 'bonus',
      key: 'bonus',
      editable: true,
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      editable: false,
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type="link" onClick={() => save(record.key)}>Save</Button>
            <Button type="link" onClick={cancel}>Cancel</Button>
          </Space>
        ) : (
          <Space>
            <Button type="link" disabled={editingKey !== ''} onClick={() => edit(record)}>Edit</Button>
            <Popconfirm
              title="Are you sure you want to delete this record?"
              onConfirm={() => handleDelete(record.key)}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Button type="link" danger disabled={editingKey !== ''}>Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    ...restProps
  }) => {
    let inputNode;
    if (dataIndex === 'address') {
      inputNode = <Input placeholder="Enter ETH wallet address" />;
    } else if (dataIndex === 'baseSalary' || dataIndex === 'bonus') {
      inputNode = <Input type="number" />;
    } else {
      inputNode = <Input />;
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: `Please Input ${title}!` },
              ...(dataIndex === 'address' ? [
                { pattern: /^0x[a-fA-F0-9]{40}$/, message: 'Please enter a valid ETH wallet address!' }
              ] : []),
              ...(dataIndex === 'baseSalary' ? [
                { validator: (_, value) => {
                    if (!value) return Promise.reject('Please enter a value!');
                    const num = Number(value);
                    if (isNaN(num)) return Promise.reject('Please enter a valid number!');
                    if (num < 0) return Promise.reject('Amount must be greater than or equal to 0!');
                    return Promise.resolve();
                  }
                }
              ] : []),
              ...(dataIndex === 'bonus' ? [
                { validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const num = Number(value);
                    if (isNaN(num)) return Promise.reject('Please enter a valid number!');
                    if (num < 0) return Promise.reject('Amount must be greater than or equal to 0!');
                    return Promise.resolve();
                  }
                }
              ] : [])
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'baseSalary' || col.dataIndex === 'bonus' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const components = {
    body: {
      cell: EditableCell
    }
  };

  const handlePay = async () => {
    try {
      const toAddresses = data.map(employee => employee.address);
      const toAmounts = data.map(employee => {
        return ethers.parseUnits(employee.total.toString(), 6)
      });
      console.log(toAddresses, toAmounts);
      await makeTrans(toAddresses, toAmounts, safeAccount);
      
      // 获取当前用户地址
      const walletAddress = localStorage.getItem('connectedWalletAddress');
      if (!walletAddress) {
        throw new Error('钱包未连接');
      }

      // 准备交易详情
      const transactionDetails = data.map(employee => ({
        name: employee.name,
        base: employee.baseSalary,
        bonus: employee.bonus,
        total: employee.total
      }));

      // 计算总金额
      const totalAmount = transactionDetails.reduce((sum, detail) => sum + detail.total, 0);

      // 保存待处理交易
      await savePendingTransaction({
        safe_account: safeAccount,
        address: walletAddress,
        propose_address: walletAddress,
        total: totalAmount,
        transaction_details: transactionDetails,
      });

      message.success('交易已发起并保存');
    } catch (error) {
      console.error('发起交易失败:', error);
      message.error('发起交易失败');
    }
  };

  return (
    <div className="payroll">
      <Card 
        title="Payroll Management"
        extra={
          <Space>
            <Button type="primary" onClick={handlePay}>Pay</Button>
            <Button type="primary" onClick={() => navigate('/history')}>View History</Button>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={addNewRow}>Add New Employee</Button>
        </Space>
        <Form form={form} component={false}>
          <Table
            components={components}
            bordered
            columns={mergedColumns}
            dataSource={data}
            pagination={{
              pageSize: 10,
              onChange: cancel
            }}
            rowClassName="editable-row"
          />
        </Form>
      </Card>
    </div>
  );
};

export default Payroll;