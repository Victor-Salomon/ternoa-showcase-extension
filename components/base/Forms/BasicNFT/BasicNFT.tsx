"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import {
  BlockInfo,
  File,
  NFTCreatedEvent,
  TernoaIPFS,
  initializeApi,
  isApiConnected,
} from "ternoa-js";

import { FormSchemaType, formSchema } from "./zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import TernoaIcon from "@/assets/providers/Ternoa";
import { CHAIN_WSS } from "@/lib/constants";
import { useWalletContext } from "@/contexts/walletContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Connection from "../../Modals/Connection";
import { Textarea } from "@/components/ui/textarea";
import { getExplorerLink, mintNFT } from "@/lib/ternoa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { middleEllipsis } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function BasicNftForm() {
  const { userWallet } = useWalletContext();
  const [nftFile, setNftFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isNftLoading, setIsNftLoading] = useState<boolean>(false);
  const [nftLoadingState, setNftLoadingState] = useState<string | undefined>(
    undefined
  );
  const [nftData, setNftData] = useState<NFTCreatedEvent | undefined>(
    undefined
  );
  const [blockData, setBlockData] = useState<BlockInfo | undefined>(undefined);
  const [isForm, setIsForm] = useState<boolean>(false);
  const fileTypes = ["JPG", "JPEG", "PNG", "jpg", "jpeg", "png"];

  const cleanStates = () => {
    setIsNftLoading(false);
    setNftLoadingState(undefined);
    setNftFile(undefined);
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royalty: "0",
      collection: "",
      soulbond: false,
      metadataTitle: "",
      metadataDescription: "",
    },
  });

  const handleNFTPreviewChange = async (file: File) => {
    setError(undefined);
    setNftFile(file);
  };

  const handleNftForm = async (values: FormSchemaType) => {
    setError(undefined);
    setIsNftLoading(true);
    setNftLoadingState(`Verifiying & formatting metadata`);
    if (!nftFile) {
      cleanStates();
      setError("OFFCHAIN_META_DATA_ERROR: File missing. Please upload a file.");
      return;
    }

    if (!values.metadataTitle || !values.metadataDescription) {
      cleanStates();
      setError(
        !values.metadataTitle
          ? "OFFCHAIN_META_DATA_ERROR: Please add a title."
          : "OFFCHAIN_META_DATA_ERROR: Please add a description."
      );
      return;
    }
    const formatedroyalty = values.royalty ? Number(values.royalty) : 0;
    const formatedCollection = values.collection
      ? Number(values.collection)
      : undefined;
    if (!isApiConnected()) {
      console.log("Ternoa API new initialization");
      await initializeApi(CHAIN_WSS);
    }

    setNftLoadingState(
      `Uploading metadata & ${nftFile.name} file to IPFS cluster.`
    );
    try {
      const IPFS_URL = "https://ipfs-dev.trnnfr.com";
      const IPFS_API_KEY = "98791fae-d947-450b-a457-12ecf5d9b858";
      const ipfsClient = new TernoaIPFS(new URL(IPFS_URL), IPFS_API_KEY);
      const nftMetadata = {
        title: values.metadataTitle
          ? values.metadataTitle
          : `NFT created by ${userWallet.address}`,
        description: values.metadataDescription
          ? values.metadataDescription
          : `Coming from the Ternoa dApp showcase.`,
      };
      const { Hash } = await ipfsClient.storeNFT(nftFile, nftMetadata);
      setNftLoadingState(
        `NFT being minted on the Ternoa blockchain: please sign the transaction.`
      );
      const nftData = await mintNFT(
        userWallet.address,
        Hash,
        formatedroyalty,
        formatedCollection,
        values.soulbond
      );
      setNftData(nftData.nftEvent);
      setBlockData(nftData.blockInfo);
      setIsNftLoading(false);
      return;
    } catch (error) {
      const errorDescription =
        error instanceof Error ? error.message : JSON.stringify(error);
      setError(errorDescription);
      setIsNftLoading(false);
      return;
    } finally {
      cleanStates();
      form.reset();
    }
  };

  useEffect(() => setIsForm(true), []);

  return (
    <>
      {!isForm ? (
        <div className="flex flex-col items-center space-y-3 my-16">
          <TernoaIcon className="animate-bounce text-muted h-30 w-30" />
          <Skeleton className="h-6 w-1/3 bg-muted" />
        </div>
      ) : (
        <div className="w-3/6 mx-auto bg-gradient-to-r from-indigo-400 to-cyan-400 p-0.5 rounded-lg">
          <FileUploader
            handleChange={handleNFTPreviewChange}
            name="file"
            type={fileTypes}
            onTypeError={(err: Error) => console.log(err)}
            onSizeError={(err: Error) => console.log(err)}
          >
            <div className="flex flex-col items-center border rounded-lg p-8 mx-auto bg-white cursor-pointer">
              <TernoaIcon />
              {nftFile ? (
                <p className="font-light text-sm py-2">
                  Upload a new file here.
                </p>
              ) : (
                <p className="font-light text-sm py-2">
                  Upload or drop a file right here
                </p>
              )}
            </div>
          </FileUploader>
        </div>
      )}
      {nftFile && (
        <p className="flex items-center justify-center from-purple-500 via-pink-500 to-blue-500 bg-gradient-to-r bg-clip-text text-transparent font-light text-sm">
          <span className="text-primary me-1">File name: </span>
          {nftFile.name}
          <X
            onClick={() => {
              setNftFile(undefined), form.reset();
            }}
            className="h-3 w-3 text-black cursor-pointer ms-0.5 mt-0.5"
          />
        </p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNftForm)} className="space-y-8">
          {nftFile && (
            <>
              <FormField
                control={form.control}
                name="metadataTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NFT Metadata Title <span className="text-red-500">*</span></FormLabel>
                    <FormControl className="font-light">
                      <Input placeholder="Add a title to your NFT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadataDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NFT Metadata Description <span className="text-red-500">*</span></FormLabel>
                    <FormControl className="font-light">
                      <Textarea
                        placeholder="Add a description to your NFT"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="royalty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Royalty</FormLabel>
                <FormControl className="font-light">
                  <Input placeholder="Set your royalty" {...field} />
                </FormControl>
                <FormDescription className="font-light text-xs">
                  Royalty is the percentage of all second sales that the creator
                  will receive. It is a decimal number in range [0, 100] with a
                  default value set to 0.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {userWallet.address && userWallet.collections.length ? (
            <FormField
              control={form.control}
              name="collection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="font-light">
                        <SelectValue placeholder="Select a collection id or keep it empty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userWallet.collections.map((c, idx) => (
                        <SelectItem key={idx} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <FormDescription className="font-light text-xs">
                      Collection ID represents the collection to which this NFT
                      will belong.
                    </FormDescription>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="collection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection</FormLabel>
                  <FormControl className="font-light">
                    <Input
                      placeholder="Add a collection id or keep it empty"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-light text-xs">
                    Collection ID represents the collection to which this NFT
                    will belong.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="soulbond"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium ">
                    Is it a soulbond NFT?
                  </FormLabel>
                  <FormDescription className="font-light w-9/12 text-xs">
                    Soulbound NFT are designed to be transferred only once and
                    are permanently tied to a user’s wallet address
                  </FormDescription>
                </div>
                <FormControl className="font-light">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {userWallet.address ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"} type="submit" disabled={!nftFile}>
                  Submit
                </Button>
              </DialogTrigger>
              {error && (
                <DialogContent className="sm:max-w-[425px] px-2 sm:px-6 rounded-md bg-gradient-to-r from-pink-900 via-fuchsia-900 to-red-900 py-4 w-2/3 mt-2 text-center mx-auto text-white">
                  <DialogHeader>
                    <DialogTitle className="p-4 bg-gradient-to-r from-red-300 to-pink-600 bg-clip-text text-transparent text-center">
                      Something went wrong
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="pb-6 bg-gradient-to-r from-red-300 to-pink-600 bg-clip-text text-transparent text-sm">
                    {error}
                  </DialogDescription>
                </DialogContent>
              )}
              {isNftLoading && (
                <DialogContent className="sm:max-w-[425px] px-2 sm:px-6 rounded-md py-4 w-2/3 mt-2 text-center mx-auto ">
                  <DialogHeader>
                    <DialogTitle className="p-4 text-center">
                      NFT Mint processing
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-5 w-5 animate-spin me-1 text-muted-foreground" />
                    <DialogDescription className="text-center text-sm">
                      {nftLoadingState}
                    </DialogDescription>
                  </div>
                </DialogContent>
              )}
              {nftData && (
                <DialogContent className="sm:max-w-[425px] px-2 sm:px-6 rounded-md py-4 w-2/3 mt-2 text-center mx-auto">
                  <DialogHeader>
                    <DialogTitle className="p-4 bg-clip-text bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900 to-yellow-300 text-transparent text-center">
                      NFT SUCCESSFULLY CREATED
                    </DialogTitle>
                    <TernoaIcon className="mx-auto text-muted-foreground" />
                  </DialogHeader>
                  <DialogDescription className="pb-6 text-sm space-y-4 mx-3">
                    <span className="">
                      <span className="font-bold me-0.5">Congratulation:</span>
                      {middleEllipsis(nftData.owner, 15)} just created{" "}
                      <span className="font-bold bg-clip-text bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900 to-yellow-300 text-transparent mx-1">
                        NFT id {nftData.nftId}
                      </span>
                      on the Ternoa Blockchain.{" "}
                    </span>

                    <span className="m-0.5">
                      Find the IPFS hash{" "}
                      <a
                        className="font-bold cursor-pointer"
                        href={`https://ipfs-dev.trnnfr.com/ipfs/${nftData.offchainData}`}
                        target="blank"
                      >
                        here.
                      </a>
                    </span>

                    {blockData && (
                      <span className="m-0.5">
                        See your transaction
                        <a
                          className="font-bold cursor-pointer ps-1"
                          href={getExplorerLink(
                            Number(blockData.block?.header.number)
                          )}
                          target="blank"
                        >
                          here.
                        </a>
                      </span>
                    )}
                  </DialogDescription>
                </DialogContent>
              )}
            </Dialog>
          ) : (
            <Connection />
          )}
        </form>
      </Form>
    </>
  );
}
