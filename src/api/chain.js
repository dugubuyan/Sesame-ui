import { RUN_ENV } from './constant.js';

function generateRandomHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}
let transaction_hash;
export async function makeTrans(toAddresses, toAmounts, safeAddress) {
    console.log('Dev环境: makeTrans模拟调用');
    console.log('toAddresses:', toAddresses);
    console.log('toAmounts:', toAmounts);
    console.log('safeAddress:', safeAddress);
    transaction_hash = generateRandomHash();
    console.log('transaction_hash:', transaction_hash);
    return transaction_hash
}

export async function getBalance(safeAddress) {
    console.log('Dev环境: getBalance模拟调用');
    console.log('safeAddress:', safeAddress);
    return 10000;
}

export async function addFunds(client, wallet, safeAddress, ammount) {
    console.log('Dev环境: addFunds模拟调用');
    console.log('safeAddress:', safeAddress);
    console.log('ammount:', ammount);
    return {
        hash: generateRandomHash(),
        success: true
    };
}

export async function getPendingTransactions(safeAddress) {
    console.log('Dev环境: getPendingTransactions模拟调用');
    console.log('safeAddress:', safeAddress);
    return [{
        "safe": "0x3A51617cc9C3e0FA279B7a563b7dd6195667397A",
        "to": "0xd54326EeceCEffC8Ef15D19D57884d0D26F83f26",
        "value": "0",
        "data": "0x1230fa5e000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000097f28b404eeaf6a00660c113fed550a23054ae460000000000000000000000007989152090ff5d0f76a52088b4c24f62348d65d000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000014dc9380000000000000000000000000000000000000000000000000000000001908b100",
        "operation": 0,
        "gasToken": "0x0000000000000000000000000000000000000000",
        "safeTxGas": 0,
        "baseGas": 0,
        "gasPrice": "0",
        "refundReceiver": "0x0000000000000000000000000000000000000000",
        "nonce": 10,
        "executionDate": null,
        "submissionDate": "2025-04-24T03:59:48.652207Z",
        "modified": "2025-04-24T03:59:48.752331Z",
        "blockNumber": null,
        "transactionHash": null,
        "safeTxHash": "0x771586561f2ea906679fb704b2eee895fc12c14025e86a9d5452282ccc990728",
        "proposer": "0x9145CEb6B60b656F28edC11dc26479DEb7e8Bbf5",
        "proposedByDelegate": null,
        "executor": null,
        "isExecuted": false,
        "isSuccessful": null,
        "ethGasPrice": null,
        "maxFeePerGas": null,
        "maxPriorityFeePerGas": null,
        "gasUsed": null,
        "fee": null,
        "origin": "{}",
        "dataDecoded": null,
        "confirmationsRequired": 2,
        "confirmations": [{
            "owner": "0x9145CEb6B60b656F28edC11dc26479DEb7e8Bbf5",
            "submissionDate": "2025-04-24T03:59:48.752331Z",
            "transactionHash": null,
            "signature": "0xbb51cff36c6b3df80df561242161f746b4b7ff67f7d3fa0b9b4b5ceb122658101ce14f1c24c985c1a5e203f4c9a29a6639cd7907e06ac3d359d62670b14461ca1f",
            "signatureType": "ETH_SIGN"
        }],
        "trusted": true,
        "signatures": null
    }];
}

export async function commitTrans(safeTxHash, safeAddress) {
    console.log('Dev环境: commitTrans模拟调用');
    console.log('safeTxHash:', safeTxHash);
    console.log('safeAddress:', safeAddress);
    return {
        hash: generateRandomHash(),
        success: true
    };
}