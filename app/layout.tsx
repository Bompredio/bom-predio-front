export const metadata = {
  title: 'Bom Prédio - Marketplace para Condomínios',
  description: 'Conectamos condomínios, administradoras e prestadores em Portugal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <nav style={{
          padding: '15px 20px', 
          background: '#00032E', 
          color: '#C8A969',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>🏢 Bom Prédio</h1>
            <div style={{ marginLeft: '40px', display: 'flex', gap: '25px' }}>
              <a href="/marketplace" style={{ color: '#C8A969', textDecoration: 'none', fontSize: '16px' }}>Marketplace</a>
              <a href="/erp" style={{ color: '#C8A969', textDecoration: 'none', fontSize: '16px' }}>ERP</a>
              <a href="/assembleias" style={{ color: '#C8A969', textDecoration: 'none', fontSize: '16px' }}>Assembleias</a>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
              <a href="/login" style={{ color: '#C8A969', textDecoration: 'none', fontSize: '16px' }}>Entrar</a>
              <a href="/cadastro" style={{
                background: '#C8A969', 
                color: '#00032E', 
                padding: '8px 16px', 
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>Cadastrar</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
