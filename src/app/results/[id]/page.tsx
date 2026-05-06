interface Props {
  params: { id: string }
}

export default function ResultsPage({ params }: Props) {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Your Audit Results</h1>
      <p className="text-muted-foreground mb-8">
        Audit ID: <span className="font-mono text-sm">{params.id}</span>
      </p>
      {/* Day 3: Results components go here */}
      <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
        Results view coming Day 3
      </div>
    </section>
  )
}