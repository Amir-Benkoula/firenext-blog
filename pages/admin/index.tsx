import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth } from "../../lib/firebase";
import {
  serverTimestamp,
  query,
  collection,
  orderBy,
  setDoc,
  doc,
} from "firebase/firestore";
import { Button, Form, Input, Modal } from "antd";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import { PlusCircleOutlined } from "@ant-design/icons";

export default function AdminPostsPage(props: any) {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    CreateNewPost();
    setOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };

  return (
    <main>
      <h1>Articles</h1>
      <AuthCheck>
        <PlusCircleOutlined
          style={{ fontSize: "1.5em", margin: "0.5em" }}
          onClick={showModal}
        />
        <PostList />
        <Modal
          centered
          title="Nouvel Article"
          open={open}
          onCancel={handleCancel}
          footer={[]}
        >
          <CreateNewPost />
        </Modal>
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const uid = auth.currentUser?.uid;

  const ref = collection(doc(collection(firestore, "users"), uid), "posts");
  const postQuery = query(ref, orderBy("createdAt"));

  const [querySnapshot] = useCollection(postQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e: any) => {
    const uid = auth.currentUser?.uid;
    // const usersRef = collection(firestore, "users");
    // const userDocRef = doc(usersRef, uid);
    const ref = doc(
      collection(doc(collection(firestore, "users"), uid), "posts"),
      slug
    );

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <Form style={{ marginTop: "2em" }} onFinish={createPost}>
      <Form.Item>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'article"
        />
      </Form.Item>
      <Form.Item>
        <Button type="text" htmlType="submit" disabled={!isValid}>
          Créer
        </Button>
      </Form.Item>
    </Form>
  );
}
