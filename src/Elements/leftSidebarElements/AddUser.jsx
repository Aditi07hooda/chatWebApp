import React, { useState } from "react";
import avatar from "../../../public/avatar.png";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { userStore } from "../../lib/userStore";

export default function AddUser() {
  const [user, setUser] = useState(null);

  const { currentUser } = userStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        querySnapShot.forEach((doc) => {
          setUser(doc.data()); // Accessing the data of the first document returned by the query
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddUser = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userChat");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          recieverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          recieverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="absolute bg-slate-500 py-3 px-3 rounded-lg">
        <form className="flex gap-5 flex-grow" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            name="username"
            className="lg:rounded-md lg:px-5 lg:bg-slate-800 lg:py-1 lg:flex-1 cursor-pointer flex-grow"
          />
          <button className="px-3 py-2 rounded-md flex-grow bg-slate-700 hover:bg-slate-900">
            Search
          </button>
        </form>
        {user && (
          <div className="lg:flex lg:gap-3 lg:align-middle lg:items-center my-4">
            <div className="flex align-middle items-center gap-2">
              <img
                src={user.avatar || avatar}
                className="lg:rounded-full lg:w-[15%] cursor-pointer"
              />
              <h2 className="lg:text-lg lg:font-semibold">{user.username}</h2>
            </div>
            <button
              className="px-3 py-1 rounded-md flex-grow bg-slate-700 hover:bg-slate-900 w-1/2"
              onClick={handleAddUser}
            >
              Add User
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
