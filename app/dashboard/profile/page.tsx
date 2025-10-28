"use client";
import React from 'react';
import { useUser } from '@/components/UserContext';

export default function ProfilePage() {
  const { user, loading, refresh } = useUser();

  if (loading) return <div className="p-6">Loading profile…</div>;
  if (!user) return <div className="p-6">Not signed in.</div>;

  const initial = (user.name ? user.name.split(/\s+/)[0][0] : (user.email || 'U')[0]).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-[#0d0d0d] border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-neutral-900 grid place-items-center text-white text-2xl font-semibold">{initial}</div>
          <div>
            <h1 className="text-2xl font-bold">{user.name || user.email}</h1>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <div className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name || '-'}</p>
            <p><strong>Email:</strong> {user.email || '-'}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={() => refresh()} className="px-3 py-2 rounded-md border">Refresh</button>
          <button className="px-3 py-2 rounded-md bg-neutral-900 text-white">Edit (stub)</button>
        </div>
      </div>
    </div>
  );
}
