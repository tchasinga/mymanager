/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react'
import { FaReact } from "react-icons/fa";
export default function Navbars() {
  return (
    <div className='my-5'>
        <div className="flex items-center gap-3 flex-nowrap">
           <FaReact className='animate-spin duration-1000 text-[40px]'/>
           <h1 className='text-[20px] text-slate-800 font-light'>Mymanager</h1>
        </div>
        <div className=""></div>
    </div>
  )
}
