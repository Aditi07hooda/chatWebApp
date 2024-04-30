import React, { useState } from "react";
import TopUserDetails from "../Elements/centerElements/TopUserDetails";
import CenterMessageContent from "../Elements/centerElements/CenterMessageContent";
import BottomInput from "../Elements/centerElements/BottomInput";

export default function Center() {

  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  return (
    <div className="w-1/2 flex flex-col">
      <TopUserDetails />
      <CenterMessageContent img={img} />
      <BottomInput img={img} setImg={setImg} />
    </div>
  );
}
