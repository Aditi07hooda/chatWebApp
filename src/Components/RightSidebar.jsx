import React from "react";
import TopUserInfo from "../Elements/rightSidebarElements/TopUserInfo";
import CenterUserSetting from "../Elements/rightSidebarElements/CenterUserSetting";
import BottomUserBtn from "../Elements/rightSidebarElements/BottomUserBtn";

export default function RightSidebar() {
  return (
    <div className="w-1/4 border-l-2 border-slate-800 flex flex-col">
      <TopUserInfo />
      <CenterUserSetting />
      <BottomUserBtn />
    </div>
  );
}
