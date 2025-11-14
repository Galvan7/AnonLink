"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { signUpSchema, type SignUpSchema } from "@/schemas/signUpSchema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Loader2, CheckCircle, XCircle, XCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
    const router = useRouter();
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState<null | "available" | "taken">(null);
    const [usernameServerErrors, setUsernameServerErrors] = useState<string[]>([]);

    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { userName: "", email: "", password: "" },
        mode: "onTouched"
    });

    const username = form.watch("userName");
    const debouncedUsername = useDebounce(username, 400);

    // Check username availability
    useEffect(() => {
        setUsernameStatus(null);
        setCheckingUsername(false);
        setUsernameServerErrors([]);
        if (!debouncedUsername || debouncedUsername.length < 2) return;
        const check = async () => {
            setCheckingUsername(true);
            try {
                const { data } = await axios.get(
                    `/api/check-username?username=${encodeURIComponent(debouncedUsername)}`
                );
                setUsernameStatus(data.available ? "available" : "taken");
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data) {
                    const payload = err.response.data;
                    if (Array.isArray(payload.message)) {
                        setUsernameServerErrors(payload.message);
                        setUsernameStatus("taken");
                    }
                    else if (payload.message) {
                        setUsernameServerErrors([payload.message]);
                        setUsernameStatus("taken");
                    } else {
                        setUsernameServerErrors(["Unknown server error"]);
                        setUsernameStatus(null);
                    }
                } else {
                    setUsernameServerErrors(["Failed to reach server"]);
                    setUsernameStatus(null);
                }
            } finally {
                setCheckingUsername(false);
            }
        };

        check();
    }, [debouncedUsername]);


    async function onSubmit(values: SignUpSchema) {
        toast.info("Creating your anonymous identity...");
        try {
            const res = await axios.post("/api/sign-up", {
                username: values.userName,
                email: values.email,
                password: values.password,
            });
            if (!res.data.success) {
                toast.error(res.data.message);
                return;
            }
            toast.success("Account created — check your email to verify.");
            router.push(`/verify?token=${res.data.token}`);
        } catch {
            toast.error("Something went wrong. Try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-800">

                <h1 className="text-2xl font-semibold text-center">Create Your Alias</h1>
                <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                    Stay anonymous. Speak freely. No identity required.
                </p>

                <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Username */}
                    <div className="space-y-2">
                        <Label>Username</Label>
                        <div className="relative">
                            <Input
                                {...form.register("userName")}
                                placeholder="youralias"
                                className={cn(
                                    usernameServerErrors.length && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />

                            {checkingUsername ? (
                                <Loader2 className="h-4 w-4 text-blue-500 animate-spin absolute right-3 top-3" />
                            ) : usernameStatus === "available" ? (
                                <CheckCircle className="h-5 w-5 text-green-600 absolute right-3 top-2.5" />
                            ) : usernameStatus === "taken" ? (
                                <XCircleIcon className="h-5 w-5 text-red-600 absolute right-3 top-2.5" />
                            ) : null}
                            {usernameStatus === "taken" && usernameServerErrors.length === 0 && (
                                <p className="text-sm ml-2 mt-1 text-red-500">Username already taken</p>
                            )}
                        </div>

                        {form.formState.errors.userName?.message ? (
                            <p className="text-sm text-red-500">{form.formState.errors.userName.message}</p>
                        ) : usernameServerErrors.length > 0 ? (
                            <ul className="text-sm text-red-500 list-disc list-inside">
                                {usernameServerErrors.map((msg, i) => (
                                    <li key={i}>{msg}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input {...form.register("email")} placeholder="you@example.com" />
                        {form.formState.errors.email && (
                            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" {...form.register("password")} />
                        {form.formState.errors.password && (
                            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    <Button className="w-full bg-black text-white hover:bg-neutral-800 transition" type="submit">
                        Create Account
                    </Button>
                </form>

                <p className="text-sm text-center mt-5 text-neutral-600 dark:text-neutral-400">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>

                <p className="text-xs text-center mt-6 text-neutral-500 dark:text-neutral-500">
                    Your identity stays hidden. No tracking. No profile. Just real expression.
                </p>
            </div>
        </div>
    );
}
