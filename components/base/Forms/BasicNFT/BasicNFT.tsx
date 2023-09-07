"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import {
  File,
  TernoaIPFS,
  WaitUntil,
  createNft,
  getKeyringFromSeed,
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
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export default function BasicNftForm() {
  const { userWallet } = useWalletContext();
  const { toast } = useToast();
  const [nftFile, setNftFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const fileTypes = ["JPG", "JPEG", "PNG", "jpg", "jpeg", "png"];
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offchainData: "",
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

  const triggerToast = (
    title: string,
    description: string,
    className: string,
    actionClassName?: string,
    actionOnClick?: void,
    actionText?: string
  ) => {
    toast({
      className,
      title,
      description,
      action: actionText ? (
        <ToastAction
          altText={actionText ? actionText : "ToastAction"}
          onClick={() => actionOnClick}
          className={actionClassName}
        >
          {actionText}
        </ToastAction>
      ) : (
        <div></div>
      ),
    });
  };

  const handleNftForm = async (values: FormSchemaType) => {
    if (!values.offchainData && !nftFile) {
      setError(
        "OFFCHAIN_META_DATA_ERROR: File or offchain missing. Please upload a file or add an offchain data in the area."
      );
      triggerToast(
        "OFFCHAIN_META_DATA_ERROR",
        "File or offchain missing. Please upload a file or add an offchain data in the area.",
        "bg-gradient-to-r from-pink-900 via-fuchsia-900 to-red-900 text-white",
        "bg-gradient-to-r from-red-300 to-pink-600 bg-clip-text text-transparent text-base text-sm",
        setError(undefined),
        "Try again"
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

    const keyring = await getKeyringFromSeed(
      "broccoli tornado verb crane mandate wise gap shop mad quarter jar snake"
    );

    if (nftFile) {
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
        const nftEvent = await createNft(
          Hash,
          formatedroyalty,
          formatedCollection,
          values.soulbond,
          keyring,
          WaitUntil.BlockInclusion
        );
        console.log(nftEvent);
        return nftEvent;
      } catch (error) {
        console.log(error);
      }
    }
    if (!values.offchainData) {
      setError("OFFCHAIN_META_DATA_ERROR: Missing offchain data from form.");
      return;
    }
    const { offchainData, soulbond } = values;
    try {
      const nftEvent = await createNft(
        offchainData,
        formatedroyalty,
        formatedCollection,
        soulbond,
        keyring,
        WaitUntil.BlockInclusion
      );
      console.log(nftEvent);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
              <p className="font-light text-sm py-2">Upload a new file here.</p>
            ) : (
              <p className="font-light text-sm py-2">
                Upload or drop a file right here
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
            onClick={() => setNftFile(undefined)}
            className="h-3 w-3 text-black cursor-pointer ms-0.5 mt-0.5"
          />
        </p>
      )}
      {/* {error && (
        <div className="rounded-md bg-gradient-to-r from-pink-900 via-fuchsia-900 to-red-900 py-4 w-2/3 mt-2 text-center mx-auto">
          <div className="m-4 bg-clip-text bg-gradient-to-r from-red-300 to-pink-600 bg-clip-text text-transparent text-base text-sm">
            {error}
          </div>
        </div>
      )} */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNftForm)} className="space-y-8">
          {nftFile && (
            <>
              <FormField
                control={form.control}
                name="metadataTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NFT Metadata Title</FormLabel>
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
                    <FormLabel>NFT Metadata Description</FormLabel>
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
            name="offchainData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offchain Data</FormLabel>
                <FormControl className="font-light">
                  <Input
                    disabled={nftFile ? true : false}
                    placeholder={
                      nftFile
                        ? `Offchain data use the ${nftFile.name} file.`
                        : "Enter the NFT offchain data"
                    }
                    {...field}
                  />
                </FormControl>
                {!nftFile ? (
                  <FormDescription className="font-light">
                    The offchain data is the only required field related to the
                    NFT metadata. Enter manually the offchain data you want or
                    upload a file.
                  </FormDescription>
                ) : (
                  <FormDescription className="font-light">
                    The offchain data is the only required field related to the
                    NFT metadata. We will upload your file on IPFS and use the
                    file hash as the NFT offchain metadata.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="royalty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Royalty</FormLabel>
                <FormControl className="font-light">
                  <Input placeholder="Set your royalty" {...field} />
                </FormControl>
                <FormDescription className="font-light">
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
                    <FormDescription className="font-light">
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
                  <FormDescription className="font-light">
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
                  <FormLabel className="text-base text-sm font-medium ">
                    Is it a soulbond NFT?
                  </FormLabel>
                  <FormDescription className="font-light w-9/12">
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
            <Button type="submit">Submit</Button>
          ) : (
            <Connection />
          )}
        </form>
      </Form>
    </>
  );
}
