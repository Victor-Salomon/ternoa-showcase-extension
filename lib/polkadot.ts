import { getRawApi } from "ternoa-js";

export const getAccounts = async () => {
  const { web3Accounts, web3Enable } = await import("@polkadot/extension-dapp");
  const extensions = await web3Enable("ternoa-hacked");
  if (extensions.length === 0)
    throw new Error(
      'polkadot{.js} extension might not be installed. Make sure you allowed the dApp in the "Manage Website Access" settings of your wallet.'
    );
  const allAccounts = await web3Accounts();
  return allAccounts;
};

export const getPolkadotSigner = async (
  address: string,
) => {
  try {
    const { web3FromAddress } = await import("@polkadot/extension-dapp");
    return await web3FromAddress(address) as Record<string, any>;
    // const signer = injector?.signer as any;
  } catch (err) {
    console.log(err);
    return;
  }
};
