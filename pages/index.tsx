import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import { firestore, fromMillis, postToJSON } from '../lib/firebase';

import { useState } from 'react';
import { collectionGroup, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context: any) {
  const postsQuery = query(collectionGroup(firestore, "posts"), where("published", "==", true), orderBy("createdAt", "desc"), limit(LIMIT));

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}


export default function Home(props: any) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

   // Get next page in pagination query
   const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

    const nextPageQuery = query(collectionGroup(firestore, "posts"), where("published", "==", true), orderBy("createdAt", "desc"),startAfter(cursor), limit(LIMIT));
    
    const newPosts = (await getDocs(nextPageQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>

      <div className="card card-info">
        <h2>💡 Next.js + Firebase - The Full Course</h2>
        <p>Welcome! This app is built with Next.js and Firebase and is loosely inspired by Dev.to.</p>
        <p>Sign up for an 👨‍🎤 account, ✍️ write posts, then 💞 heart content created by other users. All public content is server-rendered and search-engine optimized.</p>
      </div>
     
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  )
}
