import SecretNftForm from "@/components/base/Forms/SecretNFT/SecretNFT";
import React from "react";

export default function Secret() {
  return (
    <div className="space-y-6 border p-6 rounded-md">
      <div>
        <h3 className="text-lg font-medium">Create a Secret NFT</h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Associate private-content to an NFT that only the owner can access.
          </p>
          <p className="text-sm text-muted-foreground italic">
            The private-content consists of a media that is encrypted using generated PGP
            keys. After encrypting the media, the PGP private key is split into
            shares using Shamir Secret Sharing algorithm. Each share is securely
            stored in an enclave using the TEE technology, where individuals or
            centralized entities other than the current owner of the Secret NFT
            cannot access them.
          </p>
        </div>
      </div>

      <SecretNftForm />
    </div>
  );
}
