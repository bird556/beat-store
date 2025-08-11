import MusicStudioVideo from '/Videos/music-studio.mp4';
const Background = () => {
  return (
    <>
      <div className="h-screen bg-background top-0 left-0 w-full z-[-1] opacity-60 fixed"></div>
      {/* <img className="backgroundimg" src={MusicStudio} alt="studio" srcset="" /> */}
      <video
        autoPlay
        loop
        muted
        className="backgroundimg transform scale-125"
        src={MusicStudioVideo}
      />
    </>
  );
};

export default Background;
