import React, { useEffect, useState } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { AiOutlineMinus } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import avatar from "../../../public/avatar.png";
import AddUser from "./AddUser";
import { userStore } from "../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";

export default function ChatList() {
  const [addUserMode, setAddUserMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const addUserClick = () => {
    setAddUserMode(!addUserMode);
  };
  const { currentUser } = userStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userChat", currentUser.id), async (res) => {
      const items = res.data()?.chats || [];
      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        return { ...item, user };
      });
      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => unsub();
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((items) => {
      const { user, ...rest } = items;
      return rest;
    });
    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
    userChats[chatIndex].isSeen = true;
    const userChatRef = doc(db, "userChat", currentUser.id);
    try {
      await updateDoc(userChatRef, { chats: userChats });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <>
      <div className="px-4 py-2 bg-gray-800 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              onChange={(e) => setInput(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="ml-4">
            {addUserMode ? (
              <AiOutlineMinus
                className="text-2xl cursor-pointer hover:text-gray-400"
                onClick={addUserClick}
              />
            ) : (
              <MdOutlineAdd
                className="text-2xl cursor-pointer hover:text-gray-400"
                onClick={addUserClick}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col my-5 gap-4 overflow-y-auto bg-gray-900 text-white p-4">
        {filteredChats.map((chat) => (
          <div
            className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-800"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat.isSeen ? "transparent" : "rgba(30, 41, 59, 0.7)",
            }}
          >
            <img
              src={chat.user.blocked.includes(currentUser.id) ? avatar : chat.user.avatar || avatar}
              className="w-12 h-12 rounded-full"
              alt="User Avatar"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</h3>
              <p className="text-gray-400">{chat.lastMessage || "No message yet"}</p>
            </div>
          </div>
        ))}
      </div>

      {addUserMode && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <AddUser />
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          onClick={() => auth.signOut()}
        >
          Log Out
        </button>
      </div>
    </>
  );
}
