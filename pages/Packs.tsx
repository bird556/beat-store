import { Helmet } from 'react-helmet'; // Added for SEO
import BirdieLogo1 from '../src/Images/cropped.png';
import PackList from '../src/components/PackList';
const Packs = () => {
  document.title = `Birdie Bands | Sample Loop Packs`;

  return (
    <>
      <Helmet>
        <title>Sample Loop Packs | Birdie Bands</title>
        <meta
          name="description"
          content="Discover premium sample loop packs for hip hop, soul, trap, and West Coast production. Shop BirdieBands for exclusive loops, royalty-free samples, and industry-ready sounds used by top artists."
        />
        <meta
          name="keywords"
          content="sample packs, loop packs, sample loop packs, g-funk loop packs, soul samples, Birdie Bands"
        />
        <link rel="canonical" href="https://www.birdiebands.com/packs" />
        <meta property="og:title" content="Sample Loop Packs | Birdie Bands" />
        <meta
          property="og:description"
          content="Discover premium sample loop packs for hip hop, soul, trap, and West Coast production. Shop BirdieBands for exclusive loops, royalty-free samples, and industry-ready sounds used by top artists."
        />
        <meta property="og:image" content={BirdieLogo1} />
        <meta property="og:url" content="https://www.birdiebands.com/packs" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Birdie Bands" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sample Loop Packs | Birdie Bands" />
        <meta
          name="twitter:description"
          content="Discover premium sample loop packs for hip hop, soul, trap, and West Coast production. Shop BirdieBands for exclusive loops, royalty-free samples, and industry-ready sounds used by top artists."
        />
        <meta name="twitter:image" content={BirdieLogo1} />
      </Helmet>
      <PackList />
    </>
  );
};

export default Packs;
