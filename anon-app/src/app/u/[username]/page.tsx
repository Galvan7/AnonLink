"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

export default function PublicMessagePage() {
  const { username } = useParams() as { username: string };
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/send-message", {
        username,
        content: message,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success("Message sent anonymously ✔️");
      setMessage("");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-900">
      <Card className="w-full max-w-xl p-6 border-neutral-200 dark:border-neutral-800 shadow-md bg-white dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Message @{username}
          </CardTitle>
          <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
            Your identity is never collected. Messages are fully anonymous.
          </p>
        </CardHeader>

        <CardContent className="space-y-4 mt-4">
          <Textarea
            placeholder="Write something anonymously..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[140px] resize-none"
          />

          <Button
            onClick={sendMessage}
            className="w-full bg-black text-white hover:bg-neutral-800"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Anonymous Message
              </div>
            )}
          </Button>

          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center mt-3">
            This message cannot be traced back to you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
