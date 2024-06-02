import React from 'react'
import Avatar from 'react-avatar'
interface Iclient{
    userName:string
}
const Client:React.FC<Iclient> = ({userName}) => {
  return (
    <div className='client'>
       <Avatar name={userName} size='50px' round = "14px"  />
      <span className="userName">{userName}</span>      
    </div>
  )
}

export default Client
