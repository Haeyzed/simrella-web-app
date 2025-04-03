"use client"

import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRouter, useSearchParams} from "next/navigation"
import {Clock, RefreshCw} from "lucide-react"
import Link from "next/link"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp"
import {resendVerification, verifyEmail} from "@/actions/auth"
import {verifyOTPSchema} from "@/lib/validations"

export default function VerifyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || "sample@***.com"

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(60)

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const form = useForm<z.infer<typeof verifyOTPSchema> & { email: string }>({
        resolver: zodResolver(
            verifyOTPSchema.extend({
                email: z.string().email({message: "Please enter a valid email address"}),
            }),
        ),
        defaultValues: {
            email: email,
            otp: "",
        },
    })

    // Update email field when URL param changes
    useEffect(() => {
        form.setValue("email", email)
    }, [email, form])

    async function onSubmit(values: z.infer<typeof verifyOTPSchema> & { email: string }) {
        setIsPending(true)
        setError(null)
        setSuccess(null)

        try {
            const formData = new FormData()
            formData.append("email", values.email)
            formData.append("otp", values.otp)

            const result = await verifyEmail(null, formData)

            if (!result.success) {
                setError(result.message || "Failed to verify email. Please try again.")
                setIsPending(false)
                return
            }

            setSuccess(result.message || "Email verification successful! You can now login to your account.")

            // Redirect to login page after a short delay
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (error) {
            setError("An unexpected error occurred. Please try again.")
            setIsPending(false)
        }
    }

    async function handleResendVerification() {
        setIsResending(true)
        setError(null)
        // Reset countdown
        setCountdown(60)

        try {
            const result = await resendVerification()

            if (!result.success) {
                setError(result.message || "Failed to resend verification email. Please try again.")
                setIsResending(false)
                return
            }

            setSuccess(result.message || "Verification email resent. Please check your inbox.")
            setIsResending(false)
        } catch (error) {
            setError("An unexpected error occurred. Please try again.")
            setIsResending(false)
        }
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Verify Email Address</h1>
                <p className="text-gray-600 leading-relaxed">
                    Let's get you secured. A verification code has been sent to{" "}
                    <span className="text-[#4040A1] font-medium">{email}</span> to verify it is you. Please enter code
                    below
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert variant="success" className="bg-green-50 text-green-800 border-green-200 mb-6">
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP
                                        maxLength={6}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={isPending}
                                        className="gap-2 justify-between"
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot
                                                index={0}
                                                className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center text-xl font-medium border-b-2 border-[#FF9B21]"
                                            />
                                            <InputOTPSlot
                                                index={1}
                                                className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center text-xl font-medium border-b-2 border-[#FF9B21]"
                                            />
                                            <InputOTPSlot
                                                index={2}
                                                className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center text-xl font-medium border-b-2 border-[#FF9B21]"
                                            />
                                            <InputOTPSlot
                                                index={3}
                                                className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center text-xl font-medium border-b-2 border-[#FF9B21]"
                                            />
                                            <InputOTPSlot
                                                index={4}
                                                className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center text-xl font-medium border-b-2 border-[#FF9B21]"
                                            />
                                            <InputOTPSlot
                                                index={5}
                                                className="w-16 h-16 bg-gray-50 rounded-md flex items-center justify-center text-xl font-medium border-b-2 border-[#FF9B21]"
                                            />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-5 w-5 text-[#FF9B21]"/>
                        <span>
              Didn't receive code?{" "}
                            <button
                                type="button"
                                onClick={handleResendVerification}
                                className="text-[#4040A1] hover:underline inline-flex items-center gap-1"
                                disabled={isResending || countdown > 0}
                            >
                {isResending && <RefreshCw className="size-3 animate-spin"/>}
                                {countdown > 0 ? (
                                    <>
                                        {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")} secs
                                    </>
                                ) : (
                                    "Resend code"
                                )}
              </button>
            </span>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-[#FF9B21] hover:bg-[#e88c1d] text-white"
                            disabled={isPending}>
                        {isPending ? "Verifying..." : "Verify Email"}
                    </Button>

                    <div className="text-center">
                        <Link href="/login" className="text-[#4040A1] text-sm hover:underline">
                            Back to login
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}

