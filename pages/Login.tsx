import { LoginForm } from '../src/components/login-form';
import StudioVideo from '/Videos/music-studio.mp4';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { IconHome } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
const Login = () => {
  document.title = `Birdie Bands | Admin Login`;
  return (
    <div className="bg-background z-50 relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <video
        autoPlay
        loop
        muted
        className="hidden  fixed !pointer-events-none h-screen object-cover  scale-200  z-0 dark:md:block brightness-[0.05]"
        src={StudioVideo}
      />
      <div className="w-full max-w-sm z-50">
        <LoginForm />
      </div>
      <div className=" fixed top-4 left-4 z-!50 ">
        <Link to="/">
          <Button className="bg-transparent !text-foreground hover:bg-transparent hover:underline shadow-none">
            <IconHome />
            Home
          </Button>
        </Link>
      </div>
      <div className=" fixed top-4 right-4 z-!50 ">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Login;
