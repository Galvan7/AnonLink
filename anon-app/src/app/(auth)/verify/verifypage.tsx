"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";

import { verifyCodeSchema, type VerifyCodeSchema } from "@/schemas/verifySchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [loading, setLoading] = useState(false);
  const form = useForm<VerifyCodeSchema>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { verifyCode: "" },
  });
  if (!token) {
    return <div>Invalid Verification Link</div>;
  }

  const onSubmit = async (values: VerifyCodeSchema) => {
    setLoading(true);
    toast.info("Verifying...");

    try {
      const { data } = await axios.post("/api/verify-otp", {
        token,
        code: values.verifyCode,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Verified successfully!");
      router.push("/sign-in");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border"
      >
        <h1 className="text-2xl font-semibold text-center mb-2">
          Verify Your Email
        </h1>
        <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Enter the 6-digit verification code.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Verification Code</Label>
            <div className="relative">
              <Input {...form.register("verifyCode")} maxLength={6} placeholder="123456" />
              {loading && (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin absolute right-3 top-2.5" />
              )}
            </div>
          </div>

          <Button className="w-full bg-black text-white" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <p className="text-sm text-center mt-5">
          Didn’t get a code?{" "}
          <Link href="/sign-up" className="text-blue-600">Re-register</Link>
        </p>
      </motion.div>
    </div>
  );
}
