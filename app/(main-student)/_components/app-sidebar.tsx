"use client"

import * as React from "react"
import { Command, File, Inbox } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

const data = {
    navMain: [
        {
            title: "Dashbaord",
            url: "/dashboard",
            icon: Inbox,
            isActive: true,
        },
        {
            title: "Evaluation",
            url: "/evaluation",
            icon: File,
            isActive: false,
        },
    ],
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [activeItem, setActiveItem] = React.useState(data.navMain[0])
    const { setOpen } = useSidebar()

    const { data: Student, isLoading } = useQuery({
        queryKey: ['student', 'current-info'],
        queryFn: async () => {
            const response = await fetch(`/api/student/info`)
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || "(q): Failed to fetch current info")
            }
            return response.json()
        }
    })


    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden"
            {...props}
        >
            <Sidebar
                collapsible="none"
                className="w-full border-r"
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                                <Link href="/dashboard">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Command className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">FESNLC</span>
                                        <span className="truncate text-xs">NEMSU Lianga Campus</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                {data.navMain.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={{
                                                children: item.title,
                                                hidden: false,
                                            }}
                                            onClick={() => {
                                                setActiveItem(item)
                                                setOpen(true)
                                            }}
                                            isActive={activeItem.title === item.title}
                                            className="px-2.5 md:px-2"
                                        >
                                            <item.icon />
                                            <Link href={item.url}>
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
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
                    ) : Student ? (
                        <NavUser info={Student.info} />
                    ) : (
                        <div>Error loading user information</div>
                    )}
                </SidebarFooter>
            </Sidebar>
        </Sidebar>
    )
}
