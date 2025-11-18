import React from 'react'
import styles from './SearchBar.module.css'
export default function SearchBar({ placeholder='Pesquisar...', value='', onChange }) {
  return (
    <div className={styles.wrapper}>
      <input className={styles.input} placeholder={placeholder} value={value} onChange={e=>onChange && onChange(e.target.value)} />
      <button className={styles.icon} aria-hidden>🔍</button>
    </div>
  )
}
