'use client';

import { FormEvent, useState } from 'react';
import { Button, Label, Input, Textarea } from '@/components';

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;

    const formData = {
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      name: (form.elements.namedItem('name') as HTMLInputElement)?.value || '',
      email:
        (form.elements.namedItem('email') as HTMLInputElement)?.value || '',
      message:
        (form.elements.namedItem('message') as HTMLTextAreaElement)?.value ||
        '',
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    setLoading(false);

    if (result.success) {
      form.reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          name="name"
          id="name"
          required
          placeholder="Your name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          name="message"
          id="message"
          required
          rows={4}
          placeholder="Enter your message"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </Button>

      {success && (
        <p className="text-sm text-green-600">Message sent successfully!</p>
      )}
    </form>
  );
}
