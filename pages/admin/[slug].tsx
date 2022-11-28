import AuthCheck from "../../components/AuthCheck";
import { firestore, auth } from "../../lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { useState } from "react";
import { useRouter } from "next/router";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ImageUploader from "../../components/ImageUploader";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Button } from 'antd';
import Link from "next/link";

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const uid = auth.currentUser?.uid;
  const router = useRouter();
  const slug = router.asPath.split("/")[2];
  const postRef = doc(
    collection(doc(collection(firestore, "users"), uid), "posts"),
    slug
  );
  const [post] = useDocumentData(postRef);

  return (
    <div className="article-form">
      <h1>{'"'}{post?.title}{'"'}</h1>
      <Button style={{margin: "0 1em"}} onClick={() => setPreview(!preview)}>
          {preview ? "Editer" : "Aperçu"}
      </Button>
      <Link href={`/${post?.username}/${post?.slug}`}>
        <Button style={{margin: "0 1em"}} className="btn-blue">Voir l{"'"}article</Button>
      </Link>
      <div className="image-upload">
        <ImageUploader />
      </div>
      {post && (
        <>
          <PostForm
            postRef={postRef}
            defaultValues={post}
            preview={preview}
          />
        </>
      )}
      <div style={{ display: "inline-block", width: "20em", marginBottom: "1em" }}>
        <DeletePostButton postRef={postRef}/>
      </div>
    </div>
  );
}

function PostForm({ defaultValues, postRef, preview }: any) {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });
  
  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }: any) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Article mis à jour!");
  };
  const errorMessage = "" + formState.errors.content?.message;
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card" style={{margin: "1em 17.5%"}}>
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      {!preview &&
        <div style={{ margin:"1em 0"}}>
        <textarea
          id="content"
          {...register("content", 
          {
            required: {
              value: true,
              message: "Le contenu de l'article est requis",
            },
            minLength: {
              value: 10,
              message: "Le contenu de l'article est trop court",
            },
            maxLength: {
              value: 20000,
              message: "Le contenu de l'article est trop long",
            },
          })}
          maxLength={20000}
        />
      </div>
      }
      <div>

      </div>
      {formState.errors.content && (
          <p className="text-danger">{errorMessage}</p>
        )}
      <div style={{ display: "inline-block", width: "20em", marginBottom: "1em" }}>
        <input id="published" {...register("published")} type="checkbox" />
        <label htmlFor="published" style={{marginRight: "1em"}}>Publier</label>
        <Button htmlType="submit" disabled={!isDirty || !isValid}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }: any) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('Êtes vous sûr de vouloir supprimer cet article?');
    if (doIt) {
      await deleteDoc(postRef);
      router.push('/admin');
      toast('Article supprimé ', { icon: '🗑️' });
    }
  };

  return (
    <Button danger onClick={deletePost}>
      Supprimer
    </Button>
  );
}
