import React, { useState } from 'react';
import { Table, Card, Space, Select, DatePicker, Button, Form, Input, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const Payroll = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: '1',
      name: 'John Doe',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      baseSalary: 120000,
      bonus: 15000,
      total: 135000,
    },
    {
      key: '2',
      name: 'Jane Smith',
      address: '0x97F28b404EEAf6a00660c113FEd550a23054ae46',
      baseSalary: 95000,
      bonus: 12000,
      total: 107000,
    },
  ]);

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
        newData.splice(index, 1, {
          ...item,
          ...row,
          total: Number(row.baseSalary) + Number(row.bonus),
        });
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
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