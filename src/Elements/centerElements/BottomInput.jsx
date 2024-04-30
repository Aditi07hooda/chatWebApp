import React, { useState } from "react";
import { FaImages } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";
import { BsEmojiWink } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { userStore } from "../../lib/userStore";
import { upload } from "../../lib/upload";

export default function BottomInput({ img, setImg }) {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");

  const { currentUser } = userStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const openEmojiBox = () => {
    setOpenEmoji(openEmoji ? false : true);
  };

  const handleEmojiText = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userChat", id);
        const userChatSnapShot = await getDoc(userChatRef);
        if (userChatSnapShot.exists()) {
          const userChatsData = userChatSnapShot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
    setImg({
      file: null,
      url: "",
    });
    setText("")
  };

  return (
    <div className="border-t-2 border-slate-800 pt-4">
      <div className="flex mx-2 my-2 gap-5">
        <div className="flex gap-2">
          <label htmlFor="file">
            <FaImages className="text-3xl cursor-pointer" />
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleImg}
          />
          {/* <FaCamera className="text-3xl cursor-pointer" />
          <FaMicrophoneLines className="text-3xl cursor-pointer" /> */}
        </div>
        <input
          type="text"
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send message" :"Type a message"}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          className="lg:rounded-md lg:px-5 lg:bg-slate-800 lg:py-1 lg:flex-1 cursor-pointer flex-grow"
        />
        <div className="flex gap-2">
          <div className="relative">
            <BsEmojiWink
              className="text-3xl cursor-pointer"
              onClick={openEmojiBox}
            />
            <div className="absolute bottom-8">
              <EmojiPicker open={openEmoji} onEmojiClick={handleEmojiText} />
            </div>
          </div>
          <button
            className="bg-inherit border-2 py-1 px-2 rounded-md hover:bg-slate-800 hover:text-white"
            onClick={handleSend}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
