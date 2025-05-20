import SafeApiKit from '@safe-global/api-kit'
// import Safe from '@safe-global/protocol-kit'
async function getSafeSigners(chainId, safeAddress) {
    console.log('chainId:', chainId);
    console.log('safeAddress:', safeAddress);
    const apiKit = new SafeApiKit({ chainId: chainId })
    const safeInfo = await apiKit.getSafeInfo(safeAddress);
    console.log('签名者:', safeInfo);
    return safeInfo
  }
await getSafeSigners(11155111n, '0x8A92c1bDf9bB7c69633b6283DE3e489c29d7EACd')