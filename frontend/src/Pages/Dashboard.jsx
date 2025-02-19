import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardMedia, Divider, Typography, IconButton } from '@mui/material';
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Load from '../Loading/Load';
import { FaPencilAlt } from "react-icons/fa";
import { format } from 'date-fns';

export default function Dashboard() {
  const currentUser = useSelector((state) => state.user && state.user.user.currentUser);
  const [showSharingErrors, setShowSharingErrors] = useState(false);
  const [userSharing, setUserSharings] = useState([]);
  const [loadingWhileFetchingData, setLoadingWhileFetchingData] = useState(false);

  // Showing all data which was created by the specific user
  const fetchUserTasks = async () => {
    try {
      setLoadingWhileFetchingData(true);
      setShowSharingErrors(false);
      const res = await fetch(`http://localhost:5000/api/tasks/getusertask/${currentUser.user._id}`);
      const data = await res.json();
      console.log('Response data:', data); // Added console log for response data
      if (data.success === true) {
        setUserSharings(data.data); // Correctly set the userSharing state
        setShowSharingErrors(false);
      } else {
        setShowSharingErrors(true);
      }
      setLoadingWhileFetchingData(false);
    } catch (error) {
      console.error('Error fetching user tasks:', error); // Added console log for errors
      setShowSharingErrors(true);
      setLoadingWhileFetchingData(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/deletetask/${taskId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === true) {
        setUserSharings(userSharing.filter(task => task._id !== taskId));
        console.log('Task deleted successfully');
      } else {
        console.error('Error deleting task:', data.message);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchUserTasks();
  }, []); // Empty dependency array to run only once

  // Deleting the Sharing Information
  const handlerListingDelete = async (sharingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/delete/${sharingId}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === true) {
        console.log(data.success);
        return;
      }
      setUserSharings((prev) => prev.filter((item) => item._id !== sharingId));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className=''>
      <div className='flex justify-center items-center'>
        <Link to='/create'>
          <Button variant='contained' color='primary' className='my-5'>
            Create New Task
          </Button>
        </Link>
      </div>

      <div className='my-6'>
         <h1 className='text-slate-800 text-xl'>{currentUser.user.username}, here are your Task data</h1>
      </div>
      <Divider />

      {loadingWhileFetchingData && <h1 className='flex justify-center items-center min-h-screen'><Load /></h1>}
      {showSharingErrors && <h1 className='flex justify-center items-center min-h-screen'>Create some to do</h1>}
      <div className="thegrdi mt-5">
        {userSharing && userSharing.map((item) => {
          return (
            <Card className="sharing-card" key={item._id} sx={{ maxWidth: 345, margin: '0.5rem' }}>
              {item.imageUrls && item.imageUrls.map((url, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  height="140"
                  image={url}
                  alt={item.title}
                  className="sharing-image"
                />
              ))}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" className='font-semibold text-slate-900'>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" className='font-light'>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" className='font-light'>
                  Status: {item.status}
                </Typography>
                <Typography variant="body2" color="textSecondary" className='font-light'>
                  Created At: {format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </Typography>
                <Typography variant="body2" color="textSecondary" className='font-light'>
                  Updated At: {format(new Date(item.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                </Typography>
                <div className="flex items-center justify-between">
                <IconButton onClick={() => handlerListingDelete(item._id)} aria-label="delete" color="secondary">
                  <MdDelete />
                </IconButton>

                <Link to={`/updating-sharing/${item._id}`}>
                  <IconButton aria-label="update" color="primary">
                    <FaPencilAlt />
                  </IconButton>
                </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}