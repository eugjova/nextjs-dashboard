import LoginForm from '@/app/ui/login-form';
import { oswald } from '@/app/ui/fonts';
import Image from 'next/image';
import Logo from '@/app/ui/logo';

export default function LoginPage() {
    return (
      <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative mx-auto flex w-full max-w-[900px] min-h-[500px] shadow-lg rounded-lg overflow-hidden ">
        <div className="flex flex-col w-1/2 bg-gray p-8">
                <div className="flex items-center ">
                    <Logo />
                </div>
                <LoginForm />
              </div>

                <div className="w-1/2 relative">
                <Image
                    src="/login-home.png" // Path to your uploaded image
                    alt="Advertisement for Sabura Ramen"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-r-lg"
                />
            </div>
          </div>
      
    </main>
    );
}
