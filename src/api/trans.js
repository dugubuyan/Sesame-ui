import {abi,usdt_abi} from './abi.js'
import { createWalletClient, custom, publicActions } from 'viem';
import { bsc, sepolia } from 'viem/chains'
import { extractChain } from 'viem'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { PAYMENT_CONTRACT_ADDRESS,USDT_CONTRACT_ADDRESS,RUN_ENV } from './constant.js'
import * as chainApi from './chain.js'

const getChainInfo = (chainId) => {
  console.log('chainId:',chainId)
  // 确保chainId为数字类型
  const numericChainId = typeof chainId === 'string' ? parseInt(chainId) : chainId
  console.log('numericChainId:', numericChainId)
  const chain = extractChain({ chains: [bsc, sepolia], id: numericChainId })
  console.log('chain:',chain)
  if (!chain) {
    throw new Error(`不支持的链ID: ${numericChainId}，目前仅支持BSC和Sepolia链`)
  }
  return chain
}

const getProviderAndSigner = async (chainId) => {
  const chain = getChainInfo(chainId)
  const provider = createWalletClient({
    chain: chain,
    transport: custom(window.ethereum)
  }).extend(publicActions);
  const signers = await provider.getAddresses()
  const signer = signers[0]
  console.log('signer',signer)
  return {provider,signer }
}

export async function makeTrans(chainId,toAddresses, toAmounts, safeAddress) {
    if (RUN_ENV === 'dev') {
        return chainApi.makeTrans(toAddresses, toAmounts, safeAddress);
    }
    console.log('chainID:',chainId)
    const {provider,signer} = await getProviderAndSigner(chainId)
    
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
      const apiKit = new SafeApiKit({ chainId: chainId })
      
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
      return safeTxHash
      // first owner sign transaction end
}

export async function getBalance(chainId, safeAddress) {
    if (RUN_ENV === 'dev') {
        return chainApi.getBalance(safeAddress);
    }
    // const {provider} = await getProviderAndSigner(chainId)
    const provider = new ethers.BrowserProvider(window.ethereum);
    // const provider = new ethers.JsonRpcProvider(Sepolia_RPC_URL)
    console.log('provider:',provider)
    const contract = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, usdt_abi, provider);
    const bn = await contract.balanceOf(safeAddress);
    const balance = ethers.formatUnits(bn,6)
    console.log(`Balance of ${safeAddress}: ${balance} USDT`);
    return balance
}

export async function addFunds(chainId, wallet, safeAddress, ammount) {
    if (RUN_ENV === 'dev') {
        return chainApi.addFunds(client, wallet, safeAddress, ammount);
    }
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('account:',account)
    // const {signer} = await getProviderAndSigner(chainId)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log('provider:',provider)
    console.log('signer:',signer)
    console.log('ammount:',ammount)
    const amt = ethers.parseUnits(ammount, 6)
    console.log('amt:',amt)
    const contract = new ethers.Contract(USDT_CONTRACT_ADDRESS, usdt_abi, signer);
    console.log("contract:",contract)
    const transaction = await contract.approve(PAYMENT_CONTRACT_ADDRESS, amt)
    console.log("transaction:",transaction)
    // Cannot read properties of null (reading 'getTransactionReceipt')
    const receipt = await transaction.wait()
    console.log("receipt:",receipt)
    const payContract = new ethers.Contract(PAYMENT_CONTRACT_ADDRESS, abi, signer);
    const tx = await payContract.deposit(safeAddress, amt)
    const receipt2 = await tx.wait()
    console.log("receipt2:", receipt2)
    return receipt2
}

export async function getPendingTransactions(chainId, safeAddress) {
    if (RUN_ENV === 'dev') {
        return chainApi.getPendingTransactions(safeAddress);
    }
    const apiKit = new SafeApiKit({ chainId: chainId })
    const pendingTransactions = (await apiKit.getPendingTransactions(safeAddress)).results
    console.log("pendingTransactions:", pendingTransactions)    
    return pendingTransactions
}

export async function commitTrans(chainId, safeTxHash, safeAddress) {
    if (RUN_ENV === 'dev') {
        return chainApi.commitTrans(safeTxHash, safeAddress);
    }    
    console.log('safeTxHash:',safeTxHash)
    try {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('account:',account)
        const {provider,signer} = await getProviderAndSigner(chainId)
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
          const apiKit = new SafeApiKit({ chainId }) // Sepolia 测试网
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
          return receipt.hash
    } catch (error) {
        console.error('MetaMask连接错误:', error)
        throw error
    }
}

export async function getSafeSigners(chainId, safeAddress) {
  if (RUN_ENV === 'dev') {
    return chainApi.getSafeSigners(chainId, safeAddress);
  }
  const apiKit = new SafeApiKit({ chainId: chainId })
  const safeInfo = await apiKit.getSafeInfo(safeAddress);
  console.log('签名者:', safeInfo);
  return safeInfo
}