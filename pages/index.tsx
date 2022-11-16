import Head from 'next/head'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import Loader from '../components/Loader'
import { Lorem } from '../components/Lorem'

export default function Home() {
  return (
    <main>
      <Lorem />
      <div>
        <button onClick={() => toast.success("Hello World !")}>Test Toast</button>
      </div>
    </main>
  )
}
