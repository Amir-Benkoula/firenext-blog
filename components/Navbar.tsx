import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from "../lib/context";
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Navbar(){
    const {user, username} = useContext(UserContext);

    const router = useRouter();

    const signOutNow = () => {
      signOut(auth);
      router.reload();
      window.location.href='/';
    }

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button>Feed</button>
                    </Link>
                </li>
            {username && (
                <>
                    <li>
                        <Link href="/admin">
                            <button>Articles</button>
                        </Link>
                    </li>
                    <li>
                        <button onClick={signOutNow}>Déconnexion</button>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
                            <img src={user?.photoURL || '/google.png'} alt="profile pic" />
                        </Link>
                    </li>
                </>
            )}

            {!username && (
                <>
                    <li>
                        <Link href="/enter">
                            <button>Connexion</button>
                        </Link>
                    </li>
                </>
            )}
            </ul>
        </nav>
    );
}
