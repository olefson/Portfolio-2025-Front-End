export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          Built by{" "}
          <a
            href="https://jasonolefson.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            Jason Olefson
          </a>
        </p>
      </div>
    </footer>
  )
} 