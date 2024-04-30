import React from 'react'
import UserInfo from '../Elements/leftSidebarElements/UserInfo'
import ChatList from '../Elements/leftSidebarElements/ChatList'

export default function LeftSidebar() {
  return (
    <div className='w-1/4 flex flex-col border-r-2 border-slate-800'>
      <UserInfo />
      <ChatList className="flex-grow" />
    </div>
  )
}
