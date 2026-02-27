const companies = [
  { name: "Google", slug: "google" },
  { name: "Meta", slug: "meta" },
  { name: "Apple", slug: "apple" },
  { name: "Netflix", slug: "netflix" },
  { name: "Spotify", slug: "spotify" },
  { name: "Uber", slug: "uber" },
  { name: "Airbnb", slug: "airbnb" },
  { name: "Stripe", slug: "stripe" },
  { name: "Shopify", slug: "shopify" },
  { name: "Zoom", slug: "zoom" },
  { name: "Figma", slug: "figma" },
  { name: "GitHub", slug: "github" },
  { name: "Tesla", slug: "tesla" },
  { name: "Twitch", slug: "twitch" },
];

const companies2 = [
  { name: "Intel", slug: "intel" },
  { name: "Cisco", slug: "cisco" },
  { name: "SAP", slug: "sap" },
  { name: "Atlassian", slug: "atlassian" },
  { name: "Dropbox", slug: "dropbox" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Notion", slug: "notion" },
  { name: "Pinterest", slug: "pinterest" },
  { name: "Docker", slug: "docker" },
  { name: "Vercel", slug: "vercel" },
  { name: "Reddit", slug: "reddit" },
  { name: "Discord", slug: "discord" },
  { name: "PayPal", slug: "paypal" },
];

const LogoIcon = ({ slug }: { slug: string }) => (
  <img
    src={`https://cdn.simpleicons.org/${slug}/888888`}
    alt={slug}
    className="h-6 w-6 opacity-60 group-hover:opacity-100 transition-opacity"
    loading="lazy"
  />
);

const MarqueeRow = ({
  items,
  reverse = false,
}: {
  items: typeof companies;
  reverse?: boolean;
}) => {
  const doubled = [...items, ...items];
  return (
    <div
      className="flex items-center"
      style={{
        width: `${items.length * 2 * 13}rem`,
        animation: `marquee-scroll ${items.length * 3}s linear infinite${reverse ? " reverse" : ""}`,
      }}
    >
      {doubled.map((company, i) => (
        <div
          key={i}
          className="group flex items-center justify-center gap-3 mx-2 rounded-xl px-6 py-4 text-sm font-medium tracking-wide text-muted-foreground whitespace-nowrap transition-all hover:text-foreground"
          style={{ background: "hsl(var(--secondary))", minWidth: "11rem" }}
        >
          <LogoIcon slug={company.slug} />
          <span>{company.name}</span>
        </div>
      ))}
    </div>
  );
};

const MarqueeSection = () => (
  <section className="relative py-12 overflow-hidden">
    <style>{`
      @keyframes marquee-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
    <div className="text-center mb-8">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Trusted by teams at leading companies
      </p>
    </div>
    <div className="relative">
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
      />
      <div className="overflow-hidden mb-3">
        <MarqueeRow items={companies} />
      </div>
      <div className="overflow-hidden">
        <MarqueeRow items={companies2} reverse />
      </div>
    </div>
  </section>
);

export default MarqueeSection;
