export const abi = [
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'tokenAddr',
          'type': 'address'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'constructor'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'InsufficientBalance',
      'type': 'error'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'InsufficientERC20',
      'type': 'error'
    },
    {
      'inputs': [],
      'name': 'InvalidAddress',
      'type': 'error'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'owner',
          'type': 'address'
        }
      ],
      'name': 'InvalidOwner',
      'type': 'error'
    },
    {
      'inputs': [],
      'name': 'PayrollInvalidPara',
      'type': 'error'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'account',
          'type': 'address'
        }
      ],
      'name': 'balanceOf',
      'outputs': [
        {
          'internalType': 'uint256',
          'name': '',
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address[]',
          'name': '_addresses',
          'type': 'address[]'
        },
        {
          'internalType': 'uint256[]',
          'name': '_amounts',
          'type': 'uint256[]'
        }
      ],
      'name': 'batchPay',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint16',
          'name': 'newRate',
          'type': 'uint16'
        }
      ],
      'name': 'changeFee',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'deposit',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'name': 'getToken',
      'outputs': [
        {
          'internalType': 'address',
          'name': '',
          'type': 'address'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'to',
          'type': 'address'
        },
        {
          'internalType': 'uint256',
          'name': 'value',
          'type': 'uint256'
        }
      ],
      'name': 'pay',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address[]',
          'name': '_addresses',
          'type': 'address[]'
        },
        {
          'internalType': 'uint256[]',
          'name': '_amounts',
          'type': 'uint256[]'
        }
      ],
      'name': 'payroll',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'address',
          'name': 'newOwner',
          'type': 'address'
        }
      ],
      'name': 'transferOwnership',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'withdraw',
      'outputs': [
        {
          'internalType': 'bool',
          'name': '',
          'type': 'bool'
        }
      ],
      'stateMutability': 'nonpayable',
      'type': 'function'
    }
  ]

export const usdt_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]