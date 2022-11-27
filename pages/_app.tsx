import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppNavbar from "../components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import Metatags from "../components/Metatgs";

export default function App({ Component, pageProps }: AppProps) {
  const userData = useUserData();

  return (
    <>
      <Metatags/>
      <UserContext.Provider value={userData}>
        <AppNavbar />
        <Component {...pageProps} />
        <Toaster />
        <Analytics />
      </UserContext.Provider>
    </>
  );
}
