"use client";

import ChangeProfile from "@/components/forms/UpdateProfile";
import { useState } from "react";
import ChangePassword from "@/components/forms/ChangePassword";

export default function Profile() {
  const [profileOpen, setProfileOpen] = useState(true);
  return (
    <>
      <main className="container mx-auto  m-10 pb-20 px-20 pt-5">
        <nav className="bg-amber-400 flex flex-col sm:flex-row gap-5 mb-5 p-2 rounded-md justify-between shadow-md text-sm font-bold">
          <button
            className={`hover:text-white hover:scale-110 pr-4 ${
              profileOpen ? "border-r-4 border-black " : "text-gray-100"
            }`}
            onClick={() => setProfileOpen(true)}
          >
            Profile
          </button>
          <button
            className={`hover:text-white hover:scale-110 pr-4 ${
              !profileOpen ? "border-r-4 border-black " : "text-gray-100"
            }`}
            onClick={() => setProfileOpen(false)}
          >
            Change Password
          </button>
        </nav>
        {profileOpen ? <ChangeProfile /> : <ChangePassword />}
      </main>
    </>
  );
}
