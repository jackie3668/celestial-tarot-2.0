import React from 'react'

const Shuffle = ({ question, design, spread}) => {
  return (
    <div className='shuffle'>
      <p>{question}</p>
      <p>{design}</p>
      <p>{spread}</p>
    </div>
  )
}

export default Shuffle