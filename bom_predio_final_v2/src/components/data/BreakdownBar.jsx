import React from 'react'
import styles from './BreakdownBar.module.css'
export default function BreakdownBar({ label, value=0 }) {
  return (
    <div className={styles.row}>
      <div className={styles.label}>{label}</div>
      <div className={styles.bar}><div className={styles.fill} style={{ width: Math.round(value*100)+'%' }} /></div>
      <div className={styles.percent}>{Math.round(value*100)}%</div>
    </div>
  )
}
