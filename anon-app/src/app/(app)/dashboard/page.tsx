"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Loader2, Trash2, LinkIcon } from "lucide-react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // hooks MUST run unconditionally
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [accepting, setAccepting] = useState<boolean>(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const username = session?.user?.userName;

  // ---------- LOAD DATA ONLY WHEN AUTH IS READY ----------
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    if (status === "authenticated") {
      loadMessages();
      loadAcceptingStatus();
    }
  }, [status]); // run only when auth state changes

  async function loadMessages() {
    try {
      const res = await axios.get("/api/get-messages");
      setMessages(res.data.messages);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  }

  async function loadAcceptingStatus() {
    try {
      const res = await axios.get("/api/accept-message");
      setAccepting(res.data.isAcceptingMsg);
    } catch {
      toast.error("Failed to load message settings");
    }
  }

  async function handleToggle(value: boolean) {
    setToggleLoading(true);

    try {
      const res = await axios.post("/api/accept-message", {
        acceptMessages: value,
      });

      setAccepting(res.data.user.isAcceptingMsg);
      toast.success(res.data.message);
    } catch {
      toast.error("Unable to update settings");
    } finally {
      setToggleLoading(false);
    }
  }

  async function deleteMessage(id: string) {
    try {
      console.log("Deleted id is ", id)
      await axios.delete(`/api/delete-message/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  }

  const publicLink = `${process.env.NEXT_PUBLIC_APP_URL}/u/${username}`;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-2">
          Welcome, <span className="text-blue-600">{username}</span>
        </h1>

        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Your anonymous inbox and settings.
        </p>

        {/* PUBLIC LINK */}
        <Card className="mb-8 dark:border-neutral-800 shadow-sm">
          <CardHeader>
            <CardTitle>Your Public Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 w-full break-all">
                <LinkIcon className="h-4 w-4 text-neutral-500 shrink-0" />
                <span className="font-mono text-sm break-all">{publicLink}</span>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  navigator.clipboard.writeText(publicLink);
                  toast.success("Link copied!");
                }}
              >
                Copy
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* ACCEPT TOGGLE */}
        <Card className="mb-8 dark:border-neutral-800 shadow-sm">
          <CardHeader>
            <CardTitle>Message Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Accept Anonymous Messages</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Allow people to send you messages via your link.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {toggleLoading && <Loader2 className="animate-spin h-4 w-4" />}
              <Switch checked={accepting} onCheckedChange={handleToggle} />
            </div>
          </CardContent>
        </Card>

        {/* MESSAGES */}
        <Card className="dark:border-neutral-800 shadow-sm">
          <CardHeader>
            <CardTitle>Received Messages</CardTitle>
          </CardHeader>

          <CardContent>
            {loadingMessages ? (
              <div className="flex justify-center my-10">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-neutral-500 text-center py-10">
                No messages yet — share your link to start receiving!
              </p>
            ) : (
              <ul className="space-y-4">
                {messages.map((msg) => (
                  <li
                    key={msg._id}
                    className="border rounded-lg p-4 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex justify-between items-start"
                  >
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                      {msg.content}
                    </p>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMessage(msg._id)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
