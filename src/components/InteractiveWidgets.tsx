"use client";

import React, { useState, useEffect } from "react";

export function VancouverTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Vancouver",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
      Vancouver, BC · {time}
    </span>
  );
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored === "dark" || (!stored && prefersDark);

    if (initialDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
        document.body.classList.toggle("dark", e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    document.body.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors font-mono cursor-pointer select-none"
      title="Switch theme"
    >
      {isDark ? "light" : "dark"}
    </button>
  );
}

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4 hover:decoration-neutral-900 dark:hover:decoration-neutral-100 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
      title="Click to copy email"
    >
      {copied ? "Copied ✓" : "Email"}
    </button>
  );
}
