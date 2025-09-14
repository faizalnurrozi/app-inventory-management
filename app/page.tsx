"use client"

import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { useAuth } from "@/components/auth/auth-provider"
import { LoginForm } from "@/components/auth/login-form"

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-emerald-900/20">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">DataFlow Pro</h1>
            <p className="text-gray-600 dark:text-gray-300">Complete inventory and accounting management</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default function HomePage({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return <DashboardOverview />
  }

  return <LoginPage />
}
