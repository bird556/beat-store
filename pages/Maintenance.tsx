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
      <div className="flex flex-col items-center justify-center h-screen space-y-6  !relative !z-50">
        <div className="flex items-center flex-col space-y-6">
          <FuzzyText
            fontSize={14}
            baseIntensity={0.1}
            hoverIntensity={0.3}
            enableHover={true}
          >
            Birdie Bands Website is currently under maintenance
          </FuzzyText>
          <FuzzyText
            fontSize={24}
            baseIntensity={0.1}
            hoverIntensity={0.3}
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
