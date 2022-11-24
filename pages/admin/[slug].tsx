import AuthCheck from "../../components/AuthCheck";
import { firestore, auth } from "../../lib/firebase";
import {
  collection,
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
import Link from "next/link";
import toast from "react-hot-toast";

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
    <main>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Outils</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Fermer l'aperçu" : "Ouvrir l'aperçu"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button>Voir la publication</button>
            </Link>
          </aside>
        </>
      )}
    </main>
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
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div>
        <ImageUploader />

        <textarea
          {...register("content", {
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
        ></textarea>

        <div>
          <input {...register("published")} type="checkbox" />
          <label>Publier</label>
        </div>

        {formState.errors.content && (
          <p className="text-danger">{errorMessage}</p>
        )}

        <button type="submit" disabled={!isDirty || !isValid}>
          Sauvegarder
        </button>
      </div>
    </form>
  );
}
