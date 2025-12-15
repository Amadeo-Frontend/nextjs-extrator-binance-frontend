"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="font-bold">Área do Usuário</div>
        <div className="flex items-center gap-4 text-sm">
          {session?.user && (
            <>
              <span>{session.user.email}</span>
              <span className="text-xs text-muted-foreground">
                role: {session.user.role}
              </span>
            </>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="py-1 px-3 rounded-md bg-destructive text-destructive-foreground text-xs"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <footer className="border-t border-border text-xs text-center py-2 text-muted-foreground">
        © {new Date().getFullYear()} Analisador de Dados
      </footer>
    </div>
  );
}
