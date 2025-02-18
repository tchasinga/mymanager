import React, { useEffect, useState } from 'react'
import { Button, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Load from '../Loading/Load';
import SharingCard from './SharingCard';

export default function Dashboard() {
  const currentUser = useSelector((state) => state.user && state.user.user.currentUser);
  const [sharing , setSharing] = useState([]);
  const [loading, setLoading] = useState(false)
  const [sharingError, setsharingError] = useState(false) // Corrected this line
  
  useEffect(() => {
    const fetchingSharing = async () => {
      try {
        setLoading(true)
        const res = await fetch('http://localhost:5000/api/tasks/getusertask');
        const data = await res.json()
        if (data.success === false) {
          setsharingError(true);
          setLoading(false);
          return;
        }
        setSharing(data);
        setLoading(false);
        setsharingError(false);
      } catch (error) {
        setsharingError(true);
        setLoading(false);
      }
    }
    fetchingSharing();
  }, [])


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

      {/* up coming data result*/}
      {loading && <h1 className='flex justify-center items-center min-h-screen'><Load /></h1>}
       {sharingError && <h1 className='flex justify-center items-center min-h-screen'>We've facing an error kindly refresh your page</h1>}
        <div className="flex flex-wrap gap-4 justify-center max-w-full myhomeget mx-auto">
          {sharing.map((sharinglist) => (
            <div className="" key={sharinglist._id}>     
            <SharingCard key={sharinglist._id} sharinglist={sharinglist} />
            </div>
          ))}
          </div>
    </div>
  )
}
