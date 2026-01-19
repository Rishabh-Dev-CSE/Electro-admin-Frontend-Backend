import React from "react";
import { FiBell, FiUser, FiMenu } from "react-icons/fi";

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 md:pl-72">
      <div className="flex items-center gap-2">
        <button
          className="p-2 md:hidden rounded-md hover:bg-gray-100"
          onClick={onToggleSidebar}
          aria-label="open sidebar"
        >
          <FiMenu />
        </button>
        <div className="text-xl text-black">Cafe shop</div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-md hover:bg-gray-100"
          aria-label="notifications"
        >
          <FiBell />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-medium leading-none text-white bg-red-500 rounded-full">3</span>
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/avatar-placeholder.png"
            alt="owner"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-sm">
            <div className="font-medium text-gray-800">Amit Verma</div>
            <div className="text-xs text-gray-500">Owner</div>
          </div>
        </div>
      </div>
    </header>
  );
}
