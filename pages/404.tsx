import Link from 'next/link';

export default function Custom404() {
  return (
    <main>
      <h1>404 - Cette page ne semble pas exister...</h1>
      <iframe
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link href="/">
        <button>Accueil</button>
      </Link>
    </main>
  );
}
