import TrackListing from '@/components/track-listing';
import React from 'react';

const Beats = () => {
  document.title = `Birdie Bands | All Beats`;

  return (
    <>
      <TrackListing limitTrackCount={false} />
    </>
  );
};

export default Beats;
