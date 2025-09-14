"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const accountsData = [
  { type: "Assets", amount: 125000, color: "#10B981", accounts: 15 },
  { type: "Liabilities", amount: 45000, color: "#EF4444", accounts: 8 },
  { type: "Equity", amount: 80000, color: "#3B82F6", accounts: 5 },
  { type: "Revenue", amount: 35000, color: "#8B5CF6", accounts: 12 },
  { type: "Expenses", amount: 28500, color: "#F59E0B", accounts: 18 },
]

const monthlyData = [
  { month: "Jan", revenue: 12000, expenses: 8000 },
  { month: "Feb", revenue: 14000, expenses: 9500 },
  { month: "Mar", revenue: 16000, expenses: 10200 },
  { month: "Apr", revenue: 15000, expenses: 8500 },
  { month: "May", revenue: 18000, expenses: 11000 },
  { month: "Jun", revenue: 20000, expenses: 12500 },
]

const topAccounts = [
  { name: "Cash and Cash Equivalents", type: "Asset", balance: 45000, change: 12.5 },
  { name: "Accounts Receivable", type: "Asset", balance: 28000, change: -5.2 },
  { name: "Inventory", type: "Asset", balance: 35000, change: 8.7 },
  { name: "Accounts Payable", type: "Liability", balance: -15000, change: -10.3 },
  { name: "Sales Revenue", type: "Revenue", balance: 35000, change: 22.1 },
]

export function AccountsOverview() {
  return (
    <div className="space-y-6">
      {/* Account Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {accountsData.map((account) => (
          <Card key={account.type} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: account.color }} />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{account.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${Math.abs(account.amount).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{account.accounts} accounts</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Account Distribution</CardTitle>
            <CardDescription>Breakdown of account types by value</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accountsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                >
                  {accountsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Revenue vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Accounts</CardTitle>
          <CardDescription>Accounts with the highest activity and balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topAccounts.map((account, index) => (
              <div
                key={account.name}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{account.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {account.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${account.balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    ${Math.abs(account.balance).toLocaleString()}
                  </p>
                  <div className="flex items-center text-xs">
                    <span className={account.change >= 0 ? "text-emerald-600" : "text-red-600"}>
                      {account.change >= 0 ? "+" : ""}
                      {account.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Health Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Health Indicators</CardTitle>
          <CardDescription>Key metrics to monitor your business financial health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Ratio</span>
                <span className="font-medium">2.78</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Excellent liquidity position</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Debt-to-Equity</span>
                <span className="font-medium">0.56</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Healthy debt levels</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Profit Margin</span>
                <span className="font-medium">18.6%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Strong profitability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
