import useColorPicker from '@/hooks/useColorPicker';
import React, { Dispatch, SetStateAction, useState } from 'react'

type Props = {
    currentColor: string,
    setcurrentColor: Dispatch<SetStateAction<string>>
}

function ColorPicker({currentColor, setcurrentColor}: Props) {
    const handleColorPick = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setcurrentColor(e.target.value);
    }
  return (
    <input type="color" onChange={(e)=>handleColorPick(e)} className='w-20 h-10 absolute top-[4rem] right-[4rem]'/>
  )
}

export default ColorPicker