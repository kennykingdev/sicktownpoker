import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '@/utils/trpc';

const Home: NextPage = () => {
  const hello = trpc.useQuery(['hello', { text: 'TRPC!' }]);

  if (!hello.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Sicktown Poker</title>
        <meta name="description" content="Sicktown Poker League Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Sicktown!</h1>
        <p>{hello.data.greeting}</p>
      </main>
    </div>
  );
};

export default Home;
