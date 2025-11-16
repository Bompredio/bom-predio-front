import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-navy text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-gold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        <p className="text-lg mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="space-x-4">
          <Link href="/" className="btn-primary">
            Voltar para o início
          </Link>
          <Link href="/marketplace" className="btn-secondary">
            Ir para o Marketplace
          </Link>
        </div>
      </div>
    </div>
  )
}
