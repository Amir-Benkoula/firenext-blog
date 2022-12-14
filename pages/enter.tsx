import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import { Button, Input } from "antd";
import { useRouter } from "next/router";
import { GoogleOutlined } from "@ant-design/icons";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      icon={<GoogleOutlined />}
      className="btn-google"
      onClick={signInWithGoogle}
    >
      Se connecter avec Google
    </Button>
  );
}

function SignOutButton() {
  return <Button onClick={() => auth.signOut()}>Déconnexion</Button>;
}

function UsernameForm() {
  const router = useRouter();
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username }: any = useContext(UserContext);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(getFirestore(), "users", user.uid);
    const usernameDoc = doc(getFirestore(), "usernames", formValue);

    // Commit both docs together as a batch write.
    const batch = writeBatch(getFirestore());
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();

    router.push("/");
  };

  const onChange = (e: any) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  });

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), "usernames", username);
        const exists = (await getDoc(ref)).exists();
        console.log("Firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    <div className="usernameForm">
      {!username && (
        <section>
          <h2>Nom d{"'"}utilisateur</h2>
          <form onSubmit={onSubmit}>
            <Input
              name="username"
              value={formValue}
              onChange={onChange}
              style={{ width: "10%", margin: "1em" }}
            />
            <Button htmlType="submit" disabled={!isValid}>
              S{"'"}inscrire
            </Button>
            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={loading}
            />

            {/* <h3>Debug State</h3>
                <div>
                Username: {formValue}
                <br />
                Loading: {loading.toString()}
                <br />
                Username Valid: {isValid.toString()}
                </div> */}
          </form>
        </section>
      )}
    </div>
  );
}

function UsernameMessage({ username, isValid, loading }: any) {
  if (loading) {
    return <p>Vérification...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} est disponible!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">Ce nom est déjà utilisé!</p>;
  } else {
    return <p></p>;
  }
}
