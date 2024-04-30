import React from "react";
import avatar from "../../../public/avatar.png";
import { FaVideo } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { userStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";

export default function TopUserDetails() {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  return (
    <div className="border-b-2 border-slate-800">
      <div className="lg:flex lg:items-center lg:px-2 lg:my-2">
        <div className="lg:flex lg:w-3/4 lg:gap-3 lg:align-middle lg:items-center">
          <img
            src={user?.avatar || avatar}
            className="lg:rounded-full lg:w-[10%] cursor-pointer"
          />
          <div className="flex flex-col">
            <h2 className="lg:text-xl lg:font-semibold">{user?.username}</h2>
            <p className="lg:text-sm lg:font-lg text-slate-300">
              Hey!! I am on chatApp
            </p>
          </div>
        </div>
        {/* <div className="lg:flex lg:w-1/4 lg:justify-evenly">
          <IoIosCall className="lg:text-2xl cursor-pointer" />
          <FaVideo className="lg:text-2xl cursor-pointer" />
          <FaInfoCircle className="lg:text-2xl cursor-pointer" />
        </div> */}
      </div>
    </div>
  );
}
