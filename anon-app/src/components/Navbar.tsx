"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/Modetoggle"; // optional theme toggle
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full border-b bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md sticky top-0 z-50"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <div
          className="text-xl font-semibold cursor-pointer select-none"
          onClick={() => router.push("/dashboard")}
        >
          Anon<span className="text-blue-600">Link</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme toggle (optional) */}
          <ModeToggle />

          {user && (
            <div className="flex items-center gap-3">
              {/* Username Avatar */}
              <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium">
                {user.userName?.slice(0, 2).toUpperCase()}
              </div>

              {/* Sign Out */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
