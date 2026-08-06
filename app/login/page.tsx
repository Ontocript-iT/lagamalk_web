"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/services/auth";
import Link from "next/link";
// Turnstile component එක import කිරීම
import { Turnstile } from "@marsidev/react-turnstile";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  // Token එක store කරගැනීමට state එකක්
  const [turnstileToken, setTurnstileToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // User bot කෙනෙක්ද නැත්නම් verification එක සම්පූර්ණ කරලා නැද්ද යන්න පරීක්ෂා කිරීම
    if (!turnstileToken) {
      setError("Please complete the human verification.");
      return;
    }

    setLoading(true);

    try {
      // කලින් වෙනස් කළ loginApi එකට token එකත් පාස් කිරීම
      await loginApi(identifier, password, turnstileToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      // Error එකක් ආවොත්, ඊළඟ උත්සාහය සඳහා අලුත් token එකක් ගන්න අවශ්‍ය නිසා පරණ එක මකා දමමු.
      // (මෙය Turnstile widget එක reset කිරීමටද උදව් වේ)
      setTurnstileToken(""); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-orange-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Admin Portal</h2>
          <p className="text-gray-500">Sign in to manage Lagama LK</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-black"
              required
            />
          </div>

          {/* Cloudflare Turnstile Human Verification Widget */}
          <div className="flex justify-center my-4">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
              onSuccess={(token) => setTurnstileToken(token)}
              options={{
                theme: "light", // ඔබගේ UI එකට ගැළපෙන ලෙස ආලෝකමත් තේමාවක්
                size: "normal", // "compact" ලෙසද වෙනස් කළ හැක
              }}
            />
          </div>

          <button
            type="submit"
            // Loading අවස්ථාවේදී හෝ Token එක තවම ලැබී නැත්නම් Button එක Disable කිරීම
            disabled={loading || !turnstileToken}
            className="w-full bg-black text-orange-500 p-3 rounded font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/" className="text-orange-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}