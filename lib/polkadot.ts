export const getAccounts = async () => {
  const { web3Accounts, web3Enable } = await import("@polkadot/extension-dapp");
  const extensions = await web3Enable("ternoa-hacked");
  if (extensions.length === 0)
    throw new Error(
      'polkadot{.js} extension might not be installed. Make sure you allowed Ternoa Hacked in the "Manage Website Access" settings of your wallet.'
    );
  const allAccounts = await web3Accounts();
  return allAccounts;
};
