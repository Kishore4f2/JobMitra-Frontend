import jobmitraLogo from "@/assets/jobmitra-logo.png";
import jobmitraText from "@/assets/jobmitra-text.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={jobmitraLogo} alt="JobMitra logo" className="h-10 w-10 object-contain" />
              <img src={jobmitraText} alt="JobMitra" className="h-10 object-contain" />
            </div>
            <p className="text-sm text-muted-foreground">
              The smart hiring platform for modern talent.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4 text-sm">Platform</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Integrations", "API"].map((l) => (
                <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {["About", "Blog", "Careers", "Contact"].map((l) => (
                <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Security", "Cookies"].map((l) => (
                <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2026 JobMitra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
