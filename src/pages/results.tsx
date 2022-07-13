import { NextPage } from 'next';
import Link from 'next/link';

const ResultsPage: NextPage = () => {
  return (
    <>
      <h1>Results</h1>
      <Link href={'/tournaments'}>Tournaments</Link>
    </>
  );
};

export default ResultsPage;
