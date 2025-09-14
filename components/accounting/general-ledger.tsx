"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye } from "lucide-react"

interface LedgerEntry {
  id: string
  date: string
  account: string
  accountType: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense"
  description: string
  reference: string
  debit: number
  credit: number
  balance: number
}

// Mock ledger data
const mockLedgerData: LedgerEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    account: "Cash and Cash Equivalents",
    accountType: "Asset",
    description: "Initial capital investment",
    reference: "JE-001",
    debit: 50000,
    credit: 0,
    balance: 50000,
  },
  {
    id: "2",
    date: "2024-01-15",
    account: "Owner's Equity",
    accountType: "Equity",
    description: "Initial capital investment",
    reference: "JE-001",
    debit: 0,
    credit: 50000,
    balance: 50000,
  },
  {
    id: "3",
    date: "2024-01-16",
    account: "Office Equipment",
    accountType: "Asset",
    description: "Purchase of office equipment",
    reference: "JE-002",
    debit: 5000,
    credit: 0,
    balance: 5000,
  },
  {
    id: "4",
    date: "2024-01-16",
    account: "Cash and Cash Equivalents",
    accountType: "Asset",
    description: "Purchase of office equipment",
    reference: "JE-002",
    debit: 0,
    credit: 5000,
    balance: 45000,
  },
  {
    id: "5",
    date: "2024-01-17",
    account: "Accounts Receivable",
    accountType: "Asset",
    description: "Sales on credit",
    reference: "JE-003",
    debit: 8000,
    credit: 0,
    balance: 8000,
  },
  {
    id: "6",
    date: "2024-01-17",
    account: "Sales Revenue",
    accountType: "Revenue",
    description: "Sales on credit",
    reference: "JE-003",
    debit: 0,
    credit: 8000,
    balance: 8000,
  },
  {
    id: "7",
    date: "2024-01-18",
    account: "Office Supplies Expense",
    accountType: "Expense",
    description: "Monthly office supplies",
    reference: "JE-004",
    debit: 500,
    credit: 0,
    balance: 500,
  },
  {
    id: "8",
    date: "2024-01-18",
    account: "Cash and Cash Equivalents",
    accountType: "Asset",
    description: "Monthly office supplies",
    reference: "JE-004",
    debit: 0,
    credit: 500,
    balance: 44500,
  },
]

export function GeneralLedger() {
  const [searchTerm, setSearchTerm] = useState("")
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")

  // Filter data
  const filteredData = useMemo(() => {
    return mockLedgerData.filter((entry) => {
      const matchesSearch =
        entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.reference.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAccountType = accountTypeFilter === "all" || entry.accountType === accountTypeFilter

      // Simple date filtering (in a real app, you'd have proper date range filtering)
      const matchesDateRange = dateRange === "all" || true

      return matchesSearch && matchesAccountType && matchesDateRange
    })
  }, [searchTerm, accountTypeFilter, dateRange])

  // Calculate totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, entry) => ({
        debit: acc.debit + entry.debit,
        credit: acc.credit + entry.credit,
      }),
      { debit: 0, credit: 0 },
    )
  }, [filteredData])

  const getAccountTypeBadge = (type: LedgerEntry["accountType"]) => {
    const colors = {
      Asset: "bg-emerald-600",
      Liability: "bg-red-600",
      Equity: "bg-blue-600",
      Revenue: "bg-purple-600",
      Expense: "bg-amber-600",
    }

    return <Badge className={`${colors[type]} text-white`}>{type}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">General Ledger</CardTitle>
          <CardDescription>Complete record of all financial transactions organized by account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search accounts, descriptions, or references..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Asset">Assets</SelectItem>
                <SelectItem value="Liability">Liabilities</SelectItem>
                <SelectItem value="Equity">Equity</SelectItem>
                <SelectItem value="Revenue">Revenue</SelectItem>
                <SelectItem value="Expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Total Debits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              ${totals.debit.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">${totals.credit.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Balance Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totals.debit === totals.credit ? "text-emerald-600" : "text-red-600"}`}
            >
              {totals.debit === totals.credit ? "Balanced" : "Unbalanced"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ledger Entries</CardTitle>
          <CardDescription>Showing {filteredData.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-mono text-sm">{entry.date}</TableCell>
                    <TableCell className="font-medium">{entry.account}</TableCell>
                    <TableCell>{getAccountTypeBadge(entry.accountType)}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                    <TableCell className="font-mono text-sm">{entry.reference}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">${entry.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
