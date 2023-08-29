import SidebarNav from "@/components/base/SidebarNav";
import { Separator } from "@/components/ui/separator";

const sidebarNavItems = [
  {
    title: "Basic NFT",
    href: "/",
  },
  {
    title: "Secret NFT",
    href: "/secret",
  },
];

interface HomeProps {
  children: React.ReactNode;
}

export default function Home({ children }: HomeProps) {
  return (
    <main className="container mx-auto my-10">
      <div className="border rounded-md space-y-6 p-4 md:p-10 md:pb-16">
        <div className="space-y-0.5 text-center sm:text-start">
          <h2 className="text-2xl font-bold mb-4">Ternoa Builder Journey</h2>
          <p className="text-muted-foreground">The adventure starts here.</p>
          <p className="text-muted-foreground">
            Connect your Ternoa account to create Basic & Secret NFTs at a
            glance.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="text-center md:hidden bg-muted px-4 py-10 rounded-md">
          <h3 className="text-2xl font-bold mb-4 ">
            Desktop Application Only{" "}
          </h3>
          <p className="text-muted-foreground">
            Because of the Polakdot extensions is not availble on mobile, this
            application is meant to be used on desktop only. Please open it on
            your desktop to enjoy the full experience.
          </p>
        </div>
        <div className="hidden md:block flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </main>
  );
}
