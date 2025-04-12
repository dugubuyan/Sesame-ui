// 从后端获取数据的API接口

// Dashboard页面数据
export const fetchDashboardData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  // TODO: 实现从后端获取Dashboard数据的逻辑，使用walletAddress作为参数
  return {
    totalEmployees: 0,
    totalPayroll: 0,
    pendingPayments: 0,
    recentTransactions: []
  };
};

// Payroll页面数据
export const fetchPayrollData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  // 返回测试数据
  return {
    employees: [
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
    ]
  };
};

// History页面数据
export const fetchHistoryData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  // TODO: 实现从后端获取History数据的逻辑，使用walletAddress作为参数
  return {
    transactions: []
  };
};

// Settings页面成员数据
export const fetchMembersData = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  // TODO: 实现从后端获取Members数据的逻辑，使用walletAddress作为参数
  return {
    members: []
  };
};

// 保存员工数据
export const saveEmployeeData = async (walletAddress, employeeData) => {
  if (!walletAddress) {
    throw new Error('钱包地址不能为空');
  }
  if (!employeeData) {
    throw new Error('员工数据不能为空');
  }
  // TODO: 实现向后端保存员工数据的逻辑
  return true;
};