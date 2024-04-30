import React from "react";
import { auth, db } from "../../lib/firebase";
import { userStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

export default function BottomUserBtn() {
  const { currentUser } = userStore();
  const { changeBlock, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-2 pt-2 border-slate-800 border-t-2">
      <div className="flex flex-col mx-2">
        <div className="flex my-2">
          <button
            className="bg-red-400 px-3 py-2 rounded-md flex-grow hover:bg-red-700"
            onClick={handleBlock}
          >
            {isCurrentUserBlocked
              ? "You are blocked!!!"
              : isReceiverBlocked
              ? "User Blocked!!!"
              : "Block User"}
          </button>
        </div>
        <div className="flex my-2">
          <button
            className="px-3 py-2 rounded-md flex-grow bg-slate-700 hover:bg-slate-900"
            onClick={() => auth.signOut()}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
