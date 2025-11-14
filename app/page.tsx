export default function Home() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)', minHeight: '100vh', color: 'white' }}>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold' }}>
            Transforme a gestão do seu <span style={{ color: '#C8A969' }}>condomínio</span>
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#C8A969', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Marketplace transparente + ERP integrado para condomínios em Portugal
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              padding: '15px 30px', 
              background: '#C8A969', 
              color: '#00032E', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Começar Agora
            </button>
            <button style={{
              padding: '15px 30px', 
              background: 'transparent', 
              color: '#C8A969', 
              border: '2px solid #C8A969', 
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Explorar Marketplace
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px', 
          marginTop: '60px',
          padding: '40px 0'
        }}>
          <div style={{
            padding: '40px 30px', 
            background: 'rgba(200, 169, 105, 0.1)', 
            border: '1px solid rgba(200, 169, 105, 0.3)', 
            borderRadius: '15px', 
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏢</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#C8A969' }}>Marketplace Transparente</h3>
            <p style={{ color: '#e0e0e0', lineHeight: '1.6' }}>Encontre administradoras e prestadores com avaliações reais e preços transparentes</p>
          </div>

          <div style={{
            padding: '40px 30px', 
            background: 'rgba(200, 169, 105, 0.1)', 
            border: '1px solid rgba(200, 169, 105, 0.3)', 
            borderRadius: '15px', 
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#C8A969' }}>ERP Integrado</h3>
            <p style={{ color: '#e0e0e0', lineHeight: '1.6' }}>Gerencie finanças, documentos e comunicação do seu condomínio em uma plataforma única</p>
          </div>

          <div style={{
            padding: '40px 30px', 
            background: 'rgba(200, 169, 105, 0.1)', 
            border: '1px solid rgba(200, 169, 105, 0.3)', 
            borderRadius: '15px', 
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎥</div>
            <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#C8A969' }}>Assembleias Virtuais</h3>
            <p style={{ color: '#e0e0e0', lineHeight: '1.6' }}>Realize assembleias e votações online com validade jurídica e participação remota</p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ 
          background: 'rgba(200, 169, 105, 0.1)', 
          padding: '50px', 
          borderRadius: '15px', 
          marginTop: '60px',
          border: '1px solid rgba(200, 169, 105, 0.3)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#C8A969', marginBottom: '40px', fontSize: '2rem' }}>O Mercado em Portugal</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', color: '#C8A969', fontWeight: 'bold' }}>1.87B €</div>
              <div style={{ color: '#e0e0e0' }}>Volume Anual</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', color: '#C8A969', fontWeight: 'bold' }}>6.347</div>
              <div style={{ color: '#e0e0e0' }}>Prestadores</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', color: '#C8A969', fontWeight: 'bold' }}>250k</div>
              <div style={{ color: '#e0e0e0' }}>Condomínios</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', color: '#C8A969', fontWeight: 'bold' }}>44%</div>
              <div style={{ color: '#e0e0e0' }}>Concentração Lisboa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
