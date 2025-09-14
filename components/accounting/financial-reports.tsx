"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react"

// Mock financial data
const profitLossData = [
  { month: "Jan", revenue: 15000, expenses: 8500, profit: 6500 },
  { month: "Feb", revenue: 18000, expenses: 9200, profit: 8800 },
  { month: "Mar", revenue: 16500, expenses: 8800, profit: 7700 },
  { month: "Apr", revenue: 20000, expenses: 10500, profit: 9500 },
  { month: "May", revenue: 22000, expenses: 11200, profit: 10800 },
  { month: "Jun", revenue: 25000, expenses: 12000, profit: 13000 },
]

const balanceSheetData = {
  assets: {
    current: [
      { name: "Cash and Cash Equivalents", amount: 45000 },
      { name: "Accounts Receivable", amount: 28000 },
      { name: "Inventory", amount: 35000 },
      { name: "Prepaid Expenses", amount: 5000 },
    ],
    nonCurrent: [
      { name: "Property, Plant & Equipment", amount: 85000 },
      { name: "Intangible Assets", amount: 15000 },
      { name: "Long-term Investments", amount: 25000 },
    ],
  },
  liabilities: {
    current: [
      { name: "Accounts Payable", amount: 15000 },
      { name: "Short-term Debt", amount: 8000 },
      { name: "Accrued Expenses", amount: 7000 },
    ],
    nonCurrent: [
      { name: "Long-term Debt", amount: 35000 },
      { name: "Deferred Tax Liabilities", amount: 5000 },
    ],
  },
  equity: [
    { name: "Share Capital", amount: 100000 },
    { name: "Retained Earnings", amount: 68000 },
  ],
}

const cashFlowData = [
  { month: "Jan", operating: 8000, investing: -5000, financing: 2000 },
  { month: "Feb", operating: 9500, investing: -3000, financing: 1500 },
  { month: "Mar", operating: 7200, investing: -8000, financing: 5000 },
  { month: "Apr", operating: 11000, investing: -2000, financing: -3000 },
  { month: "May", operating: 12500, investing: -6000, financing: 2500 },
  { month: "Jun", operating: 14000, investing: -4000, financing: -2000 },
]

export function FinancialReports() {
  const [selectedReport, setSelectedReport] = useState("profit-loss")
  const [selectedPeriod, setSelectedPeriod] = useState("6-months")

  const calculateTotals = () => {
    const totalCurrentAssets = balanceSheetData.assets.current.reduce((sum, item) => sum + item.amount, 0)
    const totalNonCurrentAssets = balanceSheetData.assets.nonCurrent.reduce((sum, item) => sum + item.amount, 0)
    const totalAssets = totalCurrentAssets + totalNonCurrentAssets

    const totalCurrentLiabilities = balanceSheetData.liabilities.current.reduce((sum, item) => sum + item.amount, 0)
    const totalNonCurrentLiabilities = balanceSheetData.liabilities.nonCurrent.reduce(
      (sum, item) => sum + item.amount,
      0,
    )
    const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities

    const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.amount, 0)

    return {
      totalCurrentAssets,
      totalNonCurrentAssets,
      totalAssets,
      totalCurrentLiabilities,
      totalNonCurrentLiabilities,
      totalLiabilities,
      totalEquity,
    }
  }

  const totals = calculateTotals()

  const renderProfitLossReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
          <CardDescription>Revenue, expenses, and net income over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={profitLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              <Bar dataKey="profit" fill="#3B82F6" name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              ${profitLossData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="mr-1 h-3 w-3" />
              +15.2% vs last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              ${profitLossData.reduce((sum, item) => sum + item.expenses, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-red-700 dark:text-red-300">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8.7% vs last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ${profitLossData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-blue-700 dark:text-blue-300">
              <TrendingUp className="mr-1 h-3 w-3" />
              +22.4% vs last period
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderBalanceSheetReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
          <CardDescription>Assets, liabilities, and equity as of current date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assets */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assets</h3>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Current Assets</h4>
                {balanceSheetData.assets.current.map((asset) => (
                  <div
                    key={asset.name}
                    className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">{asset.name}</span>
                    <span className="font-semibold">${asset.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-medium border-t border-gray-200 dark:border-gray-700">
                  <span>Total Current Assets</span>
                  <span>${totals.totalCurrentAssets.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Non-Current Assets</h4>
                {balanceSheetData.assets.nonCurrent.map((asset) => (
                  <div
                    key={asset.name}
                    className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">{asset.name}</span>
                    <span className="font-semibold">${asset.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-medium border-t border-gray-200 dark:border-gray-700">
                  <span>Total Non-Current Assets</span>
                  <span>${totals.totalNonCurrentAssets.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 font-bold text-lg border-t-2 border-gray-300 dark:border-gray-600">
                <span>Total Assets</span>
                <span className="text-emerald-600">${totals.totalAssets.toLocaleString()}</span>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Liabilities & Equity</h3>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Current Liabilities</h4>
                {balanceSheetData.liabilities.current.map((liability) => (
                  <div
                    key={liability.name}
                    className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">{liability.name}</span>
                    <span className="font-semibold">${liability.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-medium border-t border-gray-200 dark:border-gray-700">
                  <span>Total Current Liabilities</span>
                  <span>${totals.totalCurrentLiabilities.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Non-Current Liabilities</h4>
                {balanceSheetData.liabilities.nonCurrent.map((liability) => (
                  <div
                    key={liability.name}
                    className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">{liability.name}</span>
                    <span className="font-semibold">${liability.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-medium border-t border-gray-200 dark:border-gray-700">
                  <span>Total Non-Current Liabilities</span>
                  <span>${totals.totalNonCurrentLiabilities.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Equity</h4>
                {balanceSheetData.equity.map((equity) => (
                  <div
                    key={equity.name}
                    className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">{equity.name}</span>
                    <span className="font-semibold">${equity.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-medium border-t border-gray-200 dark:border-gray-700">
                  <span>Total Equity</span>
                  <span>${totals.totalEquity.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 font-bold text-lg border-t-2 border-gray-300 dark:border-gray-600">
                <span>Total Liabilities & Equity</span>
                <span className="text-blue-600">
                  ${(totals.totalLiabilities + totals.totalEquity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCashFlowReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Statement</CardTitle>
          <CardDescription>Cash flows from operating, investing, and financing activities</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
              <Line type="monotone" dataKey="operating" stroke="#10B981" strokeWidth={2} name="Operating" />
              <Line type="monotone" dataKey="investing" stroke="#EF4444" strokeWidth={2} name="Investing" />
              <Line type="monotone" dataKey="financing" stroke="#3B82F6" strokeWidth={2} name="Financing" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              Operating Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              ${cashFlowData.reduce((sum, item) => sum + item.operating, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="mr-1 h-3 w-3" />
              Strong operating performance
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Investing Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              ${cashFlowData.reduce((sum, item) => sum + item.investing, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-red-700 dark:text-red-300">
              <TrendingDown className="mr-1 h-3 w-3" />
              Investment in growth
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Financing Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ${cashFlowData.reduce((sum, item) => sum + item.financing, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-blue-700 dark:text-blue-300">
              <TrendingUp className="mr-1 h-3 w-3" />
              Balanced financing
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Financial Reports</CardTitle>
          <CardDescription>Generate and view comprehensive financial statements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select Report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profit-loss">Profit & Loss Statement</SelectItem>
                <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
                <SelectItem value="cash-flow">Cash Flow Statement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-month">Last Month</SelectItem>
                <SelectItem value="3-months">Last 3 Months</SelectItem>
                <SelectItem value="6-months">Last 6 Months</SelectItem>
                <SelectItem value="1-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {selectedReport === "profit-loss" && renderProfitLossReport()}
      {selectedReport === "balance-sheet" && renderBalanceSheetReport()}
      {selectedReport === "cash-flow" && renderCashFlowReport()}
    </div>
  )
}
