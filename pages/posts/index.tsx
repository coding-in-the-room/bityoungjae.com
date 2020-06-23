import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

const PostMainPage: React.FC = () => <div>Post 페이지에용</div>;

export default PostMainPage;

/*
Server-side Block 입니다
*/

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
