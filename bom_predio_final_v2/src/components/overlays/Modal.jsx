import React from 'react'
import styles from './Modal.module.css'
export default function Modal({ visible, onClose, title, children }) {
  if(!visible) return null
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{margin:0}}>{title}</h3>
          <button onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div style={{marginTop:12}}>{children}</div>
      </div>
    </div>
  )
}
