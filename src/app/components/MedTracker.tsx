"use client";

import { useState, useEffect, useCallback } from "react";
import { format, isToday, isYesterday, startOfDay } from "date-fns";

type MedType = "morning" | "evening";

interface MedEntry {
  id: string;
  type: MedType;
  timestamp: string;
}

const STORAGE_KEY = "sabai-meds";

function loadEntries(): MedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: MedEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function groupByDate(entries: MedEntry[]): Map<string, MedEntry[]> {
  const groups = new Map<string, MedEntry[]>();
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  for (const entry of sorted) {
    const dateKey = startOfDay(new Date(entry.timestamp)).toISOString();
    const group = groups.get(dateKey) || [];
    group.push(entry);
    groups.set(dateKey, group);
  }
  return groups;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d, yyyy");
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CatIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
      <path
        d="M10 48c0-14 6-26 22-26s22 12 22 26"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 30 L8 10 L22 20"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        opacity="0.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 30 L56 10 L42 20"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        opacity="0.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="36" r="2.5" fill="currentColor" />
      <circle cx="40" cy="36" r="2.5" fill="currentColor" />
      <ellipse cx="32" cy="42" rx="2" ry="1.5" fill="currentColor" />
      <path
        d="M30 44 Q32 47 34 44"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 38 L6 36 M14 42 L6 42 M50 38 L58 36 M50 42 L58 42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MedTracker() {
  const [entries, setEntries] = useState<MedEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadEntries());
    setMounted(true);
  }, []);

  const todayEntries = entries.filter((e) => isToday(new Date(e.timestamp)));
  const hasMorning = todayEntries.some((e) => e.type === "morning");
  const hasEvening = todayEntries.some((e) => e.type === "evening");

  const recordMed = useCallback(
    (type: MedType) => {
      const entry: MedEntry = {
        id: crypto.randomUUID(),
        type,
        timestamp: new Date().toISOString(),
      };
      const updated = [entry, ...entries];
      setEntries(updated);
      saveEntries(updated);
    },
    [entries]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      saveEntries(updated);
      setConfirmDelete(null);
    },
    [entries]
  );

  const grouped = groupByDate(entries);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center mb-3 text-accent">
            <CatIcon />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sabai Meds</h1>
          <p className="text-muted text-sm mt-1">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
        </header>

        {/* Today's Status */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
            Today&apos;s Status
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`rounded-xl p-4 text-center transition-all ${
                hasMorning
                  ? "bg-morning-light border-2 border-morning/30"
                  : "bg-background border-2 border-border"
              }`}
            >
              <SunIcon className="w-6 h-6 mx-auto mb-2 text-morning" />
              <div className="text-sm font-medium">Morning</div>
              {hasMorning ? (
                <div className="animate-check-pop mt-1">
                  <CheckIcon className="w-5 h-5 mx-auto text-success" />
                </div>
              ) : (
                <div className="text-xs text-muted mt-1">Pending</div>
              )}
            </div>
            <div
              className={`rounded-xl p-4 text-center transition-all ${
                hasEvening
                  ? "bg-evening-light border-2 border-evening/30"
                  : "bg-background border-2 border-border"
              }`}
            >
              <MoonIcon className="w-6 h-6 mx-auto mb-2 text-evening" />
              <div className="text-sm font-medium">Evening</div>
              {hasEvening ? (
                <div className="animate-check-pop mt-1">
                  <CheckIcon className="w-5 h-5 mx-auto text-success" />
                </div>
              ) : (
                <div className="text-xs text-muted mt-1">Pending</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => recordMed("morning")}
            className="flex items-center justify-center gap-2 bg-morning text-white font-semibold py-4 px-4 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <SunIcon className="w-5 h-5" />
            <span>Morning</span>
          </button>
          <button
            onClick={() => recordMed("evening")}
            className="flex items-center justify-center gap-2 bg-evening text-white font-semibold py-4 px-4 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <MoonIcon className="w-5 h-5" />
            <span>Evening</span>
          </button>
        </div>

        {/* Log */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
            History
          </h2>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <p className="text-sm">No medications recorded yet.</p>
              <p className="text-xs mt-1">
                Tap a button above to record Sabai&apos;s first dose.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from(grouped.entries()).map(([dateKey, dayEntries]) => (
                <div key={dateKey} className="animate-fade-in">
                  <h3 className="text-sm font-medium text-muted mb-2">
                    {formatDateLabel(dateKey)}
                  </h3>
                  <div className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border overflow-hidden">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            entry.type === "morning"
                              ? "bg-morning-light"
                              : "bg-evening-light"
                          }`}
                        >
                          {entry.type === "morning" ? (
                            <SunIcon className="w-4 h-4 text-morning" />
                          ) : (
                            <MoonIcon className="w-4 h-4 text-evening" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium capitalize">
                            {entry.type} pills
                          </div>
                          <div className="text-xs text-muted">
                            {format(new Date(entry.timestamp), "h:mm a")}
                          </div>
                        </div>
                        {confirmDelete === entry.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-xs text-red-500 font-medium px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs text-muted px-2 py-1 rounded-lg hover:bg-background transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(entry.id)}
                            className="p-2 text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-background cursor-pointer"
                            aria-label="Delete entry"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
