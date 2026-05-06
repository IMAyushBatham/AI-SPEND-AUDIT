export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} AI Spend Audit</span>
        <span>Built for startups. Save smarter.</span>
      </div>
    </footer>
  )
}