import Link from "next/link"
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Navbar(){
    const {user, username} = useContext(UserContext);

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
                        <Link href="/">
                            <button>Sign Out</button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin">
                            <button>Write Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
                            <img src={user?.photoURL} alt="profile pic" />
                        </Link>
                    </li>
                </>
            )}

            {!username && (
                <>
                    <li>
                        <Link href="/enter">
                            <button>Log In</button>
                        </Link>
                    </li>
                </>
            )}
            </ul>
        </nav>
    );
}
