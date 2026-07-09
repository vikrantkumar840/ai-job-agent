"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        Create Account
      </h1>

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Full Name"
        className="w-full rounded-lg border border-white/20 bg-transparent p-3"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
      />

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
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}
