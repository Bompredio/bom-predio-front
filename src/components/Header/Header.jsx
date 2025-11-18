import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import Logo from '../../assets/logo/logo_primary.svg'

export default function Header(){
  return (
    <nav className='header-nav'>
      <Link to='/' style={{display:'flex',alignItems:'center',gap:12}}>
        <img src={Logo} alt='Bom Predio' style={{height:28}}/>
        <span>Bom Prédio</span>
      </Link>
      <div style={{marginLeft:12}}>
        <Link to='/compare' style={{marginRight:12}}>Comparar</Link>
        <Link to='/'>Marketplace</Link>
      </div>
    </nav>
  )
}
