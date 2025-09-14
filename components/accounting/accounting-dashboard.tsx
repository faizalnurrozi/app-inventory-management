"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralLedger } from "./general-ledger"
import { FinancialReports } from "./financial-reports"
import { AccountsOverview } from "./accounts-overview"
import { TransactionEntry } from "./transaction-entry"
import { Button } from "@/components/ui/button"
import { Plus, FileText, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export function AccountingDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock financial data
  const financialSummary = {
    totalAssets: 125000,
    totalLiabilities: 45000,
    totalEquity: 80000,
    monthlyRevenue: 15000,
    monthlyExpenses: 8500,
    netIncome: 6500,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounting & Finance</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your financial records and generate reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              ${financialSummary.totalAssets.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              ${financialSummary.totalLiabilities.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-red-700 dark:text-red-300">
              <TrendingDown className="mr-1 h-3 w-3" />
              -5.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ${financialSummary.netIncome.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-blue-700 dark:text-blue-300">
              <TrendingUp className="mr-1 h-3 w-3" />
              +18.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AccountsOverview />
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          <GeneralLedger />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionEntry />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
