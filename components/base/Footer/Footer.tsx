import TernoaIcon from "@/assets/providers/Ternoa";
import Discord from "@/assets/socials/Discord";
import Twitter from "@/assets/socials/Twitter";
import Telegram from "@/assets/socials/Telegram";

const Footer = () => {
  const year = new Date().getFullYear();
  const socialNetworks = [
    {
      alt: "Ternoa discord",
      url: "https://discord.gg/cNZTGtGJNR",
      icon: <Discord className="h-5 w-5" />,
    },
    {
      alt: "Ternoa twitter",
      url: "https://twitter.com/Ternoa_",
      icon: <Twitter className="h-5 w-5" />,
    },
    {
      alt: "Ternoa telegram",
      url: "https://t.me/ternoa",
      icon: <Telegram className="h-5 w-5" />,
    },
    {
      alt: "Ternoa.com",
      url: "https://ternoa.com",
      icon: <TernoaIcon className="h-5 w-5" />,
    },
  ];
  return (
    <div className="container flex flex-col md:flex-row md:justify-between items-center mb-5 text-muted-foreground space-y-2 md:space-y-0 pb-5">
      <div className="flex justify-between items-center space-x-2">
        {socialNetworks.map((network, index) => (
          <a key={index} href={network.url} target="_blank" rel="noopener">
            {network.icon}
          </a>
        ))}
      </div>
      <div className="font-light text-sm flex flex-col text-center md:flex-row items-center space-y-2 md:space-y-0">
        <span>© {year} Powered by Ternoa</span>
        <span className="hidden md:block mx-1"> • </span>
        <span>All rights reserved</span>
      </div>
    </div>
  );
};

export default Footer;
