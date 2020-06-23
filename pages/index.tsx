import React from 'react';
import METADATA from '../metadata.json';
import Head from 'next/head';

const IndexPage: React.FC = () => {
  const { title, description } = METADATA;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
};

export default IndexPage;
