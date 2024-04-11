"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import CreateNewFlow from "@/components/products"

const MainDashboard = () => {
  const [openCreateFlow, setOpenCreatedFlow] = useState(false)
  const handleOpenCreateFlow = () => {
    setOpenCreatedFlow(true)
  }

  return (
    <main className="flex flex-1 flex-col p-4 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-lg">My workspace</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        {openCreateFlow ? (
          <CreateNewFlow />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no products
            </h3>
            <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a product.
            </p>
            <Button className="mt-4" onClick={handleOpenCreateFlow}>
              Add Product
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}

export default MainDashboard
