"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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

interface DrawerAlertDialogProps {
    trigger: React.ReactNode
    title: string
    description: string
    cancelText?: string
    confirmText?: string
    onConfirm: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
    variant?: "default" | "destructive"
}

export function DrawerAlertDialog({
                                      trigger,
                                      title,
                                      description,
                                      cancelText = "Cancel",
                                      confirmText = "Continue",
                                      onConfirm,
                                      open,
                                      onOpenChange,
                                      variant = "default",
                                  }: DrawerAlertDialogProps) {
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

    const handleConfirm = () => {
        onConfirm()
        handleOpenChange(false)
    }

    const confirmButtonVariant = variant === "destructive" ? "destructive" : "default"

    if (isDesktop) {
        return (
            <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
                <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                            {confirmText}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">{cancelText}</Button>
                    </DrawerClose>
                    <Button
                        variant={confirmButtonVariant}
                        onClick={handleConfirm}
                        className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                        {confirmText}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

