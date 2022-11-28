import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";

import { useState } from "react";
import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Button } from "antd";

// Max post to query per page
const LIMIT = 5;

export async function getServerSideProps(context: any) {
  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

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

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const nextPageQuery = query(
      collectionGroup(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(nextPageQuery)).docs.map((doc) =>
      doc.data()
    );

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <>
    <main>
      <PostFeed posts={posts} />
        {posts.length ? (
          !loading &&
          !postsEnd && <Button loading={loading} className="load-button" onClick={getMorePosts}>Plus d{"'"}articles</Button>
        ) : (
          <p className="no-posts">{"Il n'y a pas d'articles pour le moment !"}</p>
        )}
        <div className="no-posts">
          {postsEnd && "Il n'y a plus d'articles!"}
        </div>
    </main>
    </>
  );
}
