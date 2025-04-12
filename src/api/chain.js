import { ethers } from 'ethers'
import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import {abi} from './abi.js'
import { createClient } from 'viem';

// import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
// import { SafeAppProvider } from '@safe-global/safe-apps-provider';
const RPC_URL = 'https://eth-sepolia.public.blastapi.io'
const SAFE_ADDRESS = '0x3A51617cc9C3e0FA279B7a563b7dd6195667397A'
export async function payrollEx( ){
    const { sdk, safe } = useSafeAppsSDK();
    const web3Provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe]);
    const signer = web3Provider.getSigner();
    const protocolKit = await Safe.init({ web3Provider, signer, SAFE_ADDRESS });
    const safeAddress = await protocolKit.getAddress()

    console.log('Safe 钱包地址为：', safeAddress);
    // const contractAddress = '0xe95248cC62eA0b35f7acb9Dcb46BFcD65C7aDfAF'
    // const contract = new ethers.Contract(contractAddress, abi, signer);
    // const transaction = await contract.populateTransaction.payroll(toAddresses, toAmounts);
    // console.log("transaction:",transaction)
    // return transaction
}

async function createSafeAccount(rpc, owners, threshold) {
    // const provider = new ethers.JsonRpcProvider(sepolia.rpcUrls.default.http[0]);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = new ethers.Wallet('0xac654a9523f5a68f9342c305d140a414942121a77e3d727e3deae4e307445c69', provider);

    const safeAccountConfig = {
        owners,
        threshold
    }
    const predictedSafe = {
        safeAccountConfig
        // More optional properties
      }
      const customTransport = async ({ method, params }) => {
        return await provider.request({ method, params });
      };
      const viemClient = createClient({ transport: customTransport });
    const protocolKit = await Safe.init({ viemClient, signer, predictedSafe });
    const safeAddress = await protocolKit.getAddress()

    console.log('Safe 钱包地址为：', safeAddress);
    const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction()
    console.log('deploymentTransaction',deploymentTransaction)  // 部署交易
    return safeAddress
}

// createSafeAccount(RPC_URL,['0x3A51617cc9C3e0FA279B7a563b7dd6195667397A','0x3A51617cc9C3e0FA279B7a563b7dd6195667397A'],2)

// payroll()