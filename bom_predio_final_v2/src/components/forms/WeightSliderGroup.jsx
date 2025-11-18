import React from 'react'
import styles from './WeightSliderGroup.module.css'
export default function WeightSliderGroup({ weights, onChange }) {
  if(!weights) weights = {price:0.3,rating:0.2,complexity:0.15,location:0.1,services:0.15,tech:0.1}
  return (
    <div className={styles.wrap}>
      {Object.keys(weights).map(k=>(
        <div key={k} className={styles.row}>
          <div className={styles.label}>{k}</div>
          <input type="range" min="0" max="100" value={Math.round(weights[k]*100)} onChange={e=>onChange && onChange(k, Number(e.target.value)/100)} />
          <div className={styles.value}>{Math.round(weights[k]*100)}%</div>
        </div>
      ))}
    </div>
  )
}
