import FuzzyText from '@/components/ui/ReactBits/FuzzyText';
import FadeContent from '@/components/ui/ReactBits/FadeContent';
import YoutubeSection from '@/components/YouTube';
const Maintenance = () => {
  return (
    <FadeContent
      key={1}
      initialOpacity={0}
      blur={false}
      duration={800}
      delay={100}
      threshold={0.1}
    >
      <div className="flex flex-col items-center justify-center h-screen  !relative !z-50">
        <div className="scale-25 max-sm:!scale-10 max-md:scale-20 flex items-center flex-col space-y-6">
          <FuzzyText
            baseIntensity={0.5}
            hoverIntensity={0.5}
            enableHover={true}
          >
            Birdie Bands Website is currently under maintenance
          </FuzzyText>
          <FuzzyText
            baseIntensity={0.5}
            hoverIntensity={0.5}
            enableHover={true}
          >
            Check Back In Later
          </FuzzyText>
        </div>

        <YoutubeSection />
      </div>
    </FadeContent>
  );
};

export default Maintenance;
