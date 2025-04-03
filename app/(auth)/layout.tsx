import type React from "react"
import {auth} from "@/auth"
import {redirect} from "next/navigation"
import Image from "next/image"
import altlogo from "../../public/images/logo-white.png"
import image1 from "../../public/images/adminloginimage1.png"
import image2 from "../../public/images/adminloginimage2.png"
import image3 from "../../public/images/adminloginimage3.png"
import image4 from "../../public/images/adminloginimage4.png"
import image5 from "../../public/images/adminloginimage5.png"

export default async function AuthLayout({children}: { children: React.ReactNode }) {
    const session = await auth()

    // Redirect to dashboard if already authenticated
    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="bg-[#4040A1] relative hidden lg:block">
                {/* Logo */}
                <div className="absolute top-8 left-8 z-50">
                    <Image src={altlogo || "/placeholder.svg"} alt="Simbrella Logo" className="h-10 w-auto" priority/>
                </div>

                {/* Image Collage */}
                <div className="absolute inset-0 w-full h-full">
                    {/* Top left image - person with glasses */}
                    <div className="absolute top-[15%] left-[12%] z-10">
                        <div
                            className="rounded-lg border-4 border-white shadow-lg overflow-hidden"
                            style={{width: "170px", height: "210px"}}
                        >
                            <Image
                                src={image2 || "/placeholder.svg"}
                                alt="Person working"
                                className="w-full h-full object-cover"
                                width={170}
                                height={210}
                            />
                        </div>
                    </div>

                    {/* Top center image - woman smiling */}
                    <div className="absolute top-[10%] left-[35%] z-20">
                        <div
                            className="rounded-lg border-4 border-white shadow-lg overflow-hidden"
                            style={{width: "200px", height: "240px"}}
                        >
                            <Image
                                src={image1 || "/placeholder.svg"}
                                alt="Person smiling"
                                className="w-full h-full object-cover"
                                width={200}
                                height={240}
                            />
                        </div>
                    </div>

                    {/* Top right image - woman at desk */}
                    <div className="absolute top-[20%] right-[12%] z-30">
                        <div
                            className="rounded-lg border-4 border-white shadow-lg overflow-hidden"
                            style={{width: "200px", height: "240px"}}
                        >
                            <Image
                                src={image3 || "/placeholder.svg"}
                                alt="Person at desk"
                                className="w-full h-full object-cover"
                                width={200}
                                height={240}
                            />
                        </div>
                    </div>

                    {/* Middle image - people collaborating */}
                    <div className="absolute top-[45%] left-[35%] z-40">
                        <div
                            className="rounded-lg border-4 border-white shadow-lg overflow-hidden"
                            style={{width: "200px", height: "240px"}}
                        >
                            <Image
                                src={image4 || "/placeholder.svg"}
                                alt="People collaborating"
                                className="w-full h-full object-cover"
                                width={200}
                                height={240}
                            />
                        </div>
                    </div>

                    {/* Bottom image - person on laptop */}
                    <div className="absolute bottom-[15%] left-[15%] z-50">
                        <div
                            className="rounded-lg border-4 border-white shadow-lg overflow-hidden"
                            style={{width: "200px", height: "240px"}}
                        >
                            <Image
                                src={image5 || "/placeholder.svg"}
                                alt="Person on laptop"
                                className="w-full h-full object-cover"
                                width={200}
                                height={240}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col p-6 md:p-10">
                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>
        </div>
    )
}

