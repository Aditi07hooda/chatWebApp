import React from "react";
import avatar from "../../../public/avatar.png";
import { FaVideo } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { LiaEdit } from "react-icons/lia";
import { userStore } from "../../lib/userStore";

export default function UserInfo() {
  const { currentUser } = userStore();
  return (
    <div className="lg:flex lg:items-center lg:px-2 lg:my-2">
      <div className="lg:flex lg:w-3/4 lg:gap-3 lg:align-middle lg:items-center">
        <img src={currentUser.avatar || avatar} className="lg:rounded-full lg:w-[15%] cursor-pointer" />
        <h2 className="lg:text-xl lg:font-semibold">{currentUser.username}</h2>
      </div>
      {/* <div className="lg:flex lg:w-1/4 lg:justify-evenly">
        <FaVideo className="lg:text-2xl cursor-pointer" />
        <IoIosMore className="lg:text-2xl cursor-pointer" />
        <LiaEdit className="lg:text-2xl cursor-pointer" />
      </div> */}
    </div>
  );
}
