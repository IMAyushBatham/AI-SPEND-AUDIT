import AuditForm from '@/components/audit/AuditForm'

export default function AuditPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Audit Your AI Spend</h1>
      <p className="text-muted-foreground mb-8">
        Add your AI tools below to get a full savings report.
      </p>
      <AuditForm />
    </section>
  )
}