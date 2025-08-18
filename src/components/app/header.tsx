import Image from 'next/image';

export function Header() {
  return (
    <header className="py-4 sm:py-6">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <Image src="/icon.svg" alt="EraSnap logo" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10" />
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-white tracking-widest">
          EraSnap
        </h1>
      </div>
    </header>
  );
}
