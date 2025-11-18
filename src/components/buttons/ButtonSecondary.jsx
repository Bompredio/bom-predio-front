import React from 'react'
import styles from './ButtonSecondary.module.css'
export default function ButtonSecondary({ children, onClick, className='' }){
  return <button className={[styles.button, className].join(' ')} onClick={onClick}>{children}</button>
}
