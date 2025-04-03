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
import {register} from "@/actions/auth"
import {registerSchema} from "@/lib/validations"

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
    })

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsPending(true)
        setError(null)
        setSuccess(null)

        try {
            const formData = new FormData()
            formData.append("first_name", values.first_name)
            formData.append("last_name", values.last_name)
            formData.append("email", values.email)
            formData.append("password", values.password)
            formData.append("password_confirmation", values.password_confirmation)

            const result = await register(null, formData)

            if (!result.success) {
                setError(result.message || "Registration failed. Please try again.")
                setIsPending(false)
                return
            }

            setSuccess(result.message || "Registration successful! Please check your email to verify your account.")
            form.reset()

            // Redirect to verification page after a short delay
            setTimeout(() => {
                router.push(`/verify?email=${encodeURIComponent(values.email)}`)
            }, 2000)
        } catch (error) {
            setError("An unexpected error occurred. Please try again.")
            setIsPending(false)
        }
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-500">Enter your information below to create your account</p>
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

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({field}) => (
                                <FormItem className="space-y-2">
                                    <FormLabel htmlFor="first_name">First Name</FormLabel>
                                    <FormControl>
                                        <Input id="first_name" placeholder="John" className="h-12" {...field}
                                               disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({field}) => (
                                <FormItem className="space-y-2">
                                    <FormLabel htmlFor="last_name">Last Name</FormLabel>
                                    <FormControl>
                                        <Input id="last_name" placeholder="Doe" className="h-12" {...field}
                                               disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

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
                                        placeholder="m@example.com"
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
                        name="password"
                        render={({field}) => (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
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
                                <FormLabel htmlFor="password_confirmation">Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Confirm password"
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
                        {isPending ? "Creating account..." : "Create Account"}
                    </Button>

                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#4040A1] hover:underline">
                            Login
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}

