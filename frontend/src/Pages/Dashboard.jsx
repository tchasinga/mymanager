import React from 'react'
import { Button, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Dashboard() {
  const currentUser = useSelector((state) => state.user && state.user.user.currentUser);


  return (
    <div className=''>
      <div className='flex justify-center items-center'>
        <Link to='/create'>
        <Button variant='contained' color='primary' className='my-5' >
          Create New Task
        </Button>
        </Link>
      </div>

      <div className='my-6'>
          <h1 className='text-xl text-slate-900'>{currentUser.user.username} here are your Task data</h1>
      </div>
      <Divider />
    </div>
  )
}
