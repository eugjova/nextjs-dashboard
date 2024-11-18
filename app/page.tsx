// import AtmaLogo from '@/app/ui/atma-logo';
import { InboxStackIcon, UserIcon } from '@heroicons/react/24/outline';
import {
  ArrowRightCircleIcon,
  PhoneIcon,
  BuildingOffice2Icon,
  EnvelopeIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import '@/app/ui/global.css';
import { kanit, lusitana, oswald, roboto } from '@/app/ui/fonts';
import Image from 'next/image';
import { Metadata} from 'next';

export const metadata: Metadata = {
  title: 'SIBROMEN',
};
 
export default function Page() {
 
  return (
    <main className="flex min-h-screen flex-col p-6 bg-white">
      <Image
        src="/bg.png"
        alt="haircut"
        quality={100}
        fill
        style={{
          objectFit: 'cover',
        }}
      />
    <header className="w-full bg-black">
        <nav className="fixed inset-x-0 top-0 z-50 w-full bg-black/80 shadow-lg px-4 py-2 transition duration-700 ease-out">
          <div className="flex justify-between p-1">
            <div className="text-[2rem] leading-[3rem] tracking-tight text-white">
              <div className={`${oswald.variable} flex items-center`}>
                <Image
                  src="/Logo-SIBROMEN.png"
                  alt="logo SIBROMEN"
                  width={90}
                  height={70}
                />
                <p className="text-[30px] p-0 ml-3">SABURO RAMEN</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-lg tracking-tight">
              <Link href="#home">
                <h1 className="px-4 py-2 text-xl text-white transition duration-700 ease-out rounded-lg hover:text-red-500 dark:text-white hidden md:block">
                  Home
                </h1>
              </Link>
              <Link href="#about">
                <h1 className="px-4 py-2 text-xl text-white transition duration-700 ease-out rounded-lg hover:text-red-500 dark:text-white hidden md:block">
                  About
                </h1>
              </Link>
              <Link href="#contact">
                <h1 className="px-4 py-2 text-xl text-white transition duration-700 ease-out rounded-lg hover:text-red-500 dark:text-white hidden md:block">
                  Contact
                </h1>
              </Link>
              <Link href="/login">
                <h1 className="px-8 py-3 text-xl text-white transition duration-700 ease-out bg-gradient-to-r from-red-700 to-red-400 rounded-full hover:from-red-900 hover:to-red-600 hidden md:block">
                  Login
                </h1>
              </Link>
              <UserIcon className="w-6 h-6 text-white transition duration-700 ease-out md:hidden" />
            </div>
          </div>
        </nav>
      </header>

      <div id="home" className="mt-20 px-16 relative flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="relative flex items-center justify-start p-6 md:w-1/2 md:px-28 md:py-12">
          <div className="absolute top-20 left-2/3 transform -translate-x-1/2">
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-screen gap-3 bg-gray-50/0 px-0 py-2 md:w-2/5 text-right ">
          <p className={`${oswald.variable} text-[120px] font-bold text-white leading-none md:leading-normal `}>
           SIBROMEN
          </p>
          <div className="flex flex-row items-center text-white justify-end relative">
            <div className="h-2 w-16 bg-white mr-4"></div>
            <p className={`text-[25px] text-white-800 leading-none md:leading-normal`}>
              Your Authentic Flavor
            </p>
            <div className="h-2 w-16 bg-white ml-4"></div>
          </div>
          <div className="flex justify-end relative mt-6">
            <Link
              href="/dashboard"
              className="flex items-center px-8 py-3 text-xl text-white transition duration-700 ease-out bg-gradient-to-r from-red-700 to-red-400 rounded-full hover:from-red-900 hover:to-red-600 hidden md:inline-flex"
            >
              <span className={`${roboto.variable} font-bold hidden md:block mr-2`}>Dashboard</span>
              <ArrowRightCircleIcon className="w-6" />
            </Link>
          </div>
        </div>
      </div>


      <div id="about" className="mt-32 px-16 relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50/0 px-6 py-4 md:w-2/5">
          <p className={`${oswald.variable} mt-16 text-[32px] font-bold text-black md:leading-normal`}>
            About Us
          </p>
          <div className={`${oswald.variable} flex flex-row items-center leading-none text-black`}>
            <p className={`${roboto.variable} text-[21px] text-black-800 md:leading-normal`}>
            At Saburo Ramen, we bring you the authentic taste of Kyoto with every bowl. Inspired by traditional Japanese flavors, we craft our ramen using fresh ingredients, rich broths, and handmade noodles. Our goal is to offer a truly memorable dining experience, making us The Best Kyoto Ramen In Town.
            Come and taste the warmth and soul of Kyoto, only at Saburo Ramen!
            </p>
          </div>
        </div>
        <div className="relative flex items-center justify-center md:w-2/5 mt-12 md:mt-20">
          <div className="relative w-full h-auto">
            <Image
              src="/ramen.png"
              width={1000}
              height={500}
              className="rounded-lg shadow-lg object-contain"
              alt="Vape store"
            />
          </div>
        </div>
      </div>

      <footer id="contact" className="mt-48 px-16 py-4 bg-red-600/80 shadow-lg rounded-t-lg ">
        <div className="flex flex-col justify-center gap-2 rounded-lg bg-gray-50/0 px-0 py-4 w-full md:px-50">
          <p className={`${oswald.variable} text-[24px] font-bold text-white md:leading-normal`}>
            Contact Us
          </p>
          <div className={`${roboto.variable} flex flex-col leading-none text-white space-y-2`}>
            <p className="text-[14px] text-white-800 md:leading-normal">
              Get in touch with us for any inquiries or support.
            </p>
            <div className="space-y-1">
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-white-800" />
                <p className="text-[14px] text-white-800 md:leading-normal">
                  <strong></strong> 0822-4192-8106
                </p>
              </div>
              <div className="flex items-center">
                <BuildingOffice2Icon className="w-4 h-4 mr-2 text-white-800" />
                <p className="text-[14px] text-white-800 md:leading-normal">
                  <strong></strong> Jl. Seturan Raya No.9, RW.12, Kledokan, Caturtunggal,
                  Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
                </p>
              </div>
              <div className="flex items-center">
                <InboxStackIcon className="w-4 h-4 mr-2 text-white-800" />
                <p className="text-[14px] text-white-800 md:leading-normal">
                  <strong>Instagram</strong> saburoramen_jogja
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}