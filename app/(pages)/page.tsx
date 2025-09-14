"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useAuth } from "@/components/auth/auth-provider"

export function DashboardSectionLayout({ children }: { children: React.ReactNode}) {
    const { user, isLoading } = useAuth()

    // Masih loading (cek localStorage), kasih spinner/blank biar gak flicker
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Kalau belum login, render langsung children (misalnya halaman login di "/")
    if (!user) {
        return <>{children}</>
    }

    // Kalau sudah login, bungkus pakai DashboardLayout
    return <DashboardLayout>{children}</DashboardLayout>

}
