"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Save, Calculator, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JournalEntry {
  id: string
  account: string
  accountType: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense"
  debit: number
  credit: number
  description: string
}

interface Transaction {
  id: string
  date: string
  reference: string
  description: string
  entries: JournalEntry[]
  totalDebit: number
  totalCredit: number
  status: "draft" | "posted"
}

// Mock accounts data
const accounts = [
  { name: "Cash and Cash Equivalents", type: "Asset" as const },
  { name: "Accounts Receivable", type: "Asset" as const },
  { name: "Inventory", type: "Asset" as const },
  { name: "Office Equipment", type: "Asset" as const },
  { name: "Accounts Payable", type: "Liability" as const },
  { name: "Short-term Debt", type: "Liability" as const },
  { name: "Owner's Equity", type: "Equity" as const },
  { name: "Retained Earnings", type: "Equity" as const },
  { name: "Sales Revenue", type: "Revenue" as const },
  { name: "Service Revenue", type: "Revenue" as const },
  { name: "Office Supplies Expense", type: "Expense" as const },
  { name: "Rent Expense", type: "Expense" as const },
  { name: "Utilities Expense", type: "Expense" as const },
]

// Mock recent transactions
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    reference: "JE-001",
    description: "Initial capital investment",
    entries: [
      {
        id: "1",
        account: "Cash and Cash Equivalents",
        accountType: "Asset",
        debit: 50000,
        credit: 0,
        description: "Initial capital investment",
      },
      {
        id: "2",
        account: "Owner's Equity",
        accountType: "Equity",
        debit: 0,
        credit: 50000,
        description: "Initial capital investment",
      },
    ],
    totalDebit: 50000,
    totalCredit: 50000,
    status: "posted",
  },
  {
    id: "2",
    date: "2024-01-16",
    reference: "JE-002",
    description: "Purchase of office equipment",
    entries: [
      {
        id: "3",
        account: "Office Equipment",
        accountType: "Asset",
        debit: 5000,
        credit: 0,
        description: "Purchase of office equipment",
      },
      {
        id: "4",
        account: "Cash and Cash Equivalents",
        accountType: "Asset",
        debit: 0,
        credit: 5000,
        description: "Purchase of office equipment",
      },
    ],
    totalDebit: 5000,
    totalCredit: 5000,
    status: "posted",
  },
]

export function TransactionEntry() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [currentTransaction, setCurrentTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split("T")[0],
    reference: `JE-${String(transactions.length + 1).padStart(3, "0")}`,
    description: "",
    entries: [],
    status: "draft",
  })
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    account: "",
    accountType: "Asset",
    debit: 0,
    credit: 0,
    description: "",
  })
  const { toast } = useToast()

  const calculateTotals = (entries: JournalEntry[]) => {
    const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0)
    const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0)
    return { totalDebit, totalCredit }
  }

  const isBalanced = () => {
    const { totalDebit, totalCredit } = calculateTotals(currentTransaction.entries || [])
    return totalDebit === totalCredit && totalDebit > 0
  }

  const addEntry = () => {
    if (!newEntry.account || (!newEntry.debit && !newEntry.credit)) {
      toast({
        title: "Invalid Entry",
        description: "Please select an account and enter either a debit or credit amount.",
        variant: "destructive",
      })
      return
    }

    const account = accounts.find((acc) => acc.name === newEntry.account)
    if (!account) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      account: newEntry.account,
      accountType: account.type,
      debit: Number(newEntry.debit) || 0,
      credit: Number(newEntry.credit) || 0,
      description: newEntry.description || currentTransaction.description || "",
    }

    setCurrentTransaction((prev) => ({
      ...prev,
      entries: [...(prev.entries || []), entry],
    }))

    setNewEntry({
      account: "",
      accountType: "Asset",
      debit: 0,
      credit: 0,
      description: "",
    })

    toast({
      title: "Entry Added",
      description: "Journal entry has been added to the transaction.",
      variant: "success",
    })
  }

  const removeEntry = (entryId: string) => {
    setCurrentTransaction((prev) => ({
      ...prev,
      entries: prev.entries?.filter((entry) => entry.id !== entryId) || [],
    }))

    toast({
      title: "Entry Removed",
      description: "Journal entry has been removed from the transaction.",
      variant: "default",
    })
  }

  const saveTransaction = () => {
    if (!currentTransaction.description || !currentTransaction.entries?.length) {
      toast({
        title: "Incomplete Transaction",
        description: "Please add a description and at least one journal entry.",
        variant: "destructive",
      })
      return
    }

    if (!isBalanced()) {
      toast({
        title: "Unbalanced Transaction",
        description: "Total debits must equal total credits.",
        variant: "destructive",
      })
      return
    }

    const { totalDebit, totalCredit } = calculateTotals(currentTransaction.entries)
    const transaction: Transaction = {
      id: Date.now().toString(),
      date: currentTransaction.date || new Date().toISOString().split("T")[0],
      reference: currentTransaction.reference || `JE-${String(transactions.length + 1).padStart(3, "0")}`,
      description: currentTransaction.description,
      entries: currentTransaction.entries,
      totalDebit,
      totalCredit,
      status: "posted",
    }

    setTransactions((prev) => [transaction, ...prev])
    setCurrentTransaction({
      date: new Date().toISOString().split("T")[0],
      reference: `JE-${String(transactions.length + 2).padStart(3, "0")}`,
      description: "",
      entries: [],
      status: "draft",
    })

    toast({
      title: "Transaction Saved",
      description: "Journal entry has been posted successfully.",
      variant: "success",
    })
  }

  const getAccountTypeBadge = (type: JournalEntry["accountType"]) => {
    const colors = {
      Asset: "bg-emerald-600",
      Liability: "bg-red-600",
      Equity: "bg-blue-600",
      Revenue: "bg-purple-600",
      Expense: "bg-amber-600",
    }

    return <Badge className={`${colors[type]} text-white`}>{type}</Badge>
  }

  const currentTotals = calculateTotals(currentTransaction.entries || [])

  return (
    <div className="space-y-6">
      {/* Transaction Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">New Journal Entry</CardTitle>
          <CardDescription>Create a new accounting transaction with journal entries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={currentTransaction.date}
                onChange={(e) => setCurrentTransaction((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                value={currentTransaction.reference}
                onChange={(e) => setCurrentTransaction((prev) => ({ ...prev, reference: e.target.value }))}
                placeholder="JE-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center h-10">
                <Badge variant="secondary">Draft</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Transaction Description</Label>
            <Textarea
              id="description"
              value={currentTransaction.description}
              onChange={(e) => setCurrentTransaction((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter transaction description..."
              rows={2}
            />
          </div>

          {/* Add New Entry */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-lg font-medium mb-4">Add Journal Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Account</Label>
                <Select
                  value={newEntry.account}
                  onValueChange={(value) => {
                    const account = accounts.find((acc) => acc.name === value)
                    setNewEntry((prev) => ({
                      ...prev,
                      account: value,
                      accountType: account?.type || "Asset",
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.name} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Debit Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newEntry.debit || ""}
                  onChange={(e) =>
                    setNewEntry((prev) => ({
                      ...prev,
                      debit: Number(e.target.value),
                      credit: 0, // Clear credit when debit is entered
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Credit Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newEntry.credit || ""}
                  onChange={(e) =>
                    setNewEntry((prev) => ({
                      ...prev,
                      credit: Number(e.target.value),
                      debit: 0, // Clear debit when credit is entered
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newEntry.description}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Entry description"
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={addEntry} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </div>
            </div>
          </div>

          {/* Current Entries */}
          {currentTransaction.entries && currentTransaction.entries.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Journal Entries</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransaction.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.account}</TableCell>
                        <TableCell>{getAccountTypeBadge(entry.accountType)}</TableCell>
                        <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry(entry.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50 font-semibold">
                      <TableCell colSpan={3}>Totals</TableCell>
                      <TableCell className="text-right">${currentTotals.totalDebit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${currentTotals.totalCredit.toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Balance Check */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="text-sm font-medium">Balance Check: {isBalanced() ? "Balanced" : "Unbalanced"}</span>
                  {isBalanced() ? <Badge className="bg-emerald-600">✓</Badge> : <Badge variant="destructive">✗</Badge>}
                </div>
                <Button
                  onClick={saveTransaction}
                  disabled={!isBalanced()}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Post Transaction
                </Button>
              </div>

              {!isBalanced() && currentTransaction.entries.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Transaction is not balanced. Total debits (${currentTotals.totalDebit.toLocaleString()}) must equal
                    total credits (${currentTotals.totalCredit.toLocaleString()}).
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <CardDescription>Recently posted journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-emerald-600">Posted</Badge>
                    <span className="font-mono text-sm">{transaction.reference}</span>
                    <span className="text-sm text-gray-500">{transaction.date}</span>
                  </div>
                  <div className="text-sm font-medium">${transaction.totalDebit.toLocaleString()}</div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{transaction.description}</p>
                <div className="text-xs text-gray-500">
                  {transaction.entries.length} entries • Debits: ${transaction.totalDebit.toLocaleString()} • Credits: $
                  {transaction.totalCredit.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
