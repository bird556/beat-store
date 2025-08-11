import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
const FAQS = ({ size }: { size: string }) => {
  return (
    <div className="flex flex-col justify-center self-center md:min-w-6xl">
      <div className="z-50 flex flex-col gap-12">
        <h2 className={`font-bold ${size}`}>FAQS</h2>
        <Accordion
          type="single"
          // collapsible
          className="max-lg:max-w-lg mx-auto z-10 max-sm:text-start min-[1200px]:min-w-6xl"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="!text-black dark:!text-white !bg-transparent">
              How do I receive my beats?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start pl-6 max-sm:pl-6">
              <p>
                After purchase, you’ll receive an email with a download link.
                This link is valid for 7 days. If it expires, you can contact us
                for a new one.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="!text-black dark:!text-white !bg-transparent">
              Do you offer refunds?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start pl-6 max-sm:pl-6">
              <p>
                All sales are final. Since our products are digital and
                delivered instantly, we do not offer refunds or cancellations
                after purchase.
              </p>
              <p>
                Exceptions are made only for duplicate transactions or technical
                issues that prevent access to your files. Contact us if you need
                help.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="!text-black dark:!text-white !bg-transparent">
              Can I resell your beats after purchasing?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start pl-6 max-sm:pl-6">
              <p>
                No, reselling or redistributing our beats is strictly
                prohibited—even with an exclusive license. You may only use them
                as part of your own original music.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="!text-black dark:!text-white !bg-transparent">
              Can I register the beat or song with YouTube Content ID?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start pl-6 max-sm:pl-6">
              <p>
                Under non-exclusive licenses (Basic, Premium, Professional,
                Legacy), registering the beat or your song with any Content
                Identification System (like YouTube Content ID, TuneCore, or
                CDBaby) is strictly prohibited.
              </p>
              <p>
                However, if you purchase an <strong>Exclusive License</strong>,
                you gain full ownership of the beat and may register your song
                with YouTube Content ID and other platforms.
              </p>
              D
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="!text-black dark:!text-white !bg-transparent">
              Can I use the beat in multiple songs?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start pl-6 max-sm:pl-6">
              <p>
                Only Exclusive License holders may use the beat in multiple
                songs. All other licenses allow use in one (1) new song only.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="!text-black dark:!text-white !bg-transparent">
              Do I own the beat after purchase?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start pl-6 max-sm:pl-6">
              <p>
                With non-exclusive licenses, the producer retains ownership of
                the beat. You own your lyrics and original musical elements.
              </p>
              <p>
                With an Exclusive License, full ownership of the beat is
                transferred to you.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="!text-black dark:!text-white !bg-transparent">
              How should I credit the producer?
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-start pl-6 max-sm:pl-6">
              <p>
                You must credit the producer in all media formats where your
                song appears. Use the format:{' '}
                <strong>"Produced by Birdie Bands"</strong>.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQS;
