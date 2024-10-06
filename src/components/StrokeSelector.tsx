import React, { Dispatch, SetStateAction } from 'react'

type Props = {
    setcurrentStroke: Dispatch<SetStateAction<number>>
}
function StrokeSelector({setcurrentStroke}: Props) {
    const strokeHandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setcurrentStroke(+e.target.value);
        console.log(e.target.value)
    }
  return (
    <input type='range' min={5} max={10} onChange={(e)=>strokeHandler(e)}  
    className='w-20 h-10 absolute top-[4rem] left-[4rem]  myin'
    />
  )
}

export default StrokeSelector