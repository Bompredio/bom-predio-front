import React from 'react'
import App from '../components/App.tsx'
import X from '@/components/ui/sonner'
import Tooltip from '@/components/ui/tooltip'
import NotFound from '@/pages/NotFound'
import { ThemeProvider } from './contexts/ThemeContext'
import Home from './pages/Home'

export default function Page(){
  return <div style={{padding:24}}><App/></div>
}
