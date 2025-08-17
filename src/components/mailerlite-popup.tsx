import { useState, useEffect } from 'react';
import React from 'react'; // Add this import
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X, Loader2 } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1>Something went wrong in the popup. Please try again later.</h1>
      );
    }
    return this.props.children;
  }
}

const POPUP_STORAGE_KEY = 'mailerlite_popup_shown_at';

export function MailerlitePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

    if (!lastShown || Date.now() - parseInt(lastShown, 10) > oneWeekInMs) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);

      localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL_BACKEND;
      if (!apiUrl) throw new Error('API base URL is not configured');

      const response = await fetch(`${apiUrl}/api/mailerlite/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Subscription failed');
      }

      const result = await response.json();
      console.log('Subscription successful:', result);
      setIsOpen(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
          <DialogHeader>
            <DialogTitle>Exclusive Beat Drops</DialogTitle>
            <DialogDescription>
              Be the First to Drop New Beats! Sign up now to get exclusive
              notifications about the latest type beats and instrumentals from
              Birdie Bands. Don&apos;t miss out.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="newsletter"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(!!checked)}
                required
              />
              <Label htmlFor="newsletter">
                I agree to receive newsletters and updates from Birdie Bands
              </Label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </span>
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}
