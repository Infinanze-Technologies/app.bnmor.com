
import  Head from 'next/head'
import Script from 'next/script'
const DashMeta  =({ title, keywords, description,metaTitle }) => {
  return (
    <Head>
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    {/* <meta name='keywords' content={keywords} /> */}
    <title>{title}</title>
    {/* <meta name='description' content={description} />
    <meta name="title" content={metaTitle}/> */}
    <meta charSet='utf-8' />
    <link rel="shortcut icon" type="image/x-icon" href='/favicon.ico' />
    <link rel="icon" type="image/x-icon" href='/favicon.ico' />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-icon-180x180.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
    <link rel="manifest" href="/favicon_io/manifest.json" />



  </Head>
  )
}
DashMeta.defaultProps = {
    title: 'KLSM Suite',
    // keywords: 'KiloGH - Ghana online market to sell all your products like,Vehicles,Mobile phones,Laptops,Pets,Houses,Lands.',
    // description: 'KiloGH - Ghana online market to sell all your products like,Vehicles,Mobile phones,Laptops,Pets,Houses,Lands',
    // metaTitle: 'KiloGH - Ghana online market to sell all your products like,Vehicles,Mobile phones,Laptops,Pets,Houses,Lands.'
  }

export default DashMeta