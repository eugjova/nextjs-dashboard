import  Image  from 'next/image';
import { oswald } from '@/app/ui/fonts';

export default function Logo() {
  return (
    <div
      className={`${oswald.variable} flex flex-row items-center leading-none text-black`}
    >
      <Image
      src="/Logo-SIBROMEN.png" 
      alt=""
      width={90}
      height={70}
      className=""
     />
      <p className="text-[35px] oswald">SIBROMEN</p> 
    </div>
  );
}
