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
import { Button, Form, Input } from "antd";

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
  const [imgLoading, setImgLoading] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // const toolTipText = `Ce site utilise une surcouche du model de génération d'image par texte de
  // Stable Diffusion nommée Openjourney
  // `

  async function postData(url: string, data: string) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      body: data,
    });

    return response.json();
  }

  // Generate Image using prompthero/openjourney Text To Image AI
  const onFinish = async (values: any) => {
    setImgLoading(true);
    postData("/api/openJourney", values.prompt)
      .then((res) => {
        setImageUrl(res.imageUrl);
        setImgLoading(false);
        setShowImg(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    setImgLoading(false);
  };

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
        <div>
          <h1 style={{ textAlign: "center" }}>
            {"Générer une image grâce à l'IA"}
          </h1>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              className="center"
              style={{ width: "70%" }}
              name="prompt"
              rules={[
                { required: true, message: "Veuillez entrer une phrase" },
              ]}
            >
              <Input />
              {/* <Tooltip placement="right" title={toolTipText} color="gray">
            <QuestionCircleOutlined style={{marginTop: "0.3em", marginLeft:"0.5em",position: "absolute", color:"gray", fontSize: "1.5em"}}/>
          </Tooltip> */}
            </Form.Item>
            <Form.Item>
              <Button
                className="center"
                type="primary"
                htmlType="submit"
                loading={imgLoading}
              >
                Créer
              </Button>
            </Form.Item>
          </Form>
          {showImg && (
            <img
              className="center"
              src={imageUrl}
              alt={"Ai Image generated with prompthero/openjourney model"}
            />
          )}
        </div>
        <PostFeed posts={posts} />
        {posts.length ? (
          !loading &&
          !postsEnd && (
            <Button
              loading={loading}
              className="load-button"
              onClick={getMorePosts}
            >
              Plus d{"'"}articles
            </Button>
          )
        ) : (
          <p className="no-posts">
            {"Il n'y a pas d'articles pour le moment !"}
          </p>
        )}
        <div className="no-posts">
          {postsEnd && "Il n'y a plus d'articles!"}
        </div>
      </main>
    </>
  );
}
