import Head from 'next/head';

type SeoProps = {
  title: string;
  description: string;
  image?: string;
};

export function Seo({ title, description, image }: SeoProps) {
  const fullTitle = `${title} | RentEase`;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
