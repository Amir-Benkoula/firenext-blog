import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../lib/context";


export default function EnterPage({ }){
    const {user, username} = useContext(UserContext);

    return(
        <main>
            {user ?
            !username ? <UsernameForm /> : <SignOutButton />
            :
            <SignInButton />
            }
        </main>
    )
}

function SignInButton(){
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
          <img src={'/google.png'} alt="" /> Sign in with Google
        </button>
    );
}

function SignOutButton(){
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm(){
    return null;
}
