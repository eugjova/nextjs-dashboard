'use client';

import { useState } from 'react';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import {
  PowerIcon,
  ArrowUturnLeftIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { signOut } from '@/authServer';
import Image from 'next/image';
import { oswald, roboto } from '@/app/ui/fonts';

export default function SideNav() {
  const [collapsed, setCollapsed] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    if (!userDropdownOpen) {
      setLanguageDropdownOpen(false);
    }
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
    if (!languageDropdownOpen) {
      setUserDropdownOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const EnglishIcon = (
    <svg className="w-6 h-6" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" fill="#f0f0f0" r="256" />
      <g fill="#0052b4">
        <path d="m52.92 100.142c-20.109 26.163-35.272 56.318-44.101 89.077h133.178z" />
        <path d="m503.181 189.219c-8.829-32.758-23.993-62.913-44.101-89.076l-89.075 89.076z" />
        <path d="m8.819 322.784c8.83 32.758 23.993 62.913 44.101 89.075l89.074-89.075z" />
        <path d="m411.858 52.921c-26.163-20.109-56.317-35.272-89.076-44.102v133.177z" />
        <path d="m100.142 459.079c26.163 20.109 56.318 35.272 89.076 44.102v-133.176z" />
        <path d="m189.217 8.819c-32.758 8.83-62.913 23.993-89.075 44.101l89.075 89.075z" />
        <path d="m322.783 503.181c32.758-8.83 62.913-23.993 89.075-44.101l-89.075-89.075z" />
        <path d="m370.005 322.784 89.075 89.076c20.108-26.162 35.272-56.318 44.101-89.076z" />
      </g>
      <g fill="#d80027">
        <path d="m509.833 222.609h-220.44-.001v-220.442c-10.931-1.423-22.075-2.167-33.392-2.167-11.319 0-22.461.744-33.391 2.167v220.44.001h-220.442c-1.423 10.931-2.167 22.075-2.167 33.392 0 11.319.744 22.461 2.167 33.391h220.44.001v220.442c10.931 1.423 22.073 2.167 33.392 2.167 11.317 0 22.461-.743 33.391-2.167v-220.44-.001h220.442c1.423-10.931 2.167-22.073 2.167-33.392 0-11.317-.744-22.461-2.167-33.391z" />
        <path d="m322.783 322.784 114.236 114.236c5.254-5.252 10.266-10.743 15.048-16.435l-97.802-97.802h-31.482z" />
        <path d="m189.217 322.784h-.002l-114.235 114.235c5.252 5.254 10.743 10.266 16.435 15.048l97.802-97.804z" />
        <path d="m189.217 189.219v-.002l-114.236-114.237c-5.254 5.252-10.266 10.743-15.048 16.435l97.803 97.803h31.481z" />
        <path d="m322.783 189.219 114.237-114.238c-5.252-5.254-10.743-10.266-16.435-15.047l-97.802 97.803z" />
      </g>
    </svg>
  );

  const IndonesiaIcon = (
    <svg className="w-6 h-6" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" fill="#f0f0f0" r="256" /><path d="m0 256c0-141.384 114.616-256 256-256s256 114.616 256 256" fill="#a2001d" />
      <g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g /><g />
    </svg>
  );

  return (
    <div className={`fixed flex h-full flex-col px-3 py-4 md:px-2 bg-white text-black ${collapsed ? 'w-16' : 'sm:w-16 md:w-64'} transition-all duration-300 shadow-xl z-50`}>
      <header className="w-full bg-white">
        <nav className="fixed inset-x-0 top-0 z-50 w-full bg-white shadow-xl border-b border-gray-900 px-4 py-2 transition duration-700 ease-out">
          <div className="flex justify-between p-1 items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="bg-white text-black rounded-md p-1 border border-blue-900 hover:bg-gray-500"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <div className="text-[2rem] leading-[3rem] tracking-tight text-black">
                <div className={`${oswald.className} flex items-center ml-2`}>
                  <Image
                    src="/Logo-SIBROMEN.png"
                    alt="logo FV"
                    width={50}
                    height={50}
                  />
                  <p className="text-[30px] p-0 ">SIBROMEN</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-lg tracking-tight">
              <ChatBubbleLeftRightIcon className="w-5 hover:text-red-600" />
              <BellIcon className='w-5 hover:text-red-600' />
              <GlobeAltIcon className='w-5 cursor-pointer hover:text-red-600' onClick={toggleLanguageDropdown} />
              {languageDropdownOpen && (
                <div className="absolute top-16 right-10 bg-black rounded-lg shadow-md p-2 border border-purple-900">
                  <ul>
                    <li className={`${roboto.className} flex items-center space-x-2 text-sm p-2 hover:bg-gray-800 hover:text-purple-500 cursor-pointer`}>
                      {IndonesiaIcon}
                      <p className="text-[12px] ml-1">Bahasa Indonesia</p>
                    </li>
                    <li className={`${roboto.className} flex items-center space-x-2 text-sm p-2 hover:bg-gray-800 hover:text-purple-500 cursor-pointer`}>
                      {EnglishIcon}
                      <p className="text-[12px] ml-1">English</p>
                    </li>
                  </ul>
                </div>
              )}
              <div className={`${oswald.className} flex items-center ml-2 cursor-pointer`} onClick={toggleUserDropdown}>
                <UserCircleIcon className='w-10' />
                <p className="text-[18px] text-bold p-0 ml-1">User</p>
                <ChevronDownIcon className='w-5 ml-2 hover:text-purple-600' />
              </div>
              {userDropdownOpen && (
                <div className="absolute top-16 right-2 bg-black rounded-lg shadow-md p-2 border border-purple-900">
                  <ul>
                    <div className={`${roboto.className} text-sm p-2 hover:bg-white-800 hover:text-purple-500 cursor-pointer`}>Information</div>
                    <div className={`${roboto.className} text-sm p-2 hover:bg-gray-800 hover:text-purple-500 cursor-pointer`}>Settings</div>
                    <div
                      className={`${roboto.className} text-sm p-2 hover:bg-gray-800 hover:text-purple-500 cursor-pointer`}
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </div>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div className="flex flex-col grow justify-between mt-16 md:mt-20 space-y-2">
        <NavLinks collapsed={collapsed} />
        <div className="md:block grow"></div>
        <Link
          href="/"
          className={`flex h-[48px] items-center justify-start gap-2 rounded-md bg-white p-3 text-sm font-medium duration-700 hover:bg-red-500 hover:text-gray-800 md:justify-start md:p-2 md:px-3 ${collapsed && 'justify-center'}`}
        >
          <ArrowUturnLeftIcon className="w-5" />
          <div className={`${collapsed && 'hidden'}`}>Back</div>
        </Link>
        <button
          onClick={handleSignOut}
          className={`flex h-[48px] items-center justify-start gap-2 rounded-md bg-white p-3 text-sm font-medium duration-700 hover:bg-red-500 hover:text-gray-800 md:justify-start md:p-2 md:px-3 ${collapsed && 'justify-center'}`}
        >
          <PowerIcon className="w-6" />
          <div className={`${collapsed && 'hidden'}`}>Sign Out</div>
        </button>
      </div>
    </div>
  );
}
