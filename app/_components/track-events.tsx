// app/_components/track-events.tsx
"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function TrackEvents() {
  const { data } = useSession();
  const path = usePathname();

  useEffect(() => {
    if (!data?.user?.email) return;
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/analytics/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: data.user.email, event_type: `page:${path}`, meta: { path } }),
    });
  }, [path, data]);

  return null;
}
