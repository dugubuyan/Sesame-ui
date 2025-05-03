// 从后端获取数据的API接口
const BASE_URL = 'http://localhost:30001';
let authToken = localStorage.getItem('authToken');

// 清除authToken
export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

// 登录并获取authToken
export const login = async (walletAddress, chainId) => {
  try {
    console.log('登录请求:', walletAddress, chainId); 
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress, chainId })
    });
    const data = await response.json();
    if (data.success) {
      authToken = data.data.authToken;
      localStorage.setItem('authToken', authToken);
      return data.data.authToken;
    }
    throw new Error('登录失败');
  } catch (error) {
    console.error('登录请求失败:', error);
    throw error;
  }
};

// 获取请求头
const getHeaders = () => {
  const storedAuthToken = localStorage.getItem('authToken');
  if (!storedAuthToken) {
    throw new Error('未登录，请先连接钱包');
  }
  return {
    'Content-Type': 'application/json',
    'Auth-Token': storedAuthToken
  };
};

// Dashboard页面数据
export const fetchDashboardData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  const chainId = localStorage.getItem('chainId');
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard?walletAddress=${walletAddress}&chainId=${chainId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error('获取Dashboard数据失败');
  } catch (error) {
    console.error('获取Dashboard数据失败:', error);
    throw error;
  }
};

// Payroll页面数据
export const fetchPayrollData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  const chainId = localStorage.getItem('chainId');

  try {
    const response = await fetch(`${BASE_URL}/api/payroll?walletAddress=${walletAddress}&chainId=${chainId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error('获取Payroll数据失败');
  } catch (error) {
    console.error('获取Payroll数据失败:', error);
    throw error;
  }
};

// History页面数据
export const fetchHistoryData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  const chainId = localStorage.getItem('chainId'); // 获取chainId from local storage
  console.log('chainId:', chainId); // log the chainId
  try {
    const response = await fetch(`${BASE_URL}/api/history?walletAddress=${walletAddress}&chainId=${chainId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error('获取History数据失败');
  } catch (error) {
    console.error('获取History数据失败:', error);
    throw error;
  }
};

// Settings页面成员数据
export const fetchMembersData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/members?walletAddress=${walletAddress}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error('获取Members数据失败');
  } catch (error) {
    console.error('获取Members数据失败:', error);
    throw error;
  }
};

// 删除员工数据
export const deleteEmployeeData = async (walletAddress, employeeId) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  if (!employeeId) {
    throw new Error('员工ID不能为空');
  }
  const chainId = localStorage.getItem('chainId'); // 获取chainId from local storage
  console.log('chainId:', chainId); // log the chainId
  try {
    const response = await fetch(`${BASE_URL}/api/employee/${employeeId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ walletAddress, chainId })
    });
    const data = await response.json();
    if (data.success) {
      return true;
    }
    throw new Error('删除员工数据失败');
  } catch (error) {
    console.error('删除员工数据失败:', error);
    throw error;
  }
};

// 保存员工数据
export const saveEmployeeData = async (walletAddress, employeeData) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  if (!employeeData) {
    throw new Error('员工数据不能为空');
  }
  const chainId = localStorage.getItem('chainId'); // 获取chainId from local storage
  console.log('chainId:', chainId); // log the chainId
  if (!chainId) {
    throw new Error('chainId不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/employee`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ walletAddress, employeeData,chainId })
    });
    const data = await response.json();
    if (data.success) {
      return true;
    }
    throw new Error('保存员工数据失败');
  } catch (error) {
    console.error('保存员工数据失败:', error);
    throw error;
  }
};

// 获取用户信息
export const fetchUserInfo = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  const chainId = localStorage.getItem('chainId');
  
  try {
    const response = await fetch(`${BASE_URL}/api/user?walletAddress=${walletAddress}&chainId=${chainId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error('获取用户信息失败');
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 更新用户信息
export const updateUserInfo = async (walletAddress, userInfo) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  const chainId = localStorage.getItem('chainId');
  try {
    const response = await fetch(`${BASE_URL}/api/user`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ walletAddress,chainId, ...userInfo })
    });
    const data = await response.json();
    if (data.success) {
      return true;
    }
    throw new Error('更新用户信息失败');
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

// 保存待处理交易
export const savePendingTransaction = async (transactionData) => {
    if (!transactionData) {
      throw new Error('交易数据不能为空');
    }
    try {
      const { walletAddress, safeAccount,chainId, total, transactionDetails, transactionHash, proposeAddress } = transactionData;
      const response = await fetch(`${BASE_URL}/api/pending-transaction`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          walletAddress,
          safeAccount,
          total,
          transactionDetails,
          chainId,
          transactionHash,
          proposeAddress
        })
      });
      const data = await response.json();
      if (data.success) {
        return true;
      }
      throw new Error('保存待处理交易失败');
    } catch (error) {
      console.error('保存待处理交易失败:', error);
      throw error;
    }
  };
// 获取待处理交易
export const fetchPendingTransactions = async (walletAddress, chainId, status = 1) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/pending-transactions?walletAddress=${walletAddress}&chainId=${chainId}&status=${status}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success) {
      return {
        ...data.data,
        transactions: data.data.transactions.map(tx => ({
          ...tx,
          propose_address: tx.propose_address || '',
          total: tx.total || 0
        }))
      };
    }
    throw new Error('获取待处理交易失败');
  } catch (error) {
    console.error('获取待处理交易失败:', error);
    throw error;
  }
};

// 更新待处理交易状态
export const updatePendingTransaction = async (walletAddress, transaction_hash, status, chainId, commit_hash) => {
  if (!walletAddress || !transaction_hash) {
    throw new Error('钱包地址和交易HASH不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/pending-transaction/update`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ transaction_hash, walletAddress, status, chainId, commit_hash })
    });
    const data = await response.json();
    if (data.success) {
      return true;
    }
    throw new Error('更新待处理交易状态失败');
  } catch (error) {
    console.error('更新待处理交易状态失败:', error);
    throw error;
  }
};

// 获取特定地址的交易历史
export const fetchTransactionHistory = async (address,walletAddress, chainId, safeAccount) => {
  if (!address) {
    throw new Error('钱包地址不能为空');
  }
  if (!chainId) {
    throw new Error('链ID不能为空');
  }
  if (!safeAccount) {
    throw new Error('Safe账户不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/transaction-history?walletAddress=${walletAddress}&address=${address}&chain_id=${chainId}&safe_account=${safeAccount}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error('获取交易历史失败');
  } catch (error) {
    console.error('获取交易历史失败:', error);
    throw error;
  }
};

// 保存Safe Account地址
export const saveSafeAccount = async (walletAddress, safeAddress, chainId, signers) => {
  if (!safeAddress) {
    throw new Error('Safe Account地址不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/safe-account`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ walletAddress, safeAddress, chainId, signers })
    });
    const data = await response.json();
    if (data.success) {
      return true;
    }
    throw new Error('保存Safe Account失败');
  } catch (error) {
    console.error('保存Safe Account失败:', error);
    throw error;
  }
};
