"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="block hover:underline">
            Visão Geral
          </Link>
          <Link href="/admin/users" className="block hover:underline">
            Gerenciar usuários
          </Link>
          <Link href="/admin/reports" className="block hover:underline">
            Relatórios
          </Link>
        </nav>
        <div className="mt-4 text-sm text-muted-foreground">
          {session?.user && (
            <>
              <div>{session.user.email}</div>
              <div className="text-xs">role: {session.user.role}</div>
            </>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-4 py-2 px-3 rounded-md bg-destructive text-destructive-foreground text-sm"
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
