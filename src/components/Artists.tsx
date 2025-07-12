import React from 'react';
import TiltedCard from './ui/ReactBits/TitledCard';
import { useNavigate } from 'react-router-dom';
const Artists = ({ size, setSearchTerm }) => {
  const navigate = useNavigate();
  const handleCardClick = (term) => {
    navigate(`/beats?search=${encodeURIComponent(term)}`); // Navigates to the '/dashboard' route
  };
  return (
    <>
      <div className="flex flex-col gap-12">
        <h2 className={`font-bold ${size}`}>Artist Type Beats</h2>
        <div className="flex gap-24 flex-wrap justify-center z-10">
          <div onClick={() => handleCardClick('Key Glock')}>
            <TiltedCard
              // imageSrc="https://i.pinimg.com/736x/a2/3b/a7/a23ba7a9cdb5d504d7e847f6bcbada7b.jpg"
              // imageSrc="https://archive.illroots.com/uploads/articles/48213/image/1528414779/search_results.gif?1528416975"
              imageSrc="https://i.imgur.com/sCUT5zd.gif"
              altText="Key Glock Type Beats"
              captionText="Key Glock Type Beats"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="bg-background/50 m-6 p-3 rounded-2xl font-bold">
                  Key Glock Type Beats
                </p>
              }
            />
          </div>
          <div onClick={() => handleCardClick('Larry June')}>
            <TiltedCard
              // imageSrc="https://i.pinimg.com/736x/d4/bd/5c/d4bd5cc9eefe2ca4859d21345429bc90.jpg"
              imageSrc="https://grungecake.com/wp-content/uploads/2021/09/larry-june-cardo-dont-try-it-grungecake-thumbnail.gif"
              altText="Larry June Type Beats"
              captionText="Larry June Type Beats"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="bg-background/50 m-6 p-3 rounded-2xl font-bold">
                  Larry June Type Beats
                </p>
              }
            />
          </div>

          <div onClick={() => handleCardClick('Gunna')}>
            <TiltedCard
              // imageSrc="https://i.pinimg.com/736x/7f/05/ae/7f05ae439f3695ca4626c2d104d48e67.jpg"
              imageSrc="https://i0.wp.com/grungecake.com/wp-content/uploads/2022/01/gunna-too-easy-remix-grungecake-thumbnail.gif?fit=520%2C293&ssl=1"
              altText="Gunna Type Beats"
              captionText="Gunna Type Beats"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <p className="bg-background/50 m-6 p-3 rounded-2xl font-bold">
                  Gunna Type Beats
                </p>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Artists;
