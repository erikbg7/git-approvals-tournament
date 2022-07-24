import React from 'react';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Landing } from '../components/Landing';

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Git Approvers Tournament"
        description="A tournament to count user approvals on Github and Gitlab repositories."
      />
      <Landing />
    </>
  );
};

export default Home;
