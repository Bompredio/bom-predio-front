'use client'
import { useState } from 'react'

export default function ERPDashboard() {
  const [activeButton, setActiveButton] = useState<string | null>(null)

  return (
    <div style={{ 
      background: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #00032E'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#00032E',
            fontSize: '2rem'
          }}>Dashboard ERP - Bom Prédio</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
            <button style={{
              padding: '10px 20px',
              background: '#00032E',
              color: '#C8A969',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>Perfil</button>
            <button style={{
              padding: '10px 20px',
              background: '#C8A969',
              color: '#00032E',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>Configurações</button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '25px', 
          marginBottom: '40px'
        }}>
          <div style={{
            padding: '25px', 
            background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)', 
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#C8A969' }}>Condomínios Ativos</h3>
            <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>12</p>
          </div>
          <div style={{
            padding: '25px', 
            background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)', 
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#C8A969' }}>Receita Mensal</h3>
            <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>€2.850</p>
          </div>
          <div style={{
            padding: '25px', 
            background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)', 
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#C8A969' }}>Próxima Assembleia</h3>
            <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>15/12</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Gestão de Condomínios */}
          <div>
            <h3 style={{ 
              color: '#00032E', 
              marginBottom: '25px',
              paddingBottom: '10px',
              borderBottom: '2px solid #C8A969'
            }}>Gestão de Condomínios</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {['Gestão Financeira', 'Documentos', 'Comunicação'].map((item) => (
                <button 
                  key={item}
                  style={{
                    padding: '20px',
                    border: '2px solid #00032E',
                    borderRadius: '10px',
                    textAlign: 'left',
                    background: activeButton === item ? '#00032E' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    color: activeButton === item ? '#C8A969' : '#00032E'
                  }}
                  onMouseOver={(e) => {
                    if (activeButton !== item) {
                      e.currentTarget.style.background = '#00032E'
                      e.currentTarget.style.color = '#C8A969'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeButton !== item) {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.color = '#00032E'
                    }
                  }}
                  onClick={() => setActiveButton(item)}
                >
                  <strong style={{ fontSize: '18px' }}>{item}</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    {item === 'Gestão Financeira' && 'Controle de receitas e despesas'}
                    {item === 'Documentos' && 'Armazenamento e gestão documental'}
                    {item === 'Comunicação' && 'Avisos e comunicados'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 style={{ 
              color: '#00032E', 
              marginBottom: '25px',
              paddingBottom: '10px',
              borderBottom: '2px solid #C8A969'
            }}>Marketplace</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {['Prestadores de Serviços', 'Solicitar Orçamentos', 'Avaliações'].map((item) => (
                <button 
                  key={item}
                  style={{
                    padding: '20px',
                    border: '2px solid #00032E',
                    borderRadius: '10px',
                    textAlign: 'left',
                    background: activeButton === item ? '#00032E' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    color: activeButton === item ? '#C8A969' : '#00032E'
                  }}
                  onMouseOver={(e) => {
                    if (activeButton !== item) {
                      e.currentTarget.style.background = '#00032E'
                      e.currentTarget.style.color = '#C8A969'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeButton !== item) {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.color = '#00032E'
                    }
                  }}
                  onClick={() => setActiveButton(item)}
                >
                  <strong style={{ fontSize: '18px' }}>{item}</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    {item === 'Prestadores de Serviços' && 'Encontrar e contratar serviços'}
                    {item === 'Solicitar Orçamentos' && 'Multiple quotes para serviços'}
                    {item === 'Avaliações' && 'Avaliar prestadores e serviços'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
