import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
  tags: string[];
}

interface Blog7Props {
  tagline: string;
  heading: string;
}

// framer motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between items
    },
  },
};

const Blog7 = ({
  tagline = 'Latest Updates',
  heading = 'Blog Posts',
}: Blog7Props) => {
  const [loading, setLoading] = useState(true);
  const posts: Post[] = [
    {
      id: 'post-1',
      title: 'Why I’m Obsessed with Guitar FX Pedals 🎸',
      summary:
        "Discover how guitar FX pedals—especially the Flying Auto-Wahwah—sparked my journey into learning guitar. From tone-shaping magic to expressive soundscapes, this post dives into why pedals are more than gear—they're inspiration.",
      label: 'Music & Gear',
      author: 'Birdie Bands',
      published: 'September 10, 2025',
      url: 'https://shadcnblocks.com',
      image:
        'https://cdn.mos.cms.futurecdn.net/C8AovEYFC229RwpHxmWSCb-1200-80.jpg',
      tags: ['Guitar', 'FX Pedals', 'Auto-Wahwah', 'Music Inspiration'],
    },
  ];
  const description =
    "Explore the world of music production with Birdie Bands. From crafting melodies and layering effects to mixing, mastering, and marketing your beats—this blog dives deep into everything music creators need. Whether you're learning sound design, running ads, or building your beat empire, you'll find tutorials, insights, and inspiration tailored for producers who want to level up.";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // 1 seconds
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="py-16 z-50 relative">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
          <Button variant="link" className="w-full sm:w-auto" asChild></Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="!h-[500px] w-[300px]" />
              ))
            : posts.map((post) => (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="space-y-2 z-10"
                >
                  <Card
                    key={post.id}
                    className=" !overflow-hidden grid grid-rows-[auto_auto_1fr_auto] pt-0"
                  >
                    <div className="aspect-16/9 w-full !overflow-hidden">
                      <Link
                        to={`/blog/${post.id}`}
                        state={{ post }} // Pass post data to Blogpost1
                        className="transition-opacity duration-200 fade-in hover:opacity-70"
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </Link>
                    </div>
                    <CardHeader>
                      <div className="mb-4 md:mb-6">
                        <div className="flex items-center justify-center flex-wrap gap-3 text-xs tracking-wider text-muted-foreground uppercase md:gap-5 lg:gap-6">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span key={index}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold hover:underline md:text-xl">
                        <Link
                          className="!text-foreground hover:underline"
                          to={`/blog/${post.id}`}
                        >
                          {post.title}
                        </Link>
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{post.summary}</p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        to={`/blog/${post.id}`}
                        state={{ post }}
                        className=" flex items-center !text-foreground hover:!underline"
                      >
                        Read more
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
          {}
        </div>
      </div>
    </section>
  );
};

// export { Blog7 };
export default Blog7;
