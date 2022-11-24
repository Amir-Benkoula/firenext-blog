import { getUserWithUsername } from "../../lib/firebase";
import {
  doc,
  collection,
  getDoc,
  query,
  collectionGroup,
  getFirestore,
  limit,
  getDocs,
} from "firebase/firestore";
import PostContent from "../../components/PostContent";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import Link from "next/link";

import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import LikeButton from "../../components/LikeButton";

// Incremental Static Regeneration function to show user's data and posts
export async function getStaticProps({ params }: any) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postsCollection = collection(userDoc.ref, "posts");
    const postData = (await getDoc(doc(postsCollection, slug))).data();

    post = {
      ...postData,
      createdAt: postData?.createdAt.toMillis(),
      updatedAt: postData?.updatedAt.toMillis(),
    };

    path = doc(postsCollection, slug).path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const q = query(collectionGroup(getFirestore(), "posts"), limit(20));

  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: "blocking",
  };
}

// export async function getServerSideProps({ query }: any) {
//   const { username, slug } = query;

//   const userDoc = await getUserWithUsername(username);

//   // JSON serializable data
//   let post = null;
//   let postjson = null;

//   if (userDoc) {

//   }

//   return {
//     props: { postjson }, // will be passed to the page component as props
//   };
// }

export default function Post(props: any) {
  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Connexion</button>
            </Link>
          }
        >
          <LikeButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button>Editer</button>
          </Link>
        )}
      </aside>
    </main>
  );
}
