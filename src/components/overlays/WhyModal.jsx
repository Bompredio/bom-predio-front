import React from 'react'
import Modal from './Modal'
import BreakdownBar from '../data/BreakdownBar'
export default function WhyModal({ visible, onClose, profile }) {
  const breakdown = profile?.breakdown || { price:0.3, rating:0.2, complexity:0.15, location:0.1, services:0.15, tech:0.1 }
  return (
    <Modal visible={visible} onClose={onClose} title="Por que esta administradora apareceu aqui?">
      <p style={{color:'var(--text-secondary)'}}>{profile?.company_name} — score: {Math.round((profile?.score||0)*100)}%</p>
      <div style={{display:'grid',gap:8,marginTop:8}}>
        {Object.entries(breakdown).map(([k,v])=> <BreakdownBar key={k} label={k} value={v} />)}
      </div>
    </Modal>
  )
}
