import Image from 'next/image';

export function Header() {
  return (
    <header className="py-4 sm:py-6">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <Image src="/icon.svg" alt="EraSnap logo" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10" />
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          ERASNAP 2.0
        </h1>
      </div>
    </header>
  );
}
