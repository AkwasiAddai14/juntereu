"use client";

import React from 'react';

interface ClientLoadingProps {
  lang: string;
}

export default function ClientLoading({ lang }: ClientLoadingProps) {
  return (
    <main className="text-center">
      <h2 className='text-sky-500'>
        Loading...
      </h2>
      <p>
        Please wait while we load your dashboard.
      </p>
    </main>
  );
}
