import { getCurrentSession } from '@/lib/session'
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

export default async function layout({ children }: { children: ReactNode }) {
    const { user } = await getCurrentSession()
    if (user) {
        if (user.Role === "ADMINISTRATOR") {
            return redirect("/admin/dashboard");
        } else if (user.Role === "FACULTY") {
            return redirect("/faculty/dashboard");
        } else if (user.Role === "STUDENT") {
            return redirect("/dashboard");
        }
    }

    return (
        <div>
            {children}
        </div>
    )
}
