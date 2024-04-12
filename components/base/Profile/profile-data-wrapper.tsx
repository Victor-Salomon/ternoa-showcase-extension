"use client";

import { useWalletContext } from "@/contexts/walletContext";
import ProfileDataCards from "./profile-data-cards";

export default function ProfileDataWrapper() {
  const {
    userWallet: { isConnected, address },
  } = useWalletContext();

  return isConnected && <ProfileDataCards address={address}/>;
}
