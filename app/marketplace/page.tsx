'use client'

import { useState } from 'react'

export default function Marketplace() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  
  const services = [
    { name: 'Administração de Condomínios', providers: 45, rating: '4.5', revenue: '750M €' },
    { name: 'Limpeza e Manutenção', providers: 32, rating: '4.3', revenue: '280M €' },
    { name: 'Manutenção de Elevadores', providers: 15, rating: '4.7', revenue: '335M €' },
    { name: 'Segurança e Vigilância', providers: 28, rating: '4.6', revenue: '225M €' },
    { name: 'Jardinagem', providers: 22, rating: '4.4', revenue: '93M €' },
    { name: 'Sistemas Hidráulicos', providers: 18, rating: '4.2', revenue: '75M €' },
  ]

  return (
    <div style={{ 
      background: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        <div style={{ 
          background: 'white',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h1 style={{ 
            marginBottom: '10px', 
            color: '#00032E',
            fontSize: '2.5rem'
          }}>Marketplace de Serviços</h1>
          <p style={{ 
            color: '#666', 
            marginBottom: '30px',
            fontSize: '1.2rem'
          }}>Encontre os melhores prestadores para o seu condomínio em Portugal</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {services.map((service, index) => (
              <div 
                key={index}
                style={{
                  padding: '30px',
                  border: '2px solid #00032E',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: hoveredCard === index ? '#00032E' : 'white',
                  color: hoveredCard === index ? '#C8A969' : '#00032E',
                  transform: hoveredCard === index ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: hoveredCard === index ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3 style={{ marginBottom: '15px', fontSize: '1.4rem' }}>{service.name}</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'inherit' }}>📊 {service.providers} prestadores</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Disponíveis</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'inherit' }}>⭐ {service.rating}/5</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Avaliação</div>
                  </div>
                </div>
                <div style={{
                  background: hoveredCard === index ? 'rgba(200, 169, 105, 0.3)' : 'rgba(200, 169, 105, 0.2)',
                  padding: '10px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  marginBottom: '15px',
                  color: hoveredCard === index ? '#C8A969' : '#00032E'
                }}>
                  <strong>Mercado: {service.revenue}</strong>
                </div>
                <button style={{
                  padding: '12px 20px',
                  background: '#C8A969',
                  color: '#00032E',
                  border: 'none',
                  borderRadius: '8px',
                  width: '100%',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  Ver Prestadores
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Market Stats */}
        <div style={{
          background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
          borderRadius: '15px',
          padding: '40px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#C8A969', marginBottom: '30px' }}>Mercado Português de Condomínios</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '2rem', color: '#C8A969', fontWeight: 'bold' }}>1.87B €</div>
              <div>Volume Total Anual</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', color: '#C8A969', fontWeight: 'bold' }}>6.347</div>
              <div>Empresas Ativas</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', color: '#C8A969', fontWeight: 'bold' }}>250k</div>
              <div>Condomínios</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', color: '#C8A969', fontWeight: 'bold' }}>44%</div>
              <div>Concentração Lisboa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
