// FooterForm.tsx
"use client"

import { useState } from 'react'

export default function FooterForm({ footer }: { footer: any }) {
  const [email, setEmail] = useState<string | null>('');
  const [message, setMessage] = useState<string | null>('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Subscribed successfully!');
    } else {
      setMessage(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 sm:flex sm:max-w-md">
    <label htmlFor="email-address" className="sr-only">
      Email address
    </label>
    <input
      type="email"
      name="email-address"
      id="email-address"
      autoComplete="email"
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-1.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
      placeholder={footer.subscriptionCTA.placeholderText}
    />
    <div className="mt-4 rounded-md sm:ml-4 sm:mt-0 sm:flex-shrink-0">
      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {footer.subscriptionCTA.button}
      </button>
    </div>
    {message && (
  <p className="mt-2 text-sm text-center text-red-500">{message}</p>
)}
  </form>
  )
}
