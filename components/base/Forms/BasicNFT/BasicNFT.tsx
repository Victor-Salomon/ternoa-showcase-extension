"use client";

import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import { File } from "ternoa-js";
import * as z from "zod";

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
import { X } from "lucide-react";

export default function BasicNftForm() {
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
    },
  });

  const handleNFTPreviewChange = async (file: File) => {
    setError(undefined);
    setNftFile(file);
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ ...values, nftFile });
  }

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
            <p className="font-light text-sm py-2">
              Upload or drop a file right here
            </p>
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
      {error && (
        <div className="rounded-md bg-gradient-to-r from-pink-900 via-fuchsia-900 to-red-900 py-4 w-2/3 mt-2 text-center mx-auto">
          <div className="m-4 bg-clip-text bg-gradient-to-r from-red-300 to-pink-600 bg-clip-text text-transparent text-base text-sm">
            {error}
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        ? `Offchain data use be the ${nftFile.name} file IPFS hash`
                        : "Enter the NFT offchain data"
                    }
                    {...field}
                  />
                </FormControl>
                <FormDescription className="font-light">
                  The offchain data is the only required field related to the
                  NFT metadata. It can be an IPFS Hash, an URL or plain text.
                </FormDescription>
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
          <FormField
            control={form.control}
            name="collection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection</FormLabel>
                <FormControl className="font-light">
                  <Input placeholder="Select a collection id" {...field} />
                </FormControl>
                <FormDescription className="font-light">
                  Collection ID represents the collection to which this NFT will
                  belong.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="soulbond"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
