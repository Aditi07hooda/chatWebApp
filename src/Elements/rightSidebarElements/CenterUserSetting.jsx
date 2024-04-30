import React, { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import bg from "../../../public/bg.jpg";
import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import download from "downloadjs";

export default function CenterUserSetting() {
  const [arrowUp, setArrowUp] = useState([false, false, false, false, false]);
  const [chat, setChat] = useState();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleArrowUp = (index) => {
    const updatedState = arrowUp.map((state, i) =>
      i === index ? !state : false
    );
    setArrowUp(updatedState);
  };

  return (
    <>
      <div className="my-1">
        <div className="mx-2">
          <div className="flex flex-col gap-5">
            {["Shared Photos"].map((setting, index) => (
              <div key={index} className="flex justify-between cursor-default">
                <span>{setting}</span>
                <div
                  className="bg-slate-700 hover:bg-slate-900 rounded-full p-1"
                  onClick={() => handleArrowUp(index)}
                >
                  {arrowUp[index] ? (
                    <IoIosArrowDown className="text-xl font-bold cursor-pointer" />
                  ) : (
                    <IoIosArrowUp className="text-xl font-bold cursor-pointer" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {arrowUp[0] && (
        <div className="flex flex-grow flex-col gap-3 overflow-y-auto my-1 mx-2">
          <div className="">
            {chat?.messages?.map((message) => (
              <div
                className="flex justify-between space-y-6 flex-grow"
                key={message?.createAt}
              >
                {message.img && (
                  <img
                    src={message.img}
                    className="lg:rounded-md lg:w-[25%] cursor-pointer"
                  />
                )}
                {/* {message.img && (
                  <div className="bg-slate-700 hover:bg-slate-900 rounded-full p-2">
                    <FaDownload
                      className="text-md font-bold cursor-pointer"
                      onClick={() => {
                        fetch(message.img)
                          .then((res) => res.blob())
                          .then((blob) => {
                            download(blob, message.img.split("/").pop());
                          });
                      }}
                    />
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
