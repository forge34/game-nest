import { Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background  max-h-fit">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row justify-between items-start gap-8 text-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-bold">GameNest</h2>
          <p className="text-muted-foreground max-w-xs">
            Your ultimate video game collection and discovery platform.
          </p>
          <p className="text-xs text-muted-foreground">Powered by IGDB</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-muted-foreground font-semibold uppercase tracking-wide text-xs">
            Connect
          </h4>
          <div className="flex flex-row gap-3">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/forge34"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="mailto:mohamedabdeltawab338@gmail.com"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border text-center py-4 text-muted-foreground text-xs">
        &copy; {new Date().getFullYear()} GameNest . All rights reserved.
      </div>
    </footer>
  );
}
