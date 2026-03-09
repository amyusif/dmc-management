'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MessageSquare, Send, Loader2 } from 'lucide-react'
import { MessageSchema, type MessageInput } from '@/lib/schemas'
import { formatDistanceToNow } from 'date-fns'

type MessageWithSender = {
  id: string
  content: string
  recipientType: string
  recipientRole: string | null
  createdAt: string
  sender: { id: string; name: string; role: string }
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/messages')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setMessages(data)
    } catch {
      setError('Failed to load messages')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const form = useForm<MessageInput>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: '',
      recipientType: 'ALL',
      recipientRole: undefined,
    },
  })

  const onSubmit = async (data: MessageInput) => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Send failed')
      form.setValue('content', '')
      await fetchMessages()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Broadcast and view announcements
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            New message
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="recipientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send to</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue placeholder="Recipients" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">Everyone</SelectItem>
                        <SelectItem value="STAFF">Staff only</SelectItem>
                        <SelectItem value="PATIENTS">Patients</SelectItem>
                        <SelectItem value="SPECIFIC">Specific role</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch('recipientType') === 'SPECIFIC' && (
                <FormField
                  control={form.control}
                  name="recipientRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="DOCTOR">Doctor</SelectItem>
                          <SelectItem value="NURSE">Nurse</SelectItem>
                          <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                          <SelectItem value="STAFF">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send
              </Button>
            </form>
          </Form>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent messages</h2>
          {loading ? (
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground">No messages yet.</p>
          ) : (
            <ul className="space-y-4">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className="border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <p className="text-foreground whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {msg.sender.name} · {msg.recipientType}
                    {msg.recipientRole ? ` (${msg.recipientRole})` : ''} ·{' '}
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
