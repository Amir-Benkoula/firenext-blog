import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import { collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

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
  const slug = router.asPath.split('/')[2];
  const postRef = doc(collection(doc(collection(firestore, 'users'), uid), 'posts'), slug);
  const [post] = useDocumentData(postRef);

  return (
    <main>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
          <h3>Outils</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? "Fermer l'aperçu" : "Ouvrir l'aperçu"}</button>
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
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues, mode: 'onChange' });
  const content = {
    onChange: register('content').onChange,
    ref : register('content').ref,
    name: register('content').name,
  }

  const published = {
    onChange: register('published').onChange,
    ref : register('published').ref,
    name: register('published').name
  }

  const updatePost = async ({ content, published }: any) => {

    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Article mis à jour!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div>
        <textarea {...content}></textarea>
        <fieldset>
          <input {...published} type="checkbox" />
          <label>Publier</label>
        </fieldset>

        <button type="submit">
          Sauvegarder
        </button>
      </div>
    </form>
  );
}
