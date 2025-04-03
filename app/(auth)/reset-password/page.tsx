"use client"

import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRouter, useSearchParams} from "next/navigation"
import Link from "next/link"
import type {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp"
import {resetPassword} from "@/actions/auth"
import {resetPasswordSchema} from "@/lib/validations"

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""

    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: email,
            otp: "",
            password: "",
            password_confirmation: "",
        },
    })

    // Update email field when URL param changes
    useEffect(() => {
        form.setValue("email", email)
    }, [email, form])

    async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
        setIsPending(true)
        setError(null)
        setSuccess(null)

        try {
            const formData = new FormData()
            formData.append("email", values.email)
            formData.append("otp", values.otp)
            formData.append("password", values.password)
            formData.append("password_confirmation", values.password_confirmation)

            const result = await resetPassword(null, formData)

            if (!result.success) {
                setError(result.message || "Failed to reset password. Please try again.")
                setIsPending(false)
                return
            }

            setSuccess(result.message || "Password reset successful! You can now login with your new password.")

            // Redirect to login page after a short delay
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } catch (error) {
            setError("An unexpected error occurred. Please try again.")
            setIsPending(false)
        }
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                <p className="text-gray-500">
                    Enter the verification code sent to your email and create a new password
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor="email">Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-12"
                                        {...field}
                                        disabled={true}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="otp"
                        render={({field}) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Verification Code</FormLabel>
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

                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor="password">New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter new password"
                                        className="h-12"
                                        {...field}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password_confirmation"
                        render={({field}) => (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor="password_confirmation">Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="h-12"
                                        {...field}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#FF9B21] hover:bg-[#e88c1d] text-white"
                        disabled={isPending}
                    >
                        {isPending ? "Resetting password..." : "Reset Password"}
                    </Button>

                    <div className="text-center text-sm">
                        Remember your password?{" "}
                        <Link href="/login" className="text-[#4040A1] hover:underline">
                            Back to login
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}
