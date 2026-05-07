'use client'

import { useFormContext } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AI_TOOLS, USE_CASES } from '@/lib/constants/tools'
import type { AuditFormValues } from '@/lib/validators/audit'

interface ToolCardProps {
  index: number
  onRemove: () => void
}

export default function ToolCard({ index, onRemove }: ToolCardProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AuditFormValues>()

  const selectedToolId = watch(`tools.${index}.name`)
  const selectedTool = AI_TOOLS.find((t) => t.id === selectedToolId)

  const toolErrors = errors.tools?.[index]

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Tool {index + 1}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tool Name */}
        <div className="space-y-1">
          <Label>AI Tool</Label>
          <Select
            onValueChange={(val) => {
              const tool = AI_TOOLS.find((t) => t.id === val)
              setValue(`tools.${index}.name`, val)
              setValue(`tools.${index}.plan`, '')
              setValue(`tools.${index}.costPerSeat`, tool?.plans[0]?.pricePerSeat ?? 0)
            }}
            value={selectedToolId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tool" />
            </SelectTrigger>
            <SelectContent>
              {AI_TOOLS.map((tool) => (
                <SelectItem key={tool.id} value={tool.id}>
                  {tool.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {toolErrors?.name && (
            <p className="text-xs text-destructive">{toolErrors.name.message}</p>
          )}
        </div>

        {/* Plan */}
        <div className="space-y-1">
          <Label>Plan</Label>
          <Select
            onValueChange={(val) => {
              const plan = selectedTool?.plans.find((p) => p.label === val)
              setValue(`tools.${index}.plan`, val)
              if (plan) setValue(`tools.${index}.costPerSeat`, plan.pricePerSeat)
            }}
            value={watch(`tools.${index}.plan`)}
            disabled={!selectedTool}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              {selectedTool?.plans.map((plan) => (
                <SelectItem key={plan.label} value={plan.label}>
                  {plan.label} — ${plan.pricePerSeat}/seat
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {toolErrors?.plan && (
            <p className="text-xs text-destructive">{toolErrors.plan.message}</p>
          )}
        </div>

        {/* Seats */}
        <div className="space-y-1">
          <Label>Seats</Label>
          <Input
            type="number"
            min={1}
            placeholder="e.g. 5"
            {...register(`tools.${index}.seats`)}
          />
          {toolErrors?.seats && (
            <p className="text-xs text-destructive">{toolErrors.seats.message}</p>
          )}
        </div>

        {/* Cost Per Seat */}
        <div className="space-y-1">
          <Label>Monthly Cost/Seat ($)</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            placeholder="e.g. 20"
            {...register(`tools.${index}.costPerSeat`)}
          />
          {toolErrors?.costPerSeat && (
            <p className="text-xs text-destructive">{toolErrors.costPerSeat.message}</p>
          )}
        </div>

        {/* Billing Cycle */}
        <div className="space-y-1">
          <Label>Billing Cycle</Label>
          <Select
            onValueChange={(val) =>
              setValue(`tools.${index}.billingCycle`, val as 'monthly' | 'annual')
            }
            value={watch(`tools.${index}.billingCycle`)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Use Case */}
        <div className="space-y-1">
          <Label>Use Case</Label>
          <Select
            onValueChange={(val) =>
              setValue(`tools.${index}.useCase`, val as AuditFormValues['tools'][0]['useCase'])
            }
            value={watch(`tools.${index}.useCase`)}
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
      </CardContent>
    </Card>
  )
}