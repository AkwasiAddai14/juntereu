"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/[lang]/components/ui/dialog'
import { Input } from '@/app/[lang]/components/ui/input'
import { Label } from '@/app/[lang]/components/ui/label'

interface GetAccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function GetAccessModal({ open, onOpenChange }: GetAccessModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/get-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form')
      }

      // Reset form and close modal
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
      })
      onOpenChange(false)
      
      // Show success message
      alert('Thank you! We will contact you soon.')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-600">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <DialogHeader className="mt-3 text-center sm:mt-5 sm:text-left">
          <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
            Get Access
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            Fill in your details and we'll get in touch with you shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="companyName" className="block text-sm font-medium text-gray-900">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Acme Inc."
                value={formData.companyName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@acme.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
          </div>
          <DialogFooter className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

