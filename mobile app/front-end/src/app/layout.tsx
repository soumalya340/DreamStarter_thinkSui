"use client";

import "./globals.css";


import Nav from "@/components/common/Nav";
import { ProposalProvider } from "@/ContextProviders/ProposalProvider";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { IoClose } from "react-icons/io5";
import { WalletProvider } from "@suiet/wallet-kit";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
    <html lang="en">
      <title>Dream Starter</title>
      <ProposalProvider>
          <SnackbarProvider
            action={(snackbarId) => (
              <button onClick={() => closeSnackbar(snackbarId)}>
                <IoClose className="h-6 w-6 pr-2 text-xl" />
              </button>
            )}
          >
            <body className="font-raleway text-sm text-gray-800">
              <Nav />
              <div>{children}</div>
            </body>
          </SnackbarProvider>
  
      </ProposalProvider>
    </html>
    </WalletProvider>
  );
}
