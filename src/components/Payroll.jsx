import React, { useState, useEffect } from 'react';
import { Table, Card, Space, Button, Form, Input, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchPayrollData, saveEmployeeData } from '../api/data';

const Payroll = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 添加获取数据的函数
  const getPayrollData = async () => {
    try {
      const walletAddress = localStorage.getItem('connectedWalletAddress');
      if (!walletAddress) {
        console.log('钱包未连接');
        setData([]);
        return;
      }
      const response = await fetchPayrollData(walletAddress);
      setData(response.employees || []);
    } catch (error) {
      console.error('获取工资数据失败:', error);
      message.error('获取工资数据失败');
    }
  };

  // 在组件挂载时获取数据
  useEffect(() => {
    getPayrollData();

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

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
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
          message.error('钱包未连接');
          return;
        }

        // 调用API保存数据
        await saveEmployeeData(walletAddress, updatedEmployee);
        
        // 更新本地状态
        newData.splice(index, 1, updatedEmployee);
        setData(newData);
        setEditingKey('');
        message.success('保存成功');
      }
    } catch (errInfo) {
      console.error('保存失败:', errInfo);
      message.error('保存失败');
    }
  };

  const addNewRow = () => {
    const newKey = String(data.length + 1);
    const newRow = {
      key: newKey,
      name: '',
      address: '',
      baseSalary: 0,
      bonus: 0,
      total: 0,
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
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Bonus',
      dataIndex: 'bonus',
      key: 'bonus',
      editable: true,
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      editable: false,
      render: (value) => `$${value.toLocaleString()}`,
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
              title="确定要删除这条记录吗？"
              onConfirm={() => handleDelete(record.key)}
              okText="确定"
              cancelText="取消"
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

  const handlePay = () => {
    // TODO: Implement payment logic
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