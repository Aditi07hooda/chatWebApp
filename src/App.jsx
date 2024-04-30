import "./App.css";
import LeftSidebar from "./Components/LeftSidebar.jsx";
import RightSidebar from "./Components/RightSidebar.jsx";
import Center from "./Components/Center.jsx";
import LoginAndSignup from "./Components/LoginAndSignup.jsx";
import Notify from "./Components/Notifications/Notify.jsx";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase.js";
import { userStore } from "./lib/userStore.js";
import Loading from "./Elements/Loading.jsx";
import { useChatStore } from "./lib/chatStore.js";

function App() {
  const { currentUser, isLoading, fetchCurrentUserInfo } = userStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchCurrentUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [fetchCurrentUserInfo]);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="bg-black h-[90vh] w-[90vw] border-2 rounded-xl backdrop-blur-xl backdrop-saturate-50 text-white lg:flex lg:justify-evenly px-3 py-3">
        {currentUser ? (
          <>
            <LeftSidebar />
            {chatId && <Center />}
            {chatId && <RightSidebar />}
          </>
        ) : (
          <LoginAndSignup />
        )}
        <Notify />
      </div>
    </>
  );
}

export default App;
