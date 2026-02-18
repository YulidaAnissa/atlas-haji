"use client";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiLogOut, FiCreditCard, FiUser } from "react-icons/fi";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { accessTokenStorage, profileStorage } from "@/utils/storage";

function removeStorage() {
  accessTokenStorage.remove();
  profileStorage.remove();
  localStorage.clear();
}

export default function HeaderPage({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [ profil, setProfil ] = useState(null);
  
  const handleLogout = () => {
    removeStorage();
    router.push("/login");
  };

  useEffect(() => {
    const storedProfile = profileStorage.get();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfil(storedProfile);
  }, []);


  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-black h-18 px-3 shadow-md">
      <div className="flex items-center gap-4 w-60 justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Garuda Emblem" width={50} height={50} />
          <p className="text-4xl font-semibold text-white py-3">ATLAS</p>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} id="test">
          <GiHamburgerMenu className="w-6 h-6 text-white" />
        </button>

      </div>
       {/* Account Dropdown */}
        <div className="relative">
          <button  
            onClick={() => setOpenMenu(!openMenu)}  
            className="px-4 py-3 rounded flex items-center gap-2 text-white cursor-pointer"
          >
            <FiUser className="w-5 h-5" />
            <span>{profil?.nama ?? ""}</span>
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-4 w-56 bg-white rounded shadow-lg p-3">
              <div className="border-b pb-2 mb-2">
                <p className="font-semibold">{profil?.nama}</p>
                <p className="text-xs text-gray-500">{profil?.jabatan}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="cursor-pointer flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-600"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
    </header>
  );
}