import React, { useEffect, useRef, useState, useMemo } from "react";
import avatar from "../../../public/avatar.png";
import bg from "../../../public/bg.jpg";
import { useChatStore } from "../../lib/chatStore";
import { userStore } from "../../lib/userStore";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Timeago from "react-timeago";

export default function CenterMessageContent({ img }) {
  const endRef = useRef(null);

  const [chat, setChat] = useState();
  const { currentUser } = userStore();
  const { chatId } =
    useChatStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  // const formattedTime = useMemo(() => {
  //   return message.createdAt && Timeago(message.createdAt.toDate());
  // }, [message.createdAt]);

  return (
    <div className="flex flex-col flex-grow overflow-y-scroll mx-3">
      {chat?.messages?.map((message) =>
      
        message.senderId === currentUser?.id ? (
          <div
            className="flex gap-4 mt-4 flex-row-reverse"
            key={message?.createAt}
          >
            <div className="flex flex-col mt-4">
              <p className="bg-slate-500 py-3 px-3 rounded-md max-w-xl min-w-fit">
                {message.img && <img src={message.img} className="w-1/2 rounded-lg flex flex-row-reverse my-2" alt="" />}
                {message.text}
              </p>
              {/* <p className="lg:text-sm lg:font-lg text-slate-300 mt-2">{formattedTime}</p> */}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 mt-4 w-2/3" key={message?.createAt}>
            <div className="lg:w-[15%]">
              <img src={avatar} className="lg:rounded-full cursor-pointer" />
            </div>
            <div className="flex flex-col mt-4">
              <p className="bg-slate-900 py-3 px-3 rounded-md">
                {message.img && <img src={message.img} alt="" />}
                {message.text}
              </p>
              {/* <p className="lg:text-sm lg:font-lg text-slate-300 mt-2">{formattedTime}</p> */}
            </div>
          </div>
        )
      )}
      {img.url && (
        <div className="w-1/4 rounded-lg self-center my-2">
          <div className="texts">
            <img
              src={img.url}
              alt=""
              onError={(e) => {
                e.target.src = bg; // Set a placeholder image on error
              }}
            />
          </div>
        </div>
      )}
      <div ref={endRef}></div>
    </div>
  );
}
