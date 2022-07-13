import { getDatabase, getPage, getBlocks } from "../lib/notion";
import Head from "next/head";

const renderBlock = (block) => {
  const { type } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return <p className="mb-4">{value.rich_text[0].plain_text}</p>;
    case "heading_1":
      return <h1 className="font-bold text-3xl  mb-2">{value.rich_text[0].plain_text}</h1>;
    case "heading_2":
      return <h2 className="font-bold text-2xl  mb-2">{value.rich_text[0].plain_text}</h2>;
    case "heading_3":
      return <h3 className=" font-bold text-xl mb-2">{value.rich_text[0].plain_text}</h3>;
  }
};

export default function Post({ post, content }) {
  const date = new Date(post.created_time).toLocaleString("en-Us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div>
      <Head>
        <title>{post.properties.Name.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container mx-auto w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-6/12 p-4">
          <h1 className="font-bold text-2xl">{post.properties.Name.title[0].plain_text}</h1>
          <span className="text-sm">{date}</span>
          <img src="https://picsum.photos/800/200" alt="random image" className=" max-w-full" />
          <div className="mt-10">
            {content.map((block) => {
              console.log(block);
              return <div key={block.id}>{block.type === "page_break" ? <hr /> : <div>{renderBlock(block)}</div>}</div>;
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase("f9dfc334e89e4c2289b9bc98884b5e80");
  const paths = database.map((post) => {
    return {
      params: {
        post: post.id,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const postId = params.post;
  const post = await getPage(postId);
  const content = await getBlocks(postId);

  return {
    props: {
      post,
      content,
    },
    revalidate: 1,
  };
};
