import BasicNftForm from "@/components/base/Forms/BasicNFT/BasicNFT";

export default function Home() {
  return (
    <div className="space-y-6 border p-6 rounded-md">
      <div>
        <h3 className="text-lg font-medium">Create a Basic NFT</h3>
        <p className="text-sm text-muted-foreground">
          Create a new on-chain NFT with the provided details.
        </p>
      </div>

      <BasicNftForm />
    </div>
  );
}
