import BasicNftForm from "@/components/base/Forms/BasicNFT/BasicNFT";
import { getKeyringFromSeed, initializeApi, teeNFTReconciliation } from "ternoa-js";

export default async function Home() {
  await initializeApi()
  const keyring = await getKeyringFromSeed("alley notice chuckle story upset melody thumb denial ticket kiwi gesture purpose")
  const data = await teeNFTReconciliation(2, [7000000, 7040000], keyring)
  return (
    <div className="space-y-6 border p-6 rounded-md">
      <div>
        <h3 className="text-lg font-medium">Create a Basic NFT</h3>
        <p className="text-sm text-muted-foreground">
          Create a new on-chain NFT with the provided details.
          {data[0]?.enclaveAddress}
        </p>
      </div>

      <BasicNftForm />
    </div>
  );
}
