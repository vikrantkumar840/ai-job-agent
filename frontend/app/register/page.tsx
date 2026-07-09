"use client";

import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05060a] text-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <RegisterForm />

        <div className="mt-6 text-center text-white/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
