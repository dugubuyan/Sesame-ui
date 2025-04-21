import {abi,usdt_abi} from './abi.js'
import { createWalletClient, custom, publicActions } from 'viem';
import { sepolia } from 'viem/chains'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { PAYMENT_CONTRACT_ADDRESS,RPC_URLS,USDT_CONTRACT_ADDRESS } from './constant.js'

export async function makeTrans(toAddresses, toAmounts, safeAddress) {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('account:',account)
    const provider = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum)
    }).extend(publicActions);
    
    const signers = await provider.getAddresses()
    const signer = signers[0]
    console.log('signer',signer)
    
    const payment = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, abi, provider)
    
    // const toAddresses = ['0x97F28b404EEAf6a00660c113FEd550a23054ae46']
    // const toAmounts = [ethers.parseUnits("500", 6)]
    const transaction = await payment.payroll.populateTransaction(toAddresses, toAmounts)
    console.log("transaction:",transaction)
      
      const safeSdk = await Safe.init({ 
        provider: provider,
        signer: signer,
        safeAddress: safeAddress,
        // chainId: Number(network.chainId) // 添加 chainId 参数
      })
      const apiKit = new SafeApiKit({ chainId: 11155111 }) // Sepolia 测试网
      
      const safeTransaction = await safeSdk.createTransaction({ 
          transactions: [{
              ...transaction,
              value: "0"
          }]
      })
      console.log("safeTransaction:",safeTransaction)
      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
      console.log("safeTransaction hash:",safeTxHash)
      // safeTransaction hash: 0xe18d0998c0c28c7eb87f689d72d0560ff187853fa6db244c89bc92f9927d5f7a
      // first owner sign transaction start
      try {
        console.log("准备签名交易，交易哈希:", safeTxHash)
        console.log("当前签名者地址:", signer)
        console.log("Safe SDK 状态:", safeSdk)
        const senderSignature = await safeSdk.signHash(safeTxHash)
        console.log("签名成功，签名结果:", senderSignature)
        
        console.log("准备提交交易到Safe服务")
        await apiKit.proposeTransaction({
          safeAddress: safeAddress,
          safeTransactionData: safeTransaction.data,
          safeTxHash,
          senderAddress: signer,
          senderSignature: senderSignature.data,
        })
        
        const pendingTransactions = (await apiKit.getPendingTransactions(safeAddress)).results
        console.log("pendingTransactions:", pendingTransactions)
      } catch (error) {
        console.error('签名交易失败:', error)
        if (error.code === 'INVALID_ARGUMENT') {
          console.error('无效的交易哈希或签名参数')
        } else if (error.code === 'CALL_EXCEPTION') {
          console.error('合约调用异常，请检查Safe钱包状态')
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
          console.error('账户余额不足以支付gas费用')
        }
        throw error
      }
      // first owner sign transaction end
}

export async function getBalance(safeAddress) {
    const provider = new ethers.JsonRpcProvider(RPC_URLS['sepolia'])
    const contract = new ethers.Contract(USDT_CONTRACT_ADDRESS, usdt_abi, provider);
    const balance = await contract.balanceOf(safeAddress);
    console.log(`Balance of ${safeAddress}: ${ethers.formatUnits(balance, 6)} USDT`);
    return balance
}

export async function addFunds(ammount) {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('account:',account)
}

export async function getPendingTransactions(safeAddress) {
    const apiKit = new SafeApiKit({ chainId: 11155111 }) // Sepolia 测试网
    const pendingTransactions = (await apiKit.getPendingTransactions(safeAddress)).results
    console.log("pendingTransactions:", pendingTransactions)    
    return pendingTransactions
}

export async function commitTrans(safeTxHash, safeAddress) {    console.log('safeTxHash:',safeTxHash)
    try {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('account:',account)
        const provider = createWalletClient({   
          chain: sepolia,
          transport: custom(window.ethereum)
        }).extend(publicActions);
        
        const signers = await provider.getAddresses()
        const signer = signers[0]
        console.log('signer',signer)
        // 另一个所有者确认 transaction
        const protocolKitOwner = await Safe.init({ 
            provider: provider,
            signer: signer,
            safeAddress: safeAddress,
            // chainId: Number(network.chainId) // 添加 chainId 参数
          })
          const signature = await protocolKitOwner.signHash(safeTxHash)
          // 添加所有者2的签名
        //   await safeTransaction.addSignature(signature)
          const apiKit = new SafeApiKit({ chainId: 11155111 }) // Sepolia 测试网
          // Confirm the Safe transaction
          const signatureResponse = await apiKit.confirmTransaction(
              safeTxHash,
              signature.data
          )
          console.log("signatureResponse:", signatureResponse)
         
        //   执行 transaction  
          const executeTransaction = await apiKit.getTransaction(safeTxHash)  
          console.log("executeTransaction:", executeTransaction)
          const receipt = await protocolKitOwner.executeTransaction(executeTransaction)
          console.log('交易已执行:', receipt)
    } catch (error) {
        console.error('MetaMask连接错误:', error)
        throw error
    }
}