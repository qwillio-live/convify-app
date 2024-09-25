"use client"
import { useRef } from "react"
import { Provider } from "react-redux"

import { AppNoPersistStore, makeNoPersistStore } from "./flows-state/store"

// Create a StoreProvider component for non-persistent store
export default function StoreProviderNonPersist({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppNoPersistStore>()

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeNoPersistStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
