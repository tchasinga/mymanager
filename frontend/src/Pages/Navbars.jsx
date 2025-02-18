import React from "react";
import { FaReact } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Stack, Typography, Button } from "@mui/material";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from "../redux/user/userSlice.js";
import toast from "react-hot-toast";

export default function Navbars() {
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Get the current logged-in user
  const currentUser = useSelector((state) => state.user?.user?.currentUser);
  const username = currentUser?.user?.username || null;

  const handlerSingout = async() => {
      try {

        dispatch(signOutUserStart());
        setIsLoggingOut(true);
        const res = await fetch(`http://localhost:5000/apis/auth/logout`)
        const data = await res.json();
    
        if(data.success === false) {
          dispatch(signOutUserFailure(data.message));
          toast.error(data.message);
          setIsLoggingOut(false);
          return;
        }
        dispatch(signOutUserSuccess(data));
        toast.success(data.message);
      } catch (error) {
        console.error(error);
        dispatch(signOutUserFailure(error.message));
      }
    }

  return (
    <div className="my-5 flex justify-between items-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <FaReact className="animate-spin duration-1000 text-[40px] text-blue-500" />
        <h1 className="text-[20px] text-slate-800 font-light">Mymanager</h1>
      </div>

      {/* User Info & Logout Button */}
      {currentUser && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
          <Typography variant="body1" className="text-slate-800 font-medium">
           Welcome, {username}
          </Typography>
          <Button variant="contained" color="inherit" onClick={handlerSingout}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </Stack>
      )}
    </div>
  );
}
