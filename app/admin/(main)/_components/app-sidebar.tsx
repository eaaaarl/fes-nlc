"use client"

import * as React from "react"
import {
    BookOpen,
    Bot,
    Command,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: "Students",
            url: "/admin/students",
            icon: Bot,
        },
        {
            title: "Faculty",
            url: "/admin/faculty",
            icon: BookOpen,
        },
        {
            title: "Reports",
            url: "/admin/reports",
            icon: Settings2,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { data: user, isLoading } = useQuery({
        queryKey: ['admin', 'info'],
        queryFn: async (): Promise<{ user: { username: string, Role: string } }> => {
            const response = await fetch(`/api/admin/info`);
            if (!response.ok) {
                throw new Error('failed to fetch info')
            }

            return response.json()
        }
    })
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/admin/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">FESNLC</span>
                                    <span className="truncate text-xs">NEMSU Lianga Campus</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="flex flex-col space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                ) : user ? (
                    <NavUser user={user.user} />
                ) : (
                    <div>Error loading user information</div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
