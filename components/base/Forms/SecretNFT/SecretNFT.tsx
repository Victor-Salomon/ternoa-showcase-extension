"use client";

import TernoaIcon from "@/assets/providers/Ternoa";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import { FormSchemaType, formSchema } from "./zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Connection from "../../Modals/Connection";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/walletContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TernoaIPFS, isApiConnected } from "ternoa-js";
import { IPFS_API_KEY, IPFS_URL } from "@/lib/constants";
import { initNetwork, mintSecretNFT } from "@/lib/ternoa";
import { getPolkadotSigner } from "@/lib/polkadot";
import { SecretNFTResponse } from "./types";
import { middleEllipsis } from "@/lib/utils";
import { useNetworkContext } from "@/contexts/networkContext";

export default function SecretNftForm() {
  const { userWallet } = useWalletContext();
  const { wss } = useNetworkContext();
  const [nftFile, setNftFile] = useState<File | undefined>(undefined);
  const [secretNftFile, setSecretNftFile] = useState<File | undefined>(
    undefined
  );
  const [isForm, setIsForm] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string | undefined>(
    undefined
  );
  const [nftData, setNftData] = useState<SecretNFTResponse | undefined>(
    undefined
  );
  const fileTypes = ["JPG", "JPEG", "PNG", "jpg", "jpeg", "png"];

  const cleanStates = () => {
    setIsLoading(false);
    setLoadingStatus(undefined);
    setNftFile(undefined);
    setSecretNftFile(undefined);
  };

  const handleNFTPreviewChange = async (file: File) => {
    setError(undefined);
    setNftFile(file);
  };

  const handleSecretFileChange = async (file: File) => {
    setError(undefined);
    setSecretNftFile(file);
  };

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royalty: "",
      collection: "",
      soulbond: false,
      metadataTitle: "",
      metadataDescription: "",
      secretMetadataTitle: "",
      secretMetadataDescription: "",
    },
  });

  const handleSecretNftForm = async (values: FormSchemaType) => {
    setError(undefined);
    if (!nftFile || !secretNftFile) {
      cleanStates();
      setError("OFFCHAIN_META_DATA_ERROR: File missing. Please upload a file.");
      return;
    }

    if (
      !values.metadataTitle ||
      !values.metadataDescription ||
      !values.secretMetadataTitle ||
      !values.secretMetadataDescription
    ) {
      cleanStates();
      setError("OFFCHAIN_META_DATA_MISSING");
      return;
    }
    const ipfsClient = new TernoaIPFS(new URL(IPFS_URL), IPFS_API_KEY);
    const nftMetadata = {
      title: values.metadataTitle,
      description: values.metadataDescription,
    };
    const secretNftMetadata = {
      title: values.secretMetadataTitle,
      description: values.secretMetadataDescription,
    };
    const formatedroyalty = values.royalty ? Number(values.royalty) : 0;
    const formatedCollection = values.collection
      ? Number(values.collection)
      : undefined;

    const signer = await getPolkadotSigner(userWallet.address);
    if (!signer) throw new Error("SIGNER_UNDEFINED");

    if (!isApiConnected()) {
      console.log("Ternoa API new initialization");
      await initNetwork(wss)
    }
    try {
      setIsLoading(true);
      const data = await mintSecretNFT(
        userWallet.address,
        nftFile,
        nftMetadata,
        secretNftFile,
        secretNftMetadata,
        ipfsClient,
        formatedroyalty,
        formatedCollection,
        values.soulbond,
        signer,
        setLoadingStatus
      );
      console.log(data)
      setNftData(data);
      setIsLoading(false);
      return;
    } catch (error) {
      const errorDesc = `${
        error instanceof Error ? error.message : JSON.stringify(error)
      }`;
      console.log(errorDesc);
      setError(errorDesc);
      setIsLoading(false);
      return;
    } finally {
      cleanStates();
      form.reset();
    }
  };

  useEffect(() => setIsForm(true), []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSecretNftForm)}
          className="space-y-8"
        >
          {!isForm ? (
            <div className="flex flex-col items-center space-y-3 my-16">
              <TernoaIcon className="animate-bounce text-muted h-30 w-30" />
              <Skeleton className="h-6 w-1/3 bg-muted" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* BASIC NFT SECTION */}
              <div className="border rounded-lg p-4">
                <div>
                  <div className="w-4/6 mx-auto border rounded-lg">
                    <FileUploader
                      handleChange={handleNFTPreviewChange}
                      name="file"
                      type={fileTypes}
                      onTypeError={(err: Error) => console.log(err)}
                      onSizeError={(err: Error) => console.log(err)}
                    >
                      <div className="flex flex-col items-center rounded-lg p-8 mx-auto bg-white cursor-pointer">
                        <TernoaIcon />
                        {nftFile ? (
                          <p className="text-center font-light text-sm py-2 text-muted-foreground">
                            Upload a new file here.
                          </p>
                        ) : (
                          <p className="text-center font-light text-sm py-2">
                            Upload your NFT content
                          </p>
                        )}
                      </div>
                    </FileUploader>
                  </div>
                  {nftFile && (
                    <p className="flex items-center justify-center from-purple-500 via-pink-500 to-blue-500 bg-gradient-to-r bg-clip-text text-transparent font-light text-sm">
                      <span className="text-primary me-1">File name: </span>
                      {nftFile.name}
                      <X
                        onClick={() => {
                          setNftFile(undefined); //, form.reset();
                        }}
                        className="h-3 w-3 text-black cursor-pointer ms-0.5 mt-0.5"
                      />
                    </p>
                  )}
                </div>
                <div className="py-2 space-y-2">
                  <FormField
                    control={form.control}
                    name="metadataTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          NFT Metadata Title{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl className="font-light">
                          <Input
                            placeholder="Add a title to your NFT"
                            {...field}
                          />
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
                        <FormLabel>
                          NFT Metadata Description{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
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
                </div>
              </div>

              {/* SECRET NFT SECTION */}
              <div className="border rounded-lg p-4">
                <div>
                  <div className="w-4/6 mx-auto border rounded-lg">
                    <FileUploader
                      handleChange={handleSecretFileChange}
                      name="file"
                      type={fileTypes}
                      onTypeError={(err: Error) => console.log(err)}
                      onSizeError={(err: Error) => console.log(err)}
                    >
                      <div className="flex flex-col items-center rounded-lg p-8 mx-auto bg-white cursor-pointer">
                        <TernoaIcon />
                        {secretNftFile ? (
                          <p className="text-center font-light text-sm py-2 text-muted-foreground">
                            Upload a new SECRET file here.
                          </p>
                        ) : (
                          <p className="text-center font-light text-sm py-2">
                            Upload your SECRET content
                          </p>
                        )}
                      </div>
                    </FileUploader>
                  </div>
                  {secretNftFile && (
                    <p className="flex items-center justify-center from-purple-500 via-pink-500 to-blue-500 bg-gradient-to-r bg-clip-text text-transparent font-light text-sm">
                      <span className="text-primary me-1">
                        Secret File name:{" "}
                      </span>
                      {secretNftFile.name}
                      <X
                        onClick={() => {
                          setSecretNftFile(undefined); //, form.reset();
                        }}
                        className="h-3 w-3 text-black cursor-pointer ms-0.5 mt-0.5"
                      />
                    </p>
                  )}
                </div>
                <div className="py-2 space-y-2">
                  <FormField
                    control={form.control}
                    name="secretMetadataTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Secret content Metadata Title{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl className="font-light">
                          <Input
                            placeholder="Add a title to your secret content"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secretMetadataDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Secret content Metadata Description{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl className="font-light">
                          <Textarea
                            placeholder="Add a description to your secret content"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BASIC FORM SECTION */}
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
                <Button
                  variant={"outline"}
                  type="submit"
                  disabled={!nftFile || !secretNftFile}
                >
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
              {isLoading && (
                <DialogContent className="sm:max-w-[425px] px-2 sm:px-6 rounded-md py-4 w-2/3 mt-2 text-center mx-auto ">
                  <DialogHeader>
                    <DialogTitle className="p-4 text-center">
                      NFT Mint processing
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4 mb-4">
                    <Loader2 className="h-5 w-5 animate-spin me-1 text-muted-foreground" />
                    <DialogDescription className="text-center text-sm">
                      {loadingStatus}
                    </DialogDescription>
                  </div>
                </DialogContent>
              )}

              {nftData && (
                <DialogContent className="sm:max-w-[425px] px-2 sm:px-6 rounded-md py-4 w-2/3 mt-2 text-center mx-auto">
                  <DialogHeader>
                    <DialogTitle className="p-4 text-center">
                      SECRET NFT CREATED
                    </DialogTitle>
                    <TernoaIcon className="mx-auto text-muted-foreground" />
                  </DialogHeader>
                  <div className="pb-6 text-sm space-y-4 mx-3">
                    <div className="">
                      <div className="font-bold me-0.5 text-black my-1">
                        Congratulation
                      </div>
                      NFT id
                      <span className="font-bold bg-clip-text bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900 to-yellow-300 text-transparent mx-0.5">
                        {nftData.event.nftId}
                      </span>{" "}
                      successfully created by{" "}
                      <span className="italic">
                        {middleEllipsis(userWallet.address, 15)}
                      </span>{" "}
                      on the Ternoa blockchain.
                    </div>

                    <div className="m-0.5">
                      Find the IPFS hash{" "}
                      <a
                        className="font-bold cursor-pointer"
                        href={`https://ipfs-dev.trnnfr.com/ipfs/${nftData.event.offchainData}`}
                        target="blank"
                      >
                        here.
                      </a>
                    </div>
                  </div>
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
