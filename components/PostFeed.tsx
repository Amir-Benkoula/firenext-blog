import Link from 'next/link';

export default function PostFeed({ posts, admin }: any) {
  return posts ? posts.map((post: any) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false }: any) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
          <strong>De @{post.username}</strong>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          {post.title}
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} mots. Temps de lecture : {minutesToRead} min
        </span>
        <div></div>
        <span className="push-left">💗 {post.heartCount || 0}</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Editer</button>
            </h3>
          </Link>

          {post.published ? <p className="text-success">Publié</p> : <p className="text-danger">Non publié</p>}
        </>
      )}
    </div>
  );
}
