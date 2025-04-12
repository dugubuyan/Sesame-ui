// 从后端获取数据的API接口
const BASE_URL = 'http://localhost:3000';
let authToken = null;

// 登录并获取authToken
export const login = async (walletAddress) => {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress })
    });
    const data = await response.json();
    if (data.success) {
      authToken = data.data.authToken;
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
  if (!authToken) {
    throw new Error('未登录，请先连接钱包');
  }
  return {
    'Content-Type': 'application/json',
    'Auth-Token': authToken
  };
};

// Dashboard页面数据
export const fetchDashboardData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard`, {
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
  try {
    const response = await fetch(`${BASE_URL}/api/payroll`, {
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
  try {
    const response = await fetch(`${BASE_URL}/api/history`, {
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
    const response = await fetch(`${BASE_URL}/api/members`, {
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

// 保存员工数据
export const saveEmployeeData = async (walletAddress, employeeData) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  if (!employeeData) {
    throw new Error('员工数据不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/employee`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ employeeData })
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

// 保存Safe Account地址
export const saveSafeAccount = async (safeAddress) => {
  if (!safeAddress) {
    throw new Error('Safe Account地址不能为空');
  }
  try {
    const response = await fetch(`${BASE_URL}/api/safe-account`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ safeAddress })
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