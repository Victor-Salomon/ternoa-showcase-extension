import TernoaIcon from "@/assets/providers/Ternoa";
import { BookMarked, FileJson, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { balanceToNumber, getBalances, getLastBlock } from "ternoa-js";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { cn, formatBalance } from "@/lib/utils";
import { useNetworkContext } from "@/contexts/networkContext";
import { getIndexerLastBlock, getTotalNFTs } from "@/lib/indexer";

export default function ProfileDataCards({ address }: { address: string }) {
  const { network } = useNetworkContext();
  const {
    isLoading: balanceLoading,
    data: balance,
    error: balanceError,
  } = useQuery({
    queryKey: ["balances"],
    queryFn: async () => {
      const balance = await getBalances(address);
      if (!balance) throw new Error("BALANCE_UNDEFINED");
      const options = { withSi: true };
      return balanceToNumber(balance.free, options);
    },
  });

  const {
    isLoading: totalNFTsLoading,
    data: totalNFTs,
    error: totalNFTsError,
  } = useQuery({
    queryKey: ["totalNFTs"],
    queryFn: async () => {
      return await getTotalNFTs(address, network);
    },
  });

  const {
    isLoading: lastBlockLoading,
    data: lastBlock,
    error: lastBlockError,
  } = useQuery({
    queryKey: ["lastBlock"],
    queryFn: async () => {
      const idxrLastBlock = await getIndexerLastBlock(network);
      const chainLastBlock = await getLastBlock();
      return { ...idxrLastBlock, chainLastBlock };
    },
  });

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <NftCard
        nfts={totalNFTs}
        isLoading={totalNFTsLoading}
        error={totalNFTsError}
      />
      <BalanceCard
        balance={balance}
        isLoading={balanceLoading}
        error={balanceError}
      />
      <IndexerCard
        blocksData={lastBlock}
        isLoading={lastBlockLoading}
        error={lastBlockError}
      />
      {/* <DictionaryCard /> */}
    </div>
  );
}

const NftCard = ({
  nfts,
  isLoading,
  error,
}: {
  nfts?: number;
  isLoading?: boolean;
  error?: Error | null;
}) => {
  return isLoading ? (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-full my-2" />
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Number of NFT(S)</CardTitle>
        <FileJson className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        {nfts ? (
          <div className="text-2xl font-bold">{nfts}</div>
        ) : error ? (
          "Error"
        ) : (
          "-"
        )}
      </CardContent>
    </Card>
  );
};

const BalanceCard = ({
  balance,
  isLoading,
  error,
}: {
  balance?: string;
  isLoading?: boolean;
  error?: Error | null;
}) => {
  return isLoading ? (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-full my-2" />
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Account balance</CardTitle>
        <TernoaIcon className="h-5 w-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {balance ? (
            <span>
              {formatBalance(balance)}{" "}
              <span className="text-lg font-light">CAPS</span>
            </span>
          ) : error ? (
            "Error"
          ) : (
            "-"
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const IndexerCard = ({
  blocksData,
  isLoading,
  error,
}: {
  blocksData?: {
    chainLastBlock: number;
    lastProcessedHeight: number;
    indexerHealthy: boolean;
  };
  isLoading?: boolean;
  error?: Error | null;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center space-x-1 text-sm font-medium">
          <span>Indexer last block </span>
          <span
            className={cn(
              "text-xs",
              blocksData?.indexerHealthy ? "text-green-500" : "text-red-500"
            )}
          >
            {blocksData?.indexerHealthy ? "Healthy" : "Broken"}
          </span>
        </CardTitle>
        <Link className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {blocksData?.lastProcessedHeight}
        </div>
        <p className="text-xs text-muted-foreground">
          Last block from chain : {blocksData?.chainLastBlock}
        </p>
      </CardContent>
    </Card>
  );
};

// const DictionaryCard = () => {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">
//           Dictionary last block
//         </CardTitle>
//         <BookMarked className="w-5 h-5" />
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">9000000</div>
//         <p className="text-xs text-muted-foreground">
//           Last block from chain : 9000000
//         </p>
//       </CardContent>
//     </Card>
//   );
// };
