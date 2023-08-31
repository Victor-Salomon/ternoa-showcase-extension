"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormSchemaType, formSchema } from "./zod";
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

export default function BasicNftForm() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offchainData: "",
      royalty: "0",
      collection: undefined,
      soulbond: false,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="offchainData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offchain Data</FormLabel>
              <FormControl className="font-light">
                <Input placeholder="Enter the NFT offchain data" {...field} />
              </FormControl>
              <FormDescription className="font-light">
                The offchain data is the only required field related to the NFT
                metadata. It can be an IPFS Hash, an URL or plain text.
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
                <FormDescription className="font-light">
                  Soulbound NFT are designed to be transferred only once and are
                  permanently tied to a user’s wallet address
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
  );
}
