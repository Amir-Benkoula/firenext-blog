import { toast } from 'react-hot-toast'
import { Lorem } from '../components/Lorem'
import { getUserWithUsername } from '../lib/firebase'

export default function Home() {
  return (
    <main>
      <Lorem />
    </main>
  )
}
