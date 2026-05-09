'use client'

import { useEffect } from 'react'
import { useForm, useFieldArray, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import ToolCard from './ToolCard'
import { auditFormSchema, type AuditFormValues } from '@/lib/validators/audit'
import { USE_CASES } from '@/lib/constants/tools'
import { runAudit } from '@/lib/audit/engine'

const STORAGE_KEY = 'ai-spend-audit-form'

const defaultTool = (): AuditFormValues['tools'][0] => ({
  id: crypto.randomUUID(),
  name: '',
  plan: '',
  seats: 1,
  costPerSeat: 0,
  billingCycle: 'monthly',
  useCase: 'general',
})

export default function AuditForm() {
  const router = useRouter()

  const methods = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema) as any,
    defaultValues: {
      teamSize: 1,
      useCase: 'general',
      tools: [defaultTool()],
    },
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tools',
  })

 useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      // Ensure each tool has a unique id
      if (parsed.tools) {
        parsed.tools = parsed.tools.map((t: any) => ({
          ...t,
          id: crypto.randomUUID(),
        }))
      }
      methods.reset(parsed)
    } catch {}
  }
}, [])

  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit: SubmitHandler<AuditFormValues> = async (data) => {
    const result = runAudit(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    localStorage.setItem('ai-spend-audit-result', JSON.stringify(result))
    router.push(`/results/${result.id}`)
  }

  const totalMonthly = watch('tools').reduce((sum, tool) => {
    return sum + (tool.costPerSeat ?? 0) * (tool.seats ?? 0)
  }, 0)

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Team Size</Label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 10"
              {...register('teamSize')}
            />
            {errors.teamSize && (
              <p className="text-xs text-destructive">{errors.teamSize.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Primary Use Case</Label>
            <Select
              onValueChange={(val) =>
                setValue('useCase', val as AuditFormValues['useCase'])
              }
              value={watch('useCase')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc.value} value={uc.value}>
                    {uc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          {fields.map((field, index) => (
            <ToolCard
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        {errors.tools?.root && (
          <p className="text-xs text-destructive">{errors.tools.root.message}</p>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => append(defaultTool())}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Tool
        </Button>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Estimated monthly spend</p>
            <p className="text-2xl font-bold">${totalMonthly.toFixed(2)}</p>
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Analyzing...' : 'Run Audit →'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}