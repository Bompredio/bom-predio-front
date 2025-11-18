import React from 'react'
import styles from './CardAdmin.module.css'
import { Link } from 'react-router-dom'
export default function CardAdmin({ admin={}, onProfileClick, onContactClick }) {
  const { id, company_name, city, price_avg, rating_avg, description, services=[] } = admin
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.logo} aria-hidden></div>
        <div className={styles.info}>
          <h3 className={styles.title}>{company_name}</h3>
          <div className={styles.meta}>{city} · {price_avg || '—'} · {rating_avg ?? '—'} ★</div>
        </div>
        <div className={styles.score}>85%</div>
      </div>
      <div className={styles.services}>
        {services.slice(0,5).map(s => <span key={s} className={styles.tag}>{s}</span>)}
      </div>
      <div className={styles.actions}>
        <Link to={`/admin/${id}`} className={styles.link} onClick={()=>onProfileClick && onProfileClick(admin)}>Ver perfil</Link>
        <button className={styles.primary} onClick={()=>onContactClick && onContactClick(admin)}>Contactar</button>
      </div>
    </article>
  )
}
