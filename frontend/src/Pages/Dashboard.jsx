import React, { useEffect, useState } from 'react';
import { Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Load from '../Loading/Load';

export default function Dashboard() {
  const currentUser = useSelector((state) => state.user && state.user.user.currentUser);
  const [showSharingErrors, setshowSharingErrors] = useState(false);
  const [userSharing, setUserSharings] = useState([]);
  const [loadingWhilefetchingData, setLoadingWhilefetchingData] = useState(false);

  // Showing all data which was created by the specific user
  const handlerShowSharing = async () => {
    try {
      setLoadingWhilefetchingData(true);
      setshowSharingErrors(false);
      const res = await fetch(`http://localhost:5000/api/tasks/getusertask/${currentUser?.user?._id}`);
      const data = await res.json();
      console.log('Response data:', data); // Added console log for response data
      if (data.success === true) {
        setUserSharings(data.data); // Correctly set the userSharing state
        setshowSharingErrors(false);
      } else {
        setshowSharingErrors(true);
      }
      setLoadingWhilefetchingData(false);
    } catch (error) {
      console.error('Error fetching user tasks:', error); // Added console log for errors
      setshowSharingErrors(true);
      setLoadingWhilefetchingData(false);
    }
  };

  return (
    <div className=''>
      <div className='flex justify-center items-center'>
        <Link to='/create'>
          <Button variant='contained' color='primary' className='my-5'>
            Create New Task
          </Button>
        </Link>

        <Button variant='contained' color='primary' className='my-5' onClick={handlerShowSharing}>
          See your task
        </Button>
      </div>

      <div className='my-6'>
        <h1 className='text-xl text-slate-900'>{currentUser?.user?.username} here are your Task data</h1>
      </div>
      <Divider />

      {loadingWhilefetchingData && <h1 className='flex justify-center items-center min-h-screen'><Load /></h1>}
      {showSharingErrors && <h1 className='flex justify-center items-center min-h-screen'>We've facing an error kindly refresh your page</h1>}
      <div className="flex flex-wrap gap-4 justify-center max-w-full myhomeget mx-auto">
        {userSharing && userSharing.map((item) => {
            <div className="sharing-card" key={item._id}>
              <h1 className='text-black'>{item.title}</h1>
              <p>{item.description}</p>
              {item.imageUrls && item.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={item.title} className="sharing-image" />
              ))}
            </div>
        })}
      </div>
    </div>
  );
}