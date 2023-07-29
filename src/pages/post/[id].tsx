import Head from "next/head";
import { api } from "~/utils/api";
import { type NextPage } from "next";
import { type GetStaticProps } from "next";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";
import { generateSSGhelper } from "~/server/helpers/ssgHelper";


const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({ id })

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data}/>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGhelper()

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({ id })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
