import Link from "next/link";
import {
  HeartOutlined,
  FieldTimeOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";

export default function PostFeed({ posts, admin }: any) {
  return posts
    ? posts.map((post: any) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }: any) {
  // Naive method to calc word count and read time
  const minutesToRead = (
    post?.content.trim().split(/\s+/g).length / 100 +
    1
  ).toFixed(0);

  return (
    <div className="card">
      <header>
        <Link href={`/${post.username}`}>
          <p>De @{post.username}</p>
        </Link>
      </header>
      <article>
        <Link href={`/${post.username}/${post.slug}`}>
          <h2>{post.title}</h2>
        </Link>
      </article>
      <footer>
        <span>
          <HeartOutlined /> {post.heartCount || 0}
        </span>
        <span className="push-right">
          <FieldTimeOutlined /> {minutesToRead} min
        </span>
      </footer>
      {/* If admin view, show extra controls for user */}
      {admin && (
        <div className="admin-footer">
          {post.published ? (
            <EyeOutlined
              style={{ fontSize: "1.3em", color: "gray", marginLeft: "1em" }}
            />
          ) : (
            <EyeInvisibleOutlined
              style={{ fontSize: "1.3em", color: "gray", marginLeft: "1em" }}
            />
          )}
          <span className="push-right">
            <Link href={`/admin/${post.slug}`}>
              <EditOutlined
                style={{ fontSize: "1.5em", color: "gray", marginRight: "1em" }}
              />
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
