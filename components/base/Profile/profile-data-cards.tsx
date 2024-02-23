import TernoaIcon from "@/assets/providers/Ternoa";
import { BookMarked, FileJson, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function ProfileDataCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <NftCard />
      <BalanceCard />
      <IndexerCard />
      <DictionaryCard />
    </div>
  );
}

const NftCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Number of NFT(S)</CardTitle>
        <FileJson className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">100</div>
      </CardContent>
    </Card>
  );
};

const BalanceCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Account balance</CardTitle>
        <TernoaIcon className="h-5 w-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">CAPS</div>
      </CardContent>
    </Card>
  );
};

const IndexerCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Indexer last block
        </CardTitle>
        <Link className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">9000000</div>
        <p className="text-xs text-muted-foreground">
          Last block from chain : 9000000
        </p>
      </CardContent>
    </Card>
  );
};

const DictionaryCard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Dictionary last block
        </CardTitle>
        <BookMarked className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">9000000</div>
        <p className="text-xs text-muted-foreground">
          Last block from chain : 9000000
        </p>
      </CardContent>
    </Card>
  );
};
