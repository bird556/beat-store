import { Link } from 'react-router-dom';

import { format } from 'date-fns';
import { Lightbulb } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BirdieBandsBlogAvatar from '../src/Images/BirdieBands-Brand-Logo-Transparent.png';
const defaultPost = {
  title: 'Designing websites faster with shadcn/ui',
  authorName: 'Birdie Bands',
  image: 'https://cdn.mos.cms.futurecdn.net/C8AovEYFC229RwpHxmWSCb-1200-80.jpg',
  pubDate: new Date(),
  description:
    'A step-by-step guide to building a modern, responsive blog using React and Tailwind CSS.',
  authorImage: BirdieBandsBlogAvatar,
};

interface BlogPostData {
  title: string;
  authorName: string;
  image: string;
  pubDate: Date;
  description: string;
  authorImage: string;
}

const Blogpost1 = ({ post = defaultPost }: { post?: BlogPostData }) => {
  const { authorName, image, pubDate, authorImage } = post;
  return (
    <>
      <section className="py-32 !z-50 !relative text-start dark:bg-black">
        <div className="container !z-50 !relative">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <h1 className="max-w-3xl text-pretty text-5xl font-semibold md:text-6xl">
              Why I’m Obsessed with Guitar FX Pedals 🎸
            </h1>
            <h3 className="text-muted-foreground max-w-3xl text-lg md:text-xl">
              From gritty fuzz to spacey delays, guitar pedals unlock sonic
              worlds—and Flying Auto-Wahwah is my gateway drug.
            </h3>
            <div className="flex items-center gap-3 text-sm md:text-base">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={authorImage} />
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-foreground">
                <a href="#" className="font-semibold dark:!text-green-400">
                  {authorName}
                </a>
                <span className="ml-1">
                  on {format(pubDate, 'MMMM d, yyyy')}
                </span>
              </span>
            </div>
            {/* First image: general guitar pedals */}
            <img
              src={image}
              alt="Guitar FX pedals"
              className="mb-8 mt-4 aspect-video w-full rounded-lg border object-cover"
            />
          </div>
        </div>

        <div className="container">
          <div className="prose dark:prose-invert mx-auto max-w-3xl flex flex-col gap-16">
            <div>
              <h2 className="text-3xl font-extrabold">
                The Magic of FX Pedals
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">
                Guitar FX pedals are more than tools—they’re portals. Each
                stompbox is a personality, a mood, a story. Whether it’s a
                crunchy distortion or a dreamy reverb, pedals let you sculpt
                sound like clay.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Flying Auto-Wahwah: My Favorite
              </h2>
              {/* Second image: Flying Auto-Wahwah DSP */}
              <img
                src="https://superflydsp.com/wp-content/uploads/2020/06/SuperflyDSP_Wahwah-897x620.png"
                alt="Flying Auto-Wahwah pedal"
                className="my-8 aspect-video w-full rounded-md object-cover"
              />
              <p>
                The Flying Auto-Wahwah by SuperflyDSP is pure funk wizardry. It
                responds to your playing dynamics, creating expressive sweeps
                that make your guitar talk. It’s like having a wah pedal with a
                mind of its own.
              </p>
              <blockquote className="prose italic font-medium text-[color:var(--tw-prose-quotes)] border-l-4 border-[color:var(--tw-prose-quote-borders)] mt-[1.6em] mb-[1.6em] pl-[1em]">
                “It’s not just a pedal—it’s a personality amplifier.”
              </blockquote>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Why I’m Learning Guitar</h2>
              <p>
                I didn’t grow up playing guitar. But discovering FX pedals lit a
                fire in me. I wanted to understand how sound works, how tone
                evolves, and how emotion flows through strings. Learning guitar
                became a way to connect with that magic.
              </p>
              <ul className="list-disc list-inside">
                <li>It’s meditative and expressive</li>
                <li>It connects you to music on a deeper level</li>
                <li>It’s never too late to start</li>
              </ul>
              <p>
                If you’ve ever felt drawn to music, pick up a guitar. Even if
                you just learn a few chords, you’ll feel something shift inside
                you. And once you plug into a pedalboard? Game over. You’re
                hooked.
              </p>
            </div>

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className="text-start">Pro Tip!</AlertTitle>
              <AlertDescription>
                Start with a simple setup: one guitar, one amp, one pedal. Let
                your curiosity guide you from there.
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Link
          to="/blogs"
          className="my-16 flex items-center gap-2 text-center justify-center font-medium !text-foreground hover:text-foreground transition-colors"
        >
          ← Back to Blog
        </Link>
      </section>
    </>
  );
};

// export { Blogpost1 };
export default Blogpost1;
