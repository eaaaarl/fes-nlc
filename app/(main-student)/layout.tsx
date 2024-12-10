
import {
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { ReactNode } from "react"
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: { children: ReactNode }) {
    const { user, session } = await getCurrentSession();
    if (!user) {
        redirect("/not-found");
    }
    if (user.Role !== "STUDENT") {
        return redirect("/unauthorized");
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            {children}
        </SidebarProvider>
    )
}
