import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs';
import IconBoxArrowInRight from 'bootstrap-icons/icons/box-arrow-in-right.svg';
import IconBoxArrowRight from 'bootstrap-icons/icons/box-arrow-right.svg';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carnet Cuisine',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <nav className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
              <Link className="btn btn-ghost text-xl" href="/">
                Carnet Cuisine
              </Link>
            </div>
            <div className="flex-none">
              <SignedIn>
                <SignOutButton>
                  <button className="btn">
                    <IconBoxArrowRight /> Déconnexion
                  </button>
                </SignOutButton>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="btn">
                    <IconBoxArrowInRight /> Connexion
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
          <main className="p-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
