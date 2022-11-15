import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib/context';

import { useUserData } from '../lib/hooks';

export default function App({ Component, pageProps }: AppProps) {
  const UserData = useUserData();

  return (
  <>
    <UserContext.Provider value={ UserData }>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  </>
  )
}
