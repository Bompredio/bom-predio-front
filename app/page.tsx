// components/App.tsx
'use client'

import React from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
/* outros imports... */

export default function App() {
  return (
    <ErrorBoundary>
      <main>
        <Home />
        {/* resto do app */}
      </main>
    </ErrorBoundary>
  )
}
