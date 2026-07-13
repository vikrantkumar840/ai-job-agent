"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

      router.replace("/workflow");
    } catch (err: any) {
      setError(
        err.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05060a] px-6">

      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-2xl
        p-10
        shadow-2xl
      "
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-white/60 mb-8">
          Sign in to your AI Job Agent account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm text-white/70">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
            <label className="block mb-2 text-sm text-white/70">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
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
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-white/60">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-cyan-400 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
