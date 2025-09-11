// src/components/login-form.tsx
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import authorImage from '../Images/birdie-in-studio.jpg';
import { Link, useNavigate } from 'react-router-dom';
import TextType from './ui/ReactBits/TextType ';
import { IconLogin2 } from '@tabler/icons-react';
import { useTheme } from '@/contexts/theme-provider';
import toast from 'react-hot-toast';
// import { set } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext'; // <-- Import useAuth

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuth(); // <-- Get the login function from the context
  // Use useEffect to handle the redirect
  useEffect(() => {
    // Check if the user is already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]); // The effect re-runs when isAuthenticated or navigate changes

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const toastStyles = {
      style: {
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',
      },
    };
    await toast.promise(
      (async () => {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/admin-login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed');
        }

        // --- THE CRITICAL FIX ---
        // Call the login function from the AuthContext with the user data
        // add in avatar url to user
        login(data.user); // Assuming your backend returns a 'user' object with email and avatarUrl
        setEmail('');
        setPassword('');
        navigate('/');
      })(),
      {
        loading: 'Logging in...',
        success: 'Logged in created successfully',
        error: (err) => err.message || 'Failed to login admin',
      },
      toastStyles
    );
  };
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link to="/" className="flex flex-col items-center gap-2">
              <Avatar className="h-32 w-32 border hover:brightness-[0.7] transition duration-300">
                <AvatarImage src={authorImage} />
                <AvatarFallback>{`Birdie Bands`}</AvatarFallback>
              </Avatar>
              {/* <h1 className="!text-xl font-bold !text-foreground">
                Welcome back, Birdie ✨
              </h1> */}
              <TextType
                className="!text-xl font-bold !text-foreground"
                text={[
                  'Welcome back, Birdie ✨',
                  'Login to your account',
                  'Lets get this money 💸',
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />
            </Link>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="birdie@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
              <IconLogin2 />
            </Button>
          </div>
          {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Continue with Apple
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div> */}
        </div>
      </form>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
