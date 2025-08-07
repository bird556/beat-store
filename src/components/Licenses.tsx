import React from 'react';
import { HoverEffect } from './ui/card-hover-effect';
import { ModalBody } from '@heroui/modal';
import { useLicenses } from '../contexts/LicenseContext';
const Licenses = () => {
  const { loading } = useLicenses();
  return (
    <>
      <div className="flex flex-col gap-12 py-12">
        <h2 className="font-bold text-2xl">Licensing Info</h2>
        <div className="max-w-lg md:max-w-6xl mx-auto px-8">
          <HoverEffect
            items={useProjects() as any}
            isLoading={loading as boolean}
          />
        </div>
      </div>
    </>
  );
};

export default Licenses;

export const useProjects = () => {
  // const licenses = useLicenses();
  const { licenses } = useLicenses();
  const clickTime = new Date();
  const formattedDate = clickTime.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });
  const formattedTime = clickTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return licenses.map((license) => ({
    id: license._id,
    title: license.title,
    description: license.description,
    link: '#',
    bulletPoints: license.features,
    licenseInfo: () => <>{LicenseTemplate(formattedDate, formattedTime)}</>,
  }));
};

export const projects = [
  {
    title: 'MP3 Lease',
    description: 'Standard license for MP3 distribution and commercial use.',
    link: '#',
    bulletPoints: [
      'Per 5,000 Units',
      'MP3, Untagged',
      'Sell up to 5,000 units',
      'Commercial Use',
      'Birdie Bands maintains full ownership of the instrumental',
      "Must credit 'Prod. Birdie Bands'",
    ],
    licenseInfo: (clickTime = new Date()) => {
      const formattedDate = clickTime.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
      const formattedTime = clickTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return <>{LicenseTemplate(formattedDate, formattedTime)}</>;
    },
  },
  {
    title: 'MP3 Lease',
    description:
      'A technology company that builds economic infrastructure for the internet.',
    link: '#',
    bulletPoints: [
      'Per 5,000 Units',
      'MP3, Untagged',
      'Sell up to 5,000 units',
      'Commercial Use',
      'Birdie Bands maintains full ownership of the instrumental',
      "Must credit 'Prod. Birdie Bands'",
    ],
    licenseInfo: (clickTime = new Date()) => {
      const formattedDate = clickTime.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
      const formattedTime = clickTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return <>{LicenseTemplate(formattedDate, formattedTime)}</>;
    },
  },
  {
    title: 'MP3 Lease',
    description:
      'A technology company that builds economic infrastructure for the internet.',
    link: '#',
    bulletPoints: [
      'Per 5,000 Units',
      'MP3, Untagged',
      'Sell up to 5,000 units',
      'Commercial Use',
      'Birdie Bands maintains full ownership of the instrumental',
      "Must credit 'Prod. Birdie Bands'",
    ],
    licenseInfo: (clickTime = new Date()) => {
      const formattedDate = clickTime.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
      const formattedTime = clickTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return <>{LicenseTemplate(formattedDate, formattedTime)}</>;
    },
  },
  {
    title: 'Unlimited Lease',
    description: 'Own the master',
    link: 'https://meta.com',
    bulletPoints: [
      'WAV Trackouts, Untagged',
      'Sell Unlimited Units',
      'Commercial Use',
      'Birdie Bands maintains full ownership of the instrumental',
      "Must credit 'Prod. Birdie Bands'",
    ],
    licenseInfo: (clickTime = new Date()) => {
      const formattedDate = clickTime.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
      const formattedTime = clickTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return <>{LicenseTemplate(formattedDate, formattedTime)}</>;
    },
  },
  {
    title: 'Exclusive',
    description: 'Own the master',
    link: 'https://meta.com',
    bulletPoints: [
      'Per 5,000 Units',
      'MP3, Untagged',
      'Sell up to 5,000 units',
      'Commercial Use',
      'Birdie Bands maintains full ownership of the instrumental',
      "Must credit 'Prod. Birdie Bands'",
    ],
    licenseInfo: (clickTime = new Date()) => {
      const formattedDate = clickTime.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });
      const formattedTime = clickTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return <>{LicenseTemplate(formattedDate, formattedTime)}</>;
    },
  },
];

const LicenseTemplate = (formattedDate: string, formattedTime: string) => {
  return (
    <ModalBody className="bg-zinc-900 whitespace-pre-line text-justify text-foreground overflow-y-scroll">
      {/* Introductory Paragraph */}
      <div>
        <p>
          THIS LICENSE AGREEMENT is made on{' '}
          <b>
            {formattedDate}, {formattedTime}
          </b>{' '}
          ("Effective Date") by and between Licensee (hereinafter referred to as
          the "Licensee") also, if applicable, professionally known as{' '}
          <b>Licensee</b>, and <b>Preview Only</b> ("Songwriter"). (hereinafter
          referred to as the "Licensor"). Licensor warrants that it controls the
          mechanical rights in and to the copyrighted musical work entitled{' '}
          <b>Preview Track Only</b> ("Composition") as of and prior to the date
          first written above. The Composition, including the music thereof, was
          composed by <b>Preview Only</b> ("Songwriter") managed under the
          Licensor.
        </p>
      </div>

      {/* Non-refundable Clause */}
      <div>
        <p>
          All licenses are <b>non-refundable</b> and <b>non-transferable</b>.
        </p>
      </div>

      {/* Master Use */}
      <div>
        <h2 className="text-xl font-bold">Master Use</h2>
        <p>
          The Licensor hereby grants to Licensee a <b>non-exclusive license</b>{' '}
          (this "License") to record vocal synchronization to the Composition
          partly or in its entirety and substantially in its original form
          ("Master Recording").
        </p>
      </div>

      {/* Mechanical Rights Section */}
      <div>
        <h2 className="text-xl font-bold">Mechanical Rights</h2>
        <p>
          The Licensor hereby grants to Licensee a <b>non-exclusive license</b>{' '}
          to use Master Recording in the reproduction, duplication, manufacture,
          and distribution of phonograph records, cassette tapes, compact disk,
          digital downloads, other miscellaneous audio and digital recordings,
          and any lifts and versions thereof (collectively, the "Recordings",
          and individually, a "Recordings") worldwide for up to the pressing or
          selling a total of <b>*() copies</b> of such Recordings or any
          combination of such Recordings, condition upon the payment to the
          Licensor a sum of <b>* dollars ($39.99**)</b>, receipt of which is
          confirmed. Additionally licensee shall be permitted to distribute{' '}
          <b>Unlimited free internet downloads or streams</b> for non-profit and
          non-commercial use. This license allows up to{' '}
          <b>Five Hundred Thousand (500000) monetized audio streams</b> to sites
          like (Spotify, RDIO, Rhapsody) but{' '}
          <b>not eligible for monetization on YouTube.</b>
        </p>
      </div>

      {/* Performance Rights Section */}
      <div>
        <h2 className="text-xl font-bold">Performance Rights</h2>
        <p>
          The Licensor hereby grants to Licensee a <b>non-exclusive license</b>{' '}
          to use the Master Recording in{' '}
          <b>Unlimited non-profit performances, shows, or concerts</b>. Licensee
          may receive compensation from performances with this license.
        </p>
      </div>

      {/* Synchronization Rights Section */}
      <div>
        <h2 className="text-xl font-bold">Synchronization Rights</h2>
        <p>
          The Licensor hereby grants <b>limited synchronization rights</b> for{' '}
          <b>One (1) music video</b> streamed online (YouTube, Vimeo, etc.) for
          up to <b>*non-monetized* video streams</b> on all total sites. A
          separate synchronization license will need to be purchased for
          distribution of video to Television, Film or Video game.
        </p>
      </div>

      {/* Broadcast Rights Section */}
      <div>
        <h2 className="text-xl font-bold">Broadcast Rights</h2>
        <p>
          The Licensor hereby grants to Licensee <b>no broadcasting rights</b>.
        </p>
      </div>

      {/* Credit Section */}
      <div>
        <h2 className="text-xl font-bold">Credit</h2>
        <p>
          Licensee shall acknowledge the original authorship of the Composition
          appropriately and reasonably in all media and performance formats
          under the name <b>"Preview Only"</b> in writing where possible and
          vocally otherwise.
        </p>
      </div>

      {/* Consideration Section */}
      <div>
        <h2 className="text-xl font-bold">Consideration</h2>
        <p>
          In consideration for the rights granted under this agreement, Licensee
          shall pay to licensor the sum of <b>$39.99 US dollars</b> and other
          good and valuable consideration, payable to <b>"Preview Only"</b>,
          receipt of which is hereby acknowledged. If the Licensee fails to
          account to the Licensor, timely complete the payments provided for
          hereunder, or perform its other obligations hereunder, including
          having insufficient bank balance, the licensor shall have the right to
          terminate License upon written notice to the Licensee. Such
          termination shall render the recording, manufacture and/or
          distribution of Recordings for which monies have not been paid subject
          to and actionable infringements under applicable law, including,
          without limitation, the United States Copyright Act, as amended.
        </p>
      </div>

      {/* Indemnification Section */}
      <div>
        <h2 className="text-xl font-bold">Indemnification</h2>
        <p>
          Accordingly, Licensee agrees to indemnify and hold Licensor harmless
          from and against any and all claims, losses, damages, costs, expenses,
          including, without limitation, reasonable attorney's fees, arising of
          or resulting from a claimed breach of any of Licensee's
          representations, warranties or agreements hereunder.
        </p>
      </div>

      {/* Audio Samples Section */}
      <div>
        <h2 className="text-xl font-bold">Audio Samples</h2>
        <p>3rd party sample clearance is the responsibility of the licensee.</p>
      </div>

      {/* Miscellaneous Section */}
      <div>
        <h2 className="text-xl font-bold">Miscellaneous</h2>
        <p>
          This license is <b>non-transferable</b> and is limited to the
          Composition specified above, does not convey or grant any right of
          public performance for profit, constitutes the entire agreement
          between the Licensor and the Licensee relating to the Composition, and
          shall be binding upon both the Licensor and the Licensee and their
          respective successors, assigns, and legal representatives.
        </p>
      </div>
    </ModalBody>
  );
};
