import React from 'react'
import styles from './ButtonPrimary.module.css'
export default function ButtonPrimary({ children, onClick, disabled=false, className='' }){
  return <button className={[styles.button, className].join(' ')} onClick={onClick} disabled={disabled}>{children}</button>
}
