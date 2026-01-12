'use client';

import { UserButton } from '@clerk/nextjs';

export default function Header({ title }: { title: string }) {
  return (
    <header className="bg-[#111111] border-b border-[#222222] h-16 flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-[#FFFFFF]">{title}</h1>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
