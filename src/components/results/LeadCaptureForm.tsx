'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { leadSchema, type LeadValues } from '@/lib/validators/lead'
import type { AuditInput, AuditResult } from '@/types'

interface Props {
  input: AuditInput
  result: AuditResult
  open: boolean
  onClose: () => void
  onSuccess: (shareUrl: string) => void
}

export default function LeadCaptureForm({
  input,
  result,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadValues>({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: { honeypot: '' },
  })

  const onSubmit = async (data: LeadValues) => {
    setServerError('')
    try {
      const res = await fetch('/api/audit/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, result, lead: data }),
      })

      const json = await res.json()

      if (!res.ok) {
        setServerError(json.error ?? 'Something went wrong')
        return
      }

      onSuccess(json.shareUrl)
    } catch {
      setServerError('Network error. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Your Shareable Report</DialogTitle>
          <DialogDescription>
            Enter your details to save this audit and get a permanent shareable link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Honeypot - hidden from real users */}
          <input
            type="text"
            {...register('honeypot')}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="space-y-1">
            <Label>Work Email</Label>
            <Input
              type="email"
              placeholder="you@company.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Company Name</Label>
            <Input
              placeholder="Acme Inc."
              {...register('companyName')}
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Your Role</Label>
            <Input
              placeholder="CTO, Head of Engineering..."
              {...register('role')}
            />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-destructive">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save & Get Share Link →'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            No spam. We'll only send you relevant product updates.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}