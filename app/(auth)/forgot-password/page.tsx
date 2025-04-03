"use client"

import {useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRouter} from "next/navigation"
import Link from "next/link"
import type {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {forgotPassword} from "@/actions/auth"
import {forgotPasswordSchema} from "@/lib/validations"
import {Loader2} from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
        setIsPending(true)
        setError(null)
        setSuccess(null)

        try {
            const formData = new FormData()
            formData.append("email", values.email)

            const result = await forgotPassword(null, formData)

            if (!result.success) {
                setError(result.message || "Failed to send reset password email. Please try again.")
                setIsPending(false)
                return
            }

            setSuccess(result.message || "Reset password email sent. Please check your inbox.")

            // Redirect to reset password page after a short delay
            setTimeout(() => {
                router.push(`/reset-password?email=${encodeURIComponent(values.email)}`)
            }, 2000)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError("An unexpected error occurred. Please try again.")
            setIsPending(false)
        }
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
                <p className="text-gray-500">Enter your email address and we&#39;ll send you a link to reset your
                    password</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
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
                                        placeholder="Enter your email"
                                        className="h-12"
                                        {...field}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full h-12 bg-[#FF9B21] hover:bg-[#e88c1d] text-white"
                            disabled={isPending}>
                        {isPending ? (<><Loader2 className="animate-spin mr-2" size={18} /> Sending...</>) : "Send Reset Link"}
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

