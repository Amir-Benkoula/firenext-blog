import { User } from "firebase/auth";

export default function UserProfile({ user }: any){
    return(
        <div className="box-center">
            <img src={user.photoURL}/>
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName || 'Utilisateur Anonyme'}</h1>
        </div>
    );
}
