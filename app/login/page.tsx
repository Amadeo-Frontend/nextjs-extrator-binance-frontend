"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/dashboard");
    } else {
      alert("Login inválido");
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="w-96 space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-black text-white p-2">Entrar</button>
      </div>
    </form>
  );
}
