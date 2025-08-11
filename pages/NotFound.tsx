import FuzzyText from '@/components/ui/ReactBits/FuzzyText';
import FadeContent from '@/components/ui/ReactBits/FadeContent';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 6000); // Redirect to the home page after 6  seconds
  });
  return (
    <FadeContent
      key={1}
      initialOpacity={0}
      blur={false}
      duration={800}
      delay={100}
      threshold={0.1}
    >
      <div className="flex flex-col items-center justify-center h-screen">
        <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
          404
        </FuzzyText>
        <div className="scale-25">
          <FuzzyText
            baseIntensity={0.5}
            hoverIntensity={0.5}
            enableHover={true}
          >
            Not Found
          </FuzzyText>
        </div>
      </div>
    </FadeContent>
  );
};

export default NotFound;
