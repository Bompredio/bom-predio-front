import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './providers/AuthProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bom Prédio - Plataforma de Gestão de Condomínios',
  description: 'Conectamos condomínios, administradoras e prestadores de serviços',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
