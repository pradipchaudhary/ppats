"use client";
import { useState } from "react";

export default function Page() {
  const [address, setAddress] = useState("");
  const [mails, setMails] = useState<any[]>([]);

  const createMailbox = async () => {
    const res = await fetch("/api/proxy/create-mailbox"); // proxy to your server or call server directly
    const data = await res.json();
    setAddress(data.address);
    setMails([]);
  };

  const fetchMails = async () => {
    if (!address) return;
    const res = await fetch(`/api/proxy/mailbox/${encodeURIComponent(address)}/mails`);
    const data = await res.json();
    setMails(data);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold">Disposable Email (Test)</h1>
      <div className="mt-4 space-x-2">
        <button onClick={createMailbox} className="px-4 py-2 bg-blue-600 text-white rounded">Create Mailbox</button>
        <button onClick={fetchMails} className="px-4 py-2 bg-gray-300 rounded">Refresh</button>
      </div>

      {address && <div className="mt-4">Mailbox: <strong>{address}</strong></div>}

      <ul className="mt-4 space-y-4">
        {mails.map((m) => (
          <li key={m._id} className="p-3 border rounded">
            <div className="text-sm text-gray-500">{m.from} → {m.to}</div>
            <div className="font-semibold">{m.subject}</div>
            <div className="mt-2 text-sm whitespace-pre-wrap">{m.bodyText || m.bodyHtml}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
