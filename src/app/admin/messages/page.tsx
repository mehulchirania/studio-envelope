"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { deleteMessage, listMessages, setMessageRead } from "@/lib/admin/client";
import type { AdminMessage } from "@/lib/admin/types";

function formatDate(msg: AdminMessage): string {
  if (!msg.createdAt) return "Just now";
  return new Date(msg.createdAt).toLocaleString();
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    try {
      const list = await listMessages();
      setMessages(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages.");
    }
  }

  useEffect(() => {
    let cancelled = false;
    listMessages()
      .then((list) => {
        if (!cancelled) setMessages(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load messages.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleOpen(msg: AdminMessage) {
    const next = openId === msg.id ? null : msg.id;
    setOpenId(next);
    if (next && !msg.read) {
      setBusyId(msg.id);
      try {
        await setMessageRead(msg.id, true);
        setMessages((prev) => prev && prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
      } catch {
        /* non-fatal */
      } finally {
        setBusyId(null);
      }
    }
  }

  async function remove(msg: AdminMessage) {
    if (!window.confirm(`Delete message from "${msg.name}"? This can't be undone.`)) return;
    setBusyId(msg.id);
    try {
      await deleteMessage(msg.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message.");
    } finally {
      setBusyId(null);
    }
  }

  const unreadCount = messages?.filter((m) => !m.read).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light">
          Messages {unreadCount > 0 && <span className="text-sm text-[#5E9AA3]">({unreadCount} unread)</span>}
        </h1>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!messages && !error && (
        <div className="flex items-center gap-2 text-sm text-[#EDE8E0]/50 py-10 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}

      {messages && messages.length === 0 && (
        <p className="text-sm text-[#EDE8E0]/50 py-10 text-center">No messages yet.</p>
      )}

      {messages && messages.length > 0 && (
        <div className="border border-[#EDE8E0]/10 rounded-xl overflow-hidden divide-y divide-[#EDE8E0]/10">
          {messages.map((m) => {
            const isOpen = openId === m.id;
            return (
              <div key={m.id} className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleOpen(m)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  {m.read ? (
                    <MailOpen size={15} className="text-[#EDE8E0]/30 shrink-0" />
                  ) : (
                    <Mail size={15} className="text-[#5E9AA3] shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate ${m.read ? "text-[#EDE8E0]/70" : "text-[#EDE8E0]"}`}>
                      {m.name} <span className="text-[#EDE8E0]/40">— {m.email}</span>
                    </p>
                    {!isOpen && <p className="text-xs text-[#EDE8E0]/40 truncate">{m.message}</p>}
                  </div>
                  <span className="text-xs text-[#EDE8E0]/30 shrink-0">{formatDate(m)}</span>
                </button>

                {isOpen && (
                  <div className="mt-3 ml-[27px] space-y-2 text-sm text-[#EDE8E0]/80">
                    {m.phone && <p>Phone: {m.phone}</p>}
                    {m.projectType && <p>Project type: {m.projectType}</p>}
                    {m.budget && <p>Budget: {m.budget}</p>}
                    <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    <div className="pt-2 flex gap-3">
                      <a
                        href={`mailto:${m.email}`}
                        className="text-xs px-3 py-1.5 rounded-full border border-[#5E9AA3]/50 text-[#5E9AA3] hover:bg-[#5E9AA3]/10 transition-colors"
                      >
                        Reply by email
                      </a>
                      <button
                        type="button"
                        onClick={() => remove(m)}
                        disabled={busyId === m.id}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
