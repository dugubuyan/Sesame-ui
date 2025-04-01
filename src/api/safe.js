import { ethers } from 'ethers'
// import { EthersAdapter } from '@safe-global/protocol-kit'
// import { Safe, SafeApiKit } from '@safe-global/safe-core-sdk'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import {abi} from './abi.js'
// import { SafeFactory, SafeAccountConfig } from '@safe-global/safe-core-sdk'

const privateKey = 'ac654a9523f5a68f9342c305d140a414942121a77e3d727e3deae4e307445c69'
const anotherOwnerPrivateKey = 'c5a401b86fbf49b4cc8c516a8ac251460c40af62ad02f184733cd7a4ff8eb1a0' // 另一个所有者的私钥
// const Owner1 = ''
// const Owner2 = ''

const RPC_URL = 'https://eth-sepolia.public.blastapi.io'
const OWNER_1_PRIVATE_KEY = 'ac654a9523f5a68f9342c305d140a414942121a77e3d727e3deae4e307445c69'
const SAFE_ADDRESS = '0x3A51617cc9C3e0FA279B7a563b7dd6195667397A'

const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(privateKey, provider) 
// const tokenContractAddress = "0x0BbbDBD6584Fa2f9dBf4bC0b441B6e17414db88F"
const paymentContractAddress = "0xe95248cC62eA0b35f7acb9Dcb46BFcD65C7aDfAF"
async function payroll(addresses, amounts) {
    const payment = new ethers.Contract(paymentContractAddress, abi, provider)
    // // 确保amounts数组中的值都是BigNumber类型
    // const processedAmounts = amounts.map(amount => {
    //     if (typeof amount === 'string' || typeof amount === 'number') {
    //         return ethers.BigNumber.from(amount)
    //     }
    //     return amount
    // })
    console.log("amounts:",amounts)
    const unsignedTrans = await payment.populateTransaction.payroll(addresses, amounts)
    return unsignedTrans
}
const toAddresses = ['0x97F28b404EEAf6a00660c113FEd550a23054ae46']
const toAmounts = [ethers.utils.parseUnits("500", 6)]

// const ethAdapter = new EthersAdapter({ ethers, provider, signer })
const safeSdk = await Safe.init({ 
    provider: RPC_URL,
    signer: OWNER_1_PRIVATE_KEY,
    safeAddress: SAFE_ADDRESS }
);
const apiKit = new SafeApiKit({ chainId: 11155111 }) // Sepolia 测试网

const transaction = await payroll(toAddresses, toAmounts)
console.log("transaction:",transaction)
const safeTransaction = await safeSdk.createTransaction({ 
    transactions: [{
        ...transaction,
        value: "0"
    }]
})
console.log("safeTransaction:",safeTransaction)
const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
console.log("safeTransaction hash:",safeTxHash)
const senderSignature = await safeSdk.signHash(safeTxHash)
await apiKit.proposeTransaction({
    safeAddress: SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: signer.address,
    senderSignature: senderSignature.data,
  })
const pendingTransactions = (await apiKit.getPendingTransactions(SAFE_ADDRESS)).results
console.log("pendingTransactions:",pendingTransactions)
// 另一个所有者确认 transaction
const protocolKitOwner2 = await Safe.init({
    provider: RPC_URL,
    signer: anotherOwnerPrivateKey,
    safeAddress: SAFE_ADDRESS
    })
const signature = await protocolKitOwner2.signHash(safeTxHash)
// 添加所有者2的签名
await safeTransaction.addSignature(signature)
// 添加所有者1的签名
await safeTransaction.addSignature(senderSignature)

// Confirm the Safe transaction
const signatureResponse = await apiKit.confirmTransaction(
    safeTxHash,
    signature.data
)
console.log("signatureResponse:", signatureResponse)

// 执行 transaction  
const receipt = await safeSdk.executeTransaction(safeTransaction)
console.log('交易已执行:', receipt)

// 部署新的 Safe 钱包
// async function newSafeAddress(owners, threshold ) {
//     const safeFactory = await SafeFactory.create({ ethAdapter })
//     const safeAccountConfig = { owners, threshold }
//     const newSafeSdk = await safeFactory.deploySafe({ safeAccountConfig })
//     return newSafeSdk.SafeAddress
// }
// const owners = [Owner1,Owner2]
// const threshold = 2
// newSafeAddress(owners,threshold)


