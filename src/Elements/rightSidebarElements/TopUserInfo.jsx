import React from 'react'
import avatar from "../../../public/avatar.png";
import { userStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';

export default function TopUserInfo() {
  const { currentUser } = userStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  return (
    <div className='border-slate-800 border-b-2 my-2 py-3'>
      <div className="lg:flex lg:flex-col lg:gap-3 lg:align-middle lg:items-center">
          <img
            src={user?.avatar || avatar}
            className="lg:rounded-full lg:w-[25%] cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <h1 className="lg:text-2xl lg:font-semibold">{user?.username}</h1>
            <p className="lg:text-sm lg:font-lg text-slate-300">Hey!! I am on chatApp</p>
          </div>
        </div>
    </div>
  )
}
