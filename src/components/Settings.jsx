import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Space, Table, Typography, Tooltip, message } from 'antd';
import { EditOutlined, PlusOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Settings = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [safeAccount, setSafeAccount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('Alex');
  const [editingKey, setEditingKey] = useState('');
  const [members, setMembers] = useState([
    {
      key: '1',
      name: 'signer0',
      address: '0x9145CEb6B60b656F28edC11dc26479DEb7e8Bbf5',
    },
    {
      key: '2',
      name: 'signer1',
      address: '0x7eB944E6f1A513c48DB0BBE7687233aED3ff61DD',
    },
  ]);

  const isEditable = (record) => record.key === editingKey;

  const edit = (record) => {
    console.log("record:",record);
    form1.setFieldsValue({ name: record.name, address: record.address });
    setEditingKey(record.key);
  };

  const save = async (key) => {
    try {
      const row = await form1.validateFields();
      const newData = [...members];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setMembers(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleSave = () => {
    const newUserName = form.getFieldValue('userName');
    setUserName(newUserName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.setFieldsValue({ userName });
    setIsEditing(false);
  };

  const handleGenerateAccount = () => {
    // TODO: Implement account generation logic
    console.log('Generating account...');
  };

  const handleAddSigner = () => {
    const newKey = String(members.length + 1);
    const newMember = {
      key: newKey,
      name: `signer${members.length}`,
      address: '',
    };
    form1.setFieldsValue({ name: `signer${members.length}`, address: '' }); 
    setMembers([...members, newMember]);
    setEditingKey(newKey);
  };

  const [requiredConfirmations, setRequiredConfirmations] = useState(2);
  const [isEditingConfirmations, setIsEditingConfirmations] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState('Copy to clipboard');

  const handleConfirmationsChange = (value) => {
    setRequiredConfirmations(value);
    setIsEditingConfirmations(false);
  };

  // 创建一个可编辑单元格组件，用于表格编辑
  const EditableCell = ({ editing, dataIndex, title, record, children, ...restProps }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required: true, message: `Please input ${title}!` }]}
          >
            <Input />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (text, record) => {
        const editable = isEditable(record);
        return !editable ? (
          <Space>
            <Avatar style={{ backgroundColor: '#f56a00' }}>{text[0].toUpperCase()}</Avatar>
            {text}
          </Space>
        ) : (
          text
        );
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      editable: true,
      render: (text, record) => {
        const editable = isEditable(record);
        return !editable ? (
          <Space>
            {text}
            <Tooltip title={copyTooltip} mouseEnterDelay={0.1}>
              <CopyOutlined
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  navigator.clipboard.writeText(text);
                  message.success('Copied!');
                  setCopyTooltip('Copied!');
                  setTimeout(() => setCopyTooltip('Copy to clipboard'), 500);
                }}
              />
            </Tooltip>
          </Space>
        ) : (
          text
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const editable = isEditable(record);
        return editable ? (
          <Space size="middle">
            <Button type="link" onClick={() => save(record.key)}>Save</Button>
            <Button type="link" onClick={cancel}>Cancel</Button>
          </Space>
        ) : (
          <Space size="middle">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => setMembers(members.filter(member => member.key !== record.key))} />
          </Space>
        );
      },
    },
  ];
  
  // 处理可编辑列
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditable(record),
      }),
    };
  });

  return (
    <div className="settings">
      <Card title="User Settings">
        <Form labelAlign="left"
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{
            userName,
            language: 'en',
            timezone: 'UTC+8',
            notifications: true,
            darkMode: false,
          }}
        >
          <Form.Item
            label="User Name"
            name="userName"
          >
            {isEditing ? (
              <Space>
                <Input style={{ width: '200px' }} />
                <Button type="primary" onClick={handleSave}>保存</Button>
                <Button onClick={handleCancel}>取消</Button>
              </Space>
            ) : (
              <Space>
                <span>{userName}</span>
                <Button type="link" icon={<EditOutlined />} onClick={() => setIsEditing(true)} />
              </Space>
            )}
          </Form.Item>
          <Form.Item
            label="Safe Account"
            name="safeAccount"
          >
            {safeAccount ? (
              <Input value={safeAccount} disabled />
            ) : (
              <Button type="primary" onClick={handleGenerateAccount}>Generate Account</Button>
            )}
          </Form.Item>
        </Form>
      </Card>
      <Card 
        title="Members" 
        style={{ marginTop: 24 }}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddSigner}>Add signer</Button>}
      >
        <Form form={form1} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={members}
            pagination={false}
            rowClassName="editable-row"
          />
        </Form>
        <div style={{ marginTop: 24 }}>
          <Text strong>Required confirmations</Text>
          <div style={{ marginTop: 12 }}>
            <Space>
              <Text>Any transaction requires the confirmation of:</Text>
              {isEditingConfirmations ? (
                <Space>
                  <Input
                    type="number"
                    style={{ width: 60 }}
                    defaultValue={requiredConfirmations}
                    onPressEnter={(e) => handleConfirmationsChange(parseInt(e.target.value))}
                  />
                  <Text>out of {members.length} signers.</Text>
                  <Button type="primary" size="small" onClick={() => setIsEditingConfirmations(false)}>确定</Button>
                  <Button size="small" onClick={() => setIsEditingConfirmations(false)}>取消</Button>
                </Space>
              ) : (
                <Space>
                  <Text>{requiredConfirmations} out of {members.length} signers.</Text>
                  <Button type="primary" onClick={() => setIsEditingConfirmations(true)}>Change</Button>
                </Space>
              )}
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;