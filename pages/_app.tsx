import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppNavbar from "../components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import Metatags from "../components/Metatgs";
import { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const userData = useUserData();

  useEffect(() => {
    const handleStart = (url: any) => (url !== router.asPath) && setOpen(true);
    const handleComplete = (url: any) => (url !== router.asPath) && setOpen(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
  });

  return (
    <>
      <Metatags/>
      <UserContext.Provider value={userData}>
        <AppNavbar /> 
        {!open ? <Component {...pageProps} />
        :
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>}
        <Toaster />
        <Analytics />
      </UserContext.Provider>
    </>
  );
}
