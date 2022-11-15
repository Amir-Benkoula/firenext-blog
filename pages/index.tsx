import Head from 'next/head'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import Loader from '../components/Loader'

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.success("Hello World !")}>Test Toast</button>
    </div>
  )
}
