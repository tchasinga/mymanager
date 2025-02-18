/* eslint-disable jsx-a11y/heading-has-content */
import React from "react";
import { FaReact } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Navbars() {
  return (
    <div className="my-5 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <FaReact className="animate-spin duration-1000 text-[40px]" />
        <h1 className="text-[20px] text-slate-800 font-light">Mymanager</h1>
      </div>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar>B</Avatar>
        <Typography variant="body1" className="text-slate-800">
          Balolebwami
        </Typography>
      </Stack>
    </div>
  );
}
