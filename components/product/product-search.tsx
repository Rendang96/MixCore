"use client"

import { useState, useEffect } from "react"
// Update imports to reflect new file structure
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductListing } from "@/components/product/product-listing"
import { AddProduct } from "@/components/product/add-product"
import { ViewProduct } from "@/components/product/view-product"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { getProducts, saveProducts } from "@/lib/product/product-storage"
import { FileText } from "lucide-react"

export interface Product {
  id: string
  name: string
  code: string
  type?: string
  payor?: string
  status: string
}

export function ProductSearch() {
  const [view, setView] = useState<"search" | "add" | "view" | "edit" | "results">("search")
  const [productName, setProductName] = useState("")
  const [productCode, setProductCode] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Handle URL paths and browser history
  useEffect(() => {
    // Parse the current URL to determine the view
    const path = window.location.pathname
    if (path.includes("/product/add")) {
      setView("add")
    } else if (path.includes("/product/edit")) {
      setView("edit")
      // Extract ID from URL and set selected product
      const id = path.split("/").pop()
      if (id) {
        const product = products.find((p) => p.id === id)
        if (product) setSelectedProduct(product)
      }
    } else if (path.includes("/product/view")) {
      setView("view")
      // Extract ID from URL and set selected product
      const id = path.split("/").pop()
      if (id) {
        const product = products.find((p) => p.id === id)
        if (product) setSelectedProduct(product)
      }
    } else if (path.includes("/product/results")) {
      setView("results")
      setSearchPerformed(true)
    } else if (path.includes("/product")) {
      setView("search")
    }

    // Handle browser back/forward navigation
    const handlePopState = () => {
      const newPath = window.location.pathname
      if (newPath.includes("/product/add")) {
        setView("add")
      } else if (newPath.includes("/product/edit")) {
        setView("edit")
        // Extract ID from URL and set selected product
        const id = newPath.split("/").pop()
        if (id) {
          const product = products.find((p) => p.id === id)
          if (product) setSelectedProduct(product)
        }
      } else if (newPath.includes("/product/view")) {
        setView("view")
        // Extract ID from URL and set selected product
        const id = newPath.split("/").pop()
        if (id) {
          const product = products.find((p) => p.id === id)
          if (product) setSelectedProduct(product)
        }
      } else if (newPath.includes("/product/results")) {
        setView("results")
        setSearchPerformed(true)
      } else if (newPath.includes("/product")) {
        setView("search")
        setSearchPerformed(false)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [products])

  // Load products on component mount
  useEffect(() => {
    const loadedProducts = getProducts()
    setProducts(loadedProducts)
  }, [])

  const handleSearch = () => {
    let filtered = [...products]

    if (productName) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(productName.toLowerCase()))
    }

    if (productCode) {
      filtered = filtered.filter((product) => product.code.toLowerCase().includes(productCode.toLowerCase()))
    }

    setFilteredProducts(filtered)
    setSearchPerformed(true)
    setView("results")
    window.history.pushState({}, "", "/product/results")
  }

  const handleAddNew = () => {
    setView("add")
    window.history.pushState({}, "", "/product/add")
  }

  const handleSaveProduct = (product: Product) => {
    // Check if product already exists (for edit)
    const existingProductIndex = products.findIndex((p) => p.id === product.id)

    let updatedProducts: Product[]

    if (existingProductIndex >= 0) {
      // Update existing product
      updatedProducts = [...products]
      updatedProducts[existingProductIndex] = product
    } else {
      // Add new product
      updatedProducts = [...products, product]
    }

    setProducts(updatedProducts)
    saveProducts(updatedProducts)
    setView("results")
    setSearchPerformed(true)
    setFilteredProducts(updatedProducts)
    window.history.pushState({}, "", "/product/results")
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setView("view")
    window.history.pushState({}, "", `/product/view/${product.id}`)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setView("edit")
    window.history.pushState({}, "", `/product/edit/${product.id}`)
  }

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter((product) => product.id !== productId)
    setProducts(updatedProducts)
    saveProducts(updatedProducts)
    setFilteredProducts(updatedProducts)
  }

  const handleBack = () => {
    setView("search")
    window.history.pushState({}, "", "/product")
  }

  // Generate breadcrumb items based on current view
  const getBreadcrumbItems = () => {
    const baseItems = [
      {
        label: "Home",
        href: "/",
        isHome: true,
      },
      {
        label: "Product",
        href: "/product",
        onClick: () => {
          setView("search")
          setSearchPerformed(false)
          window.history.pushState({}, "", "/product")
        },
      },
    ]

    if (view === "search") {
      return [...baseItems]
    } else if (view === "results") {
      return [...baseItems, { label: "Product Listing" }]
    } else if (view === "add") {
      return [...baseItems, { label: "Add New Product" }]
    } else if (view === "view") {
      return [
        ...baseItems,
        {
          label: "Product Listing",
          href: "/product/results",
          onClick: () => {
            setView("results")
            setSearchPerformed(true)
            window.history.pushState({}, "", "/product/results")
          },
        },
        { label: "View Product" },
      ]
    } else if (view === "edit") {
      return [
        ...baseItems,
        {
          label: "Product Listing",
          href: "/product/results",
          onClick: () => {
            setView("results")
            setSearchPerformed(true)
            window.history.pushState({}, "", "/product/results")
          },
        },
        { label: "Edit Product" },
      ]
    }

    return baseItems
  }

  if (view === "add") {
    return (
      <div className="space-y-6">
        <PageBreadcrumbs items={getBreadcrumbItems()} />
        <AddProduct onSave={handleSaveProduct} onCancel={handleBack} />
      </div>
    )
  }

  if (view === "edit" && selectedProduct) {
    return (
      <div className="space-y-6">
        <PageBreadcrumbs items={getBreadcrumbItems()} />
        <AddProduct onSave={handleSaveProduct} onCancel={handleBack} initialProduct={selectedProduct} />
      </div>
    )
  }

  if (view === "view" && selectedProduct) {
    return (
      <div className="space-y-6">
        <PageBreadcrumbs items={getBreadcrumbItems()} />
        <ViewProduct product={selectedProduct} onBack={handleBack} onEdit={() => handleEditProduct(selectedProduct)} />
      </div>
    )
  }

  // Search form component - reused in both search and results views
  const SearchForm = () => (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Product Search</h2>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="product-name" className="text-sm font-medium text-slate-700">
              Product Name
            </label>
            <Input
              id="product-name"
              placeholder="Enter Product Name"
              className="w-full"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="product-code" className="text-sm font-medium text-slate-700">
              Product Code
            </label>
            <Input
              id="product-code"
              placeholder="Enter Product Code"
              className="w-full"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleAddNew}>
            Add New
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={getBreadcrumbItems()} />

      <SearchForm />

      {view === "results" && (
        <>
          {products.length === 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Product Listing</h2>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>No product has been created.</p>
                </div>
              </div>
            </div>
          )}

          {products.length > 0 && (
            <ProductListing
              products={filteredProducts}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
        </>
      )}
    </div>
  )
}
