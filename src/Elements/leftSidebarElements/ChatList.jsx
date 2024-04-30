import React, { useEffect, useState } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { AiOutlineMinus } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import avatar from "../../../public/avatar.png";
import AddUser from "./AddUser";
import { userStore } from "../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";

export default function ChatList() {
  const [addUserMode, setAddUserMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const addUserClick = () => {
    setAddUserMode(addUserMode ? false : true);
  };
  const { currentUser } = userStore();
  const { changeChat, chatId, user } = useChatStore();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userChat", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.recieverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((items) => {
      const { user, ...rest } = items;
      return rest;
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;
    const userChatRef = doc(db, "userChat", currentUser.id);
    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <>
      <div className="lg:px-3 lg:mt-5">
        <div className="lg:flex lg:items-center justify-between lg:pl-3">
          <div className="lg:w-[90%] lg:flex lg:relative lg:gap-4 lg:justify-evenly">
            <input
              type="text"
              placeholder="Search"
              className="lg:rounded-md lg:px-8 lg:bg-inherit lg:py-1 lg:flex-1 cursor-pointer"
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
              <FiSearch className="lg:text-2xl cursor-pointer" />
            </div>
          </div>

          <div className="lg:w-[10%]" onClick={addUserClick}>
            {addUserMode ? (
              <AiOutlineMinus className="lg:text-3xl cursor-pointer" />
            ) : (
              <MdOutlineAdd className="lg:text-3xl cursor-pointer" />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col my-5 mt-10 gap-8 overflow-y-scroll scroll-smooth scroll-m-1">
        {filteredChats.map((chat) => (
          <div
            className="lg:gap-3 border-b-2 border-slate-800 pb-3 flex-grow cursor-pointer rounded-md align-middle self-center flex-col"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "rgb(30 41 59)",
            }}
          >
            <div className="lg:flex lg:gap-3">
              <img
                src={chat.user.blocked.includes(currentUser.id) ? avatar : chat.user.avatar || avatar}
                className="lg:rounded-full lg:w-[10%] cursor-pointer"
              />
              <span className="lg:text-md lg:font-medium lg:flex lg:flex-col">
              {chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}
                <p className="text-slate-300 lg:ml-2 lg:text-sm">
                  {chat.lastMessage}
                </p>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
        {addUserMode && <AddUser />}
      </div>
    </>
  );
}
