import React from 'react';
import type { NextPage } from 'next';
import { Landing } from '../components/Landing';

const Home: NextPage = () => {
  return (
    <>
      {/*Add metadata to head*/}
      {/*<AppHead/>*/}
      <Landing />
    </>
  );
};

export default Home;
