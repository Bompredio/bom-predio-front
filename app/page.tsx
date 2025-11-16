import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-primary-navy text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-gold">Bom Prédio</h1>
          <nav className="flex space-x-4">
            <Link href="/auth/login" className="text-white hover:text-primary-gold transition-colors">
              Entrar
            </Link>
            <Link href="/auth/signup" className="btn-secondary">
              Cadastrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">
          A plataforma que <span className="text-primary-gold">revoluciona</span> a gestão de condomínios
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Conectamos condomínios, administradoras e prestadores de serviços em uma única plataforma digital.
        </p>
        <div className="space-x-4">
          <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
            Começar agora
          </Link>
          <Link href="/marketplace" className="btn-secondary text-lg px-8 py-3">
            Explorar marketplace
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2 text-primary-navy">Para Condomínios</h3>
            <p className="text-gray-600">
              Encontre a administradora ideal e gerencie seu condomínio com transparência.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold mb-2 text-primary-navy">Para Administradoras</h3>
            <p className="text-gray-600">
              Mostre seus serviços e conecte-se com condomínios que precisam de gestão profissional.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-2 text-primary-navy">Para Prestadores</h3>
            <p className="text-gray-600">
              Ofereça seus serviços e seja contratado por administradoras e condomínios.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
