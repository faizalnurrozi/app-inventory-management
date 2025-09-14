"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryTable } from "./inventory-table"
import { AddInventoryModal } from "./add-inventory-modal"
import { EditInventoryModal } from "./edit-inventory-modal"
import { DeleteConfirmModal } from "./delete-confirm-modal"
import { Plus, Search, Download, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  price: number
  cost: number
  supplier: string
  status: "in-stock" | "low-stock" | "out-of-stock"
  lastUpdated: string
  description?: string
}

// Mock data
const mockInventoryData: InventoryItem[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    sku: "WBH-001",
    category: "Electronics",
    quantity: 45,
    price: 99.99,
    cost: 65.0,
    supplier: "TechCorp Inc.",
    status: "in-stock",
    lastUpdated: "2024-01-15",
    description: "High-quality wireless headphones with noise cancellation",
  },
  {
    id: "2",
    name: "Cotton T-Shirt - Blue",
    sku: "CTS-BLU-M",
    category: "Clothing",
    quantity: 8,
    price: 24.99,
    cost: 12.5,
    supplier: "Fashion Forward",
    status: "low-stock",
    lastUpdated: "2024-01-14",
    description: "100% cotton t-shirt in medium size",
  },
  {
    id: "3",
    name: "Office Desk Lamp",
    sku: "ODL-002",
    category: "Office Supplies",
    quantity: 0,
    price: 45.0,
    cost: 28.0,
    supplier: "Office Pro",
    status: "out-of-stock",
    lastUpdated: "2024-01-13",
    description: "LED desk lamp with adjustable brightness",
  },
  {
    id: "4",
    name: "Smartphone Case - Clear",
    sku: "SPC-CLR-001",
    category: "Electronics",
    quantity: 120,
    price: 19.99,
    cost: 8.5,
    supplier: "Mobile Accessories Ltd.",
    status: "in-stock",
    lastUpdated: "2024-01-12",
    description: "Transparent protective case for smartphones",
  },
  {
    id: "5",
    name: "Coffee Mug - Ceramic",
    sku: "CMG-CER-001",
    category: "Home & Kitchen",
    quantity: 25,
    price: 12.99,
    cost: 6.0,
    supplier: "Kitchen Essentials",
    status: "in-stock",
    lastUpdated: "2024-01-11",
    description: "White ceramic coffee mug, 12oz capacity",
  },
]

export function InventoryManagement() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(mockInventoryData)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(inventoryData.map((item) => item.category)))
    return cats.sort()
  }, [inventoryData])

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [inventoryData, searchTerm, categoryFilter, statusFilter])

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalItems = inventoryData.length
    const totalValue = inventoryData.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const lowStockItems = inventoryData.filter((item) => item.status === "low-stock").length
    const outOfStockItems = inventoryData.filter((item) => item.status === "out-of-stock").length

    return { totalItems, totalValue, lowStockItems, outOfStockItems }
  }, [inventoryData])

  const handleAddItem = (newItem: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString().split("T")[0],
    }
    setInventoryData((prev) => [...prev, item])
  }

  const handleEditItem = (updatedItem: InventoryItem) => {
    setInventoryData((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? { ...updatedItem, lastUpdated: new Date().toISOString().split("T")[0] } : item,
      ),
    )
    setEditingItem(null)
  }

  const handleDeleteItem = (id: string) => {
    setInventoryData((prev) => prev.filter((item) => item.id !== id))
    setDeletingItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your products and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              ${stats.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.outOfStockItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
          <CardDescription>Filter and search through your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, SKU, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventory Items</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {inventoryData.length} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable data={filteredData} onEdit={setEditingItem} onDelete={setDeletingItem} />
        </CardContent>
      </Card>

      {/* Modals */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        categories={categories}
      />

      {editingItem && (
        <EditInventoryModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onEdit={handleEditItem}
          item={editingItem}
          categories={categories}
        />
      )}

      {deletingItem && (
        <DeleteConfirmModal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={() => handleDeleteItem(deletingItem.id)}
          itemName={deletingItem.name}
        />
      )}
    </div>
  )
}
