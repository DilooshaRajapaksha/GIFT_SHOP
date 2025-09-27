import React from 'react'
import AddItems from '../../Components/Additems/Additems'
import GiftBoxPreview from '../../Components/Giftboxpreview/Giftboxpreview';

function Buildown() {

    const items = [];           // or fetched/selected items
  const total = 0;

  return (
    <>
    <div><AddItems /></div>
    <GiftBoxPreview items={items} total={total} onCheckout={()=>alert("Checkout")} />
     </> 
  )
}

export default Buildown