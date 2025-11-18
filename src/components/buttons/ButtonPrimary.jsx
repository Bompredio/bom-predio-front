import React from 'react'
import './ButtonPrimary.css'
export default function ButtonPrimary({children, onClick, className=''}){
  return <button className={'btn btn-primary '+className} onClick={onClick}>{children}</button>
}
