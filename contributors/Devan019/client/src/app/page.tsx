"use client"

import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserAvatar,
} from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <SignedIn>
        <div className="flex justify-center gap-4">
          <UserAvatar />
          <SignOutButton />
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex justify-center gap-4">
          <SignUpButton />
          <SignInButton />
        </div>
      </SignedOut>
    </div>
  )
}
