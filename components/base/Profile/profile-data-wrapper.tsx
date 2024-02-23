"use client";

import { useWalletContext } from "@/contexts/walletContext";
import ProfileDataCards from "./profile-data-cards";

export default function ProfileDataWrapper() {
  const {
    userWallet: { isConnected },
  } = useWalletContext();

  return isConnected && <ProfileDataCards />;
}
