import React, { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { upload } from "../lib/upload";

const LoginAndSignup = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleOnLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formdata = new FormData(e.target)
    const {email, password} = Object.fromEntries(formdata);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successfully")
    } catch (error) {
      console.error(error)
      toast.error("Login failed")
    } finally{
      setLoading(false)
    }
  };

  const handleOnRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    formData.append("avatar", avatar.file);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res.user.uid);
      const imgurl = await upload(avatar.file);
      await setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        username,
        email,
        avatar: imgurl,
        blocked: [],
      });
      await setDoc(doc(db, "userChat", res.user.uid), {
        chats: [],
      });
      toast.success(
        "Resgistered Successfully!! Now you can login and experience ChatApp"
      );
    } catch (error) {
      console.log(error);
      toast.error("Registeration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-[100%] gap-6 justify-evenly">
      <div className="border-r-2 border-slate-700 w-1/2 px-24">
        <div className="flex flex-col self-center">
          <h5 className="mb-4 text-xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-3xl self-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-slate-500 from-white">
              Welcome back,
            </span>
          </h5>
          <form
            className="flex flex-col gap-5 flex-grow"
            onSubmit={handleOnLogin}
          >
            <input
              type="text"
              placeholder="Email"
              name="email"
              className="lg:rounded-md lg:px-5 lg:bg-slate-800 lg:py-1 lg:flex-1 cursor-pointer flex-grow"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="lg:rounded-md lg:px-5 lg:bg-slate-800 lg:py-1 lg:flex-1 cursor-pointer flex-grow"
            />
            <button
              disabled={loading}
              className="px-3 py-2 rounded-md flex-grow bg-slate-700 hover:bg-slate-900"
            >
              {loading ? "Loading" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
      <div className="border-l-2 border-slate-700 w-1/2 px-24">
        <div className="flex flex-col justify-center ">
          <h5 className="mb-4 text-xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-3xl self-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-slate-500 from-white">
              Create an Account
            </span>
          </h5>
          <form
            className="flex flex-col gap-5 flex-grow"
            onSubmit={handleOnRegister}
          >
            <label htmlFor="file" className="flex gap-5">
              <img
                src={avatar.url || "./avatar.png"}
                alt=""
                className="lg:rounded-md lg:w-[20%] cursor-pointer"
              />
              <p>Upload an image</p>
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
              className="lg:rounded-md lg:px-5 lg:bg-slate-800 lg:py-1 lg:flex-1 cursor-pointer flex-grow"
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="lg:rounded-md lg:px-5 lg:bg-slate-800 lg:py-1 lg:flex-1 cursor-pointer flex-grow"
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              className="lg:rounded-md lg:px-5 lg:bg-slate-800 lg:py-1 lg:flex-1 cursor-pointer flex-grow"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="lg:rounded-md lg:px-5 lg:bg-slate-800 lg:py-1 lg:flex-1 cursor-pointer flex-grow"
            />
            <button
              disabled={loading}
              className="px-3 py-2 rounded-md flex-grow bg-slate-700 hover:bg-slate-900"
            >
              {loading ? "Loading" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAndSignup;
