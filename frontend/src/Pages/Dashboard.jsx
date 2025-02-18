import React from 'react'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Dashboard() {


  return (
    <div className=''>
      <div className='flex justify-center items-center'>
        <Link to='/create'>
        <Button variant='contained' color='primary' className='my-5' >
          Create New Task
        </Button>
        </Link>
      </div>
    </div>
  )
}
