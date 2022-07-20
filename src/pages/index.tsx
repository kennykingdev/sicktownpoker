import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Sicktown Poker</title>
        <meta name="description" content="Sicktown Poker League Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Sicktown!</h1>
      </main>
    </div>
  );
};

export default Home;
