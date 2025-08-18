import MailerLitePopUp from '../src/components/MailerlitePopUp';
import TrackListing from '@/components/track-listing';

const Beats = () => {
  document.title = `Birdie Bands | All Beats`;

  return (
    <>
      <TrackListing />
      <MailerLitePopUp />
    </>
  );
};

export default Beats;
