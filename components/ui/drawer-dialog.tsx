"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

interface DrawerDialogProps {
    trigger: React.ReactNode
    title: string
    description?: string
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    className?: string
    footerContent?: React.ReactNode
}

export function DrawerDialog({
                                 trigger,
                                 title,
                                 description,
                                 children,
                                 open,
                                 onOpenChange,
                                 className,
                                 footerContent,
                             }: DrawerDialogProps) {
    const [isOpen, setIsOpen] = React.useState(open || false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    React.useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open)
        }
    }, [open])

    const handleOpenChange = (value: boolean) => {
        setIsOpen(value)
        onOpenChange?.(value)
    }

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className={cn("sm:max-w-[800px] overflow-y-scroll max-h-screen", className)}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    <div className="py-4">{children}</div>
                    {footerContent && <DialogFooter>{footerContent}</DialogFooter>}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent className="max-h-[95vh] flex flex-col">
                <DrawerHeader className="text-left flex-shrink-0">
                    <DrawerTitle>{title}</DrawerTitle>
                    {description && <DrawerDescription>{description}</DrawerDescription>}
                </DrawerHeader>
                <div className="px-4 py-2 overflow-y-auto flex-grow">{children}</div>
                <DrawerFooter className="pt-2 flex-shrink-0">
                    {footerContent || (
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

