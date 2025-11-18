import React from 'react'
export default function RatingStars({ value=0, size=16 }){
  const full = Math.round(value)
  return (
    <div style={{display:'flex',gap:4,alignItems:'center'}}>
      {Array.from({length:5}).map((_,i)=> <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i<full?'#C8A969':'none'} stroke="#c4c4c4"><path d="M12 .587l3.668 7.431L23 9.75l-5.5 5.356L18.335 24 12 19.897 5.665 24 7.5 15.106 2 9.75l7.332-1.732z" /></svg>)}
    </div>
  )
}
