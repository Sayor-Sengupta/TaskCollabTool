import React, { useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import { CiMenuBurger } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Modals } from "../utils/Modals";
import { CreateProjectModals } from "../utils/CreateProjectModal";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import { useAuthStore } from "../zustand/useAuth";
const Topbar = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const [modalVisible, setModalVisible] = React.useState(false);
  const navigate = useNavigate();
  const { logoutUser } = useAuthStore();

  const showLoading = () => {
    setModalVisible(true);
    // setTimeout(() => {
    //   setModalVisible(false);
    // }, 2000);
  };

  // const showDrawer = () => {
  //   setOpen(true);

  // };
  // const onClose = () => {
  //   setOpen(false);
  // };

  const logout = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/users/logout", {
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log("Logged out successfully");
        localStorage.removeItem("authUser");
        logoutUser();
        navigate("/login");
      }
    } catch (error) {
      console.log("Error in logout:", error.message);
    }
  };

  return (
    <>
      <div className="max-w-full h-20 px-5 py-3 bg-gray-800 flex flex-row justify-between ">
        {" "}
        <div className="mt-3 font-bold text-3xl text-white ml-10">ProjectFlow</div>
        <div className="flex flex-row gap-4">
          {" "}
          <div className=" flex flex-row gap-5 px-5 py-3">
            {/* <CiMenuBurger className="h-8 w-8 hover:bg-green-700 hover:rounded-full cursor-pointer p-1 text-white" /> */}
            <Link to="/">
              {/* <FaHome className="h-8 w-8 p-1  hover:bg-green-700 hover:rounded-full text-white" /> */}
              <h1 className="text-2xl hover:underline hover:underline-offset-8 hover:text-blue-100 text-cyan-600">Home</h1>
            </Link>
          </div>
          {/* <label
            className="input input-bordered h-10 flex items-center gap-2 mt-2 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-white bg-transparent
"
          >
            <input type="text" className="grow placeholder-white" placeholder="Search"  />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70 text-white"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label> */}
          {/* <CiCirclePlus
            className="h-10 w-10  hover:bg-green-700 hover:rounded-full cursor-pointer my-2 text-white"
           
          /> */}
          <h1  className="px-5 py-3 text-cyan-600 text-2xl hover:underline hover:underline-offset-8 hover:text-blue-100"  onClick={showLoading}>Create</h1>
          <h1  className="px-5 py-3 text-cyan-600 text-2xl hover:underline hover:underline-offset-8 hover:text-blue-100"  onClick={logout}>Logout</h1>
          {/* <IoIosLogOut
            className="h-10 w-12  hover:bg-green-700 hover:rounded-full cursor-pointer my-2 text-white"
           
          /> */}
        </div>
      </div>

      {/* <Drawer
      title="Basic Drawer"
      placement={placement}
      closable={true}
      onClose={onClose}
      open={open}
      key={placement}
      width= '200 '
      className="text-blue-800 "

    >
      
    </Drawer> */}
      <CreateProjectModals open={modalVisible} setOpen={setModalVisible} />

      <Outlet />
    </>
  );
};

export default Topbar;
