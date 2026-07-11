"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
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
      await register({
        full_name: fullName,
        email,
        password,
      });

      router.replace("/dashboard");
    } catch (err: any) {
      setError(
        err?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <h1 className="text-4xl font-bold mb-2">
        Create Account
      </h1>

      <p className="text-white/60 mb-6">
        Join AI Job Agent and automate your job search.
      </p>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Full Name
        </label>

        <input
          type="text"
          required
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          placeholder="John Doe"
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            outline-none
            focus:border-cyan-400
          "
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Email
        </label>

        <input
          type="email"
          required
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="you@example.com"
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            outline-none
            focus:border-cyan-400
          "
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-white/70">
          Password
        </label>

        <input
          type="password"
          required
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="••••••••"
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            outline-none
            focus:border-cyan-400
          "
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-cyan-400
          py-3
          font-semibold
          text-black
          transition
          hover:scale-[1.02]
          disabled:opacity-50
        "
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

      <div className="text-center text-white/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-cyan-400 hover:underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
