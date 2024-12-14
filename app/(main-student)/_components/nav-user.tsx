"use client"

import {
    BadgeCheck,
    ChevronsUpDown,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useLogoutStudent } from "./mutation"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ChangePassword from "./change-password"


export function NavUser({
    info,
}: {
    info: {
        fullName: string,
        department: string,
        avatar?: string,
        user: {
            username: string
        }
    }

}) {
    const [openChangePassword, setOpenChangePassword] = useState(false);

    const { isMobile } = useSidebar()
    const router = useRouter()
    const { mutate } = useLogoutStudent()

    const handleOpenChangePassword = () => {
        setOpenChangePassword(true);
    }
    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={info?.avatar || ''} alt={info.fullName} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{info.fullName}</span>
                                    <span className="truncate text-xs">{info.user.username}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={info.avatar} alt={info.fullName} />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{info.fullName}</span>
                                        <span className="truncate text-xs">{info.user.username}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup
                                onClick={() => handleOpenChangePassword()}
                            >
                                <DropdownMenuItem>
                                    <BadgeCheck />
                                    Change Password
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => mutate(undefined, {
                                onSuccess: () => {
                                    router.push('/login');
                                },
                            })}>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <ChangePassword
                onOpen={openChangePassword}
                onCancel={() => setOpenChangePassword(false)}
            />
        </>
    )
}
