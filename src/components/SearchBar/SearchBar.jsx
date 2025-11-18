import React from 'react'
import './SearchBar.css'
export default function SearchBar({placeholder='Pesquisar...'}){
  return (
    <div className='searchbar'>
      <input className='input' placeholder={placeholder} />
    </div>
  )
}
