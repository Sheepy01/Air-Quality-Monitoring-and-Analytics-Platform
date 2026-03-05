export function Footer() {
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2024 Air Quality Research Platform - Bihar. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Version {import.meta.env.VITE_APP_VERSION}
        </p>
      </div>
    </footer>
  )
}