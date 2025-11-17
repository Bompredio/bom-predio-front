import React from 'react'
import Hero from '../ui/Hero'
import HowItWorks from '../ui/HowItWorks'
import ProviderList from '../ui/ProviderList'

export default function Marketplace(){
  return (
    <div>
      <Hero />
      <section style={{marginTop:20}}>
        <div className="card">
          <h2>Provedores em destaque</h2>
          <ProviderList />
        </div>
      </section>

      <section style={{marginTop:20}}>
        <HowItWorks />
      </section>
    </div>
  )
}
