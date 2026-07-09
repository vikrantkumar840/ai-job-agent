"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login({
        email,
        password,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-5"
    >
      <h1 className="text-3xl font-bold">
        Login
      </h1>

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-lg border border-white/20 bg-transparent p-3"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-lg border border-white/20 bg-transparent p-3"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        disabled={loading}
        className="w-full rounded-lg bg-cyan-500 p-3 font-semibold"
      >
        {loading ? "Signing In..." : "Login"}
      </button>
    </form>
  );
}
