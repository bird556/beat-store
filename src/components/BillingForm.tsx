import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface CustomerInfo {
  name: string;
  email: string;
  emailConfirm: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function BillingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    email: '',
    emailConfirm: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load saved data from sessionStorage
  useEffect(() => {
    const savedInfo = sessionStorage.getItem('customerInfo');
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo);
        setFormData((prev) => ({
          ...prev,
          name: parsedInfo.name || '',
          email: parsedInfo.email || '',
          emailConfirm: parsedInfo.email || '', // Pre-fill emailConfirm with email
          address: parsedInfo.address || '',
          city: parsedInfo.city || '',
          state: parsedInfo.state || '',
          zip: parsedInfo.zip || '',
          country: parsedInfo.country || '',
        }));
      } catch (e) {
        console.error('Error parsing customer info:', e);
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      newErrors.email = 'Valid email is required';
    if (!formData.emailConfirm.trim())
      newErrors.emailConfirm = 'Email confirmation is required';
    else if (formData.emailConfirm !== formData.email)
      newErrors.emailConfirm = 'Emails must match';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      // Save only necessary fields to sessionStorage (exclude emailConfirm)
      const { emailConfirm, ...dataToSave } = formData;
      sessionStorage.setItem('customerInfo', JSON.stringify(dataToSave));
      // Redirect back to checkout
      navigate('/checkout');
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Capitalize each word if it's the name field
    /*
    let processedValue = value;
    if (name === 'name') {
      processedValue = value
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
*/
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof CustomerInfo]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <Card className="dark:bg-zinc-900/0 dark:border-white/10 shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">
            Billing Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="dark:dark:bg-zinc-800 border-white/10 text-foreground"
                required
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="dark:bg-zinc-800 border-white/10 text-foreground"
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailConfirm">
                Confirm Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="emailConfirm"
                name="emailConfirm"
                type="email"
                value={formData.emailConfirm}
                onChange={handleInputChange}
                className="dark:bg-zinc-800 border-white/10 text-foreground"
                required
              />
              {errors.emailConfirm && (
                <p className="text-red-400 text-sm">{errors.emailConfirm}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address <span className="text-red-400">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="dark:bg-zinc-800 border-white/10 text-foreground"
                required
              />
              {errors.address && (
                <p className="text-red-400 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="dark:bg-zinc-800 border-white/10 text-foreground"
                  required
                />
                {errors.city && (
                  <p className="text-red-400 text-sm">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  State <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="dark:bg-zinc-800 border-white/10 text-foreground"
                  required
                />
                {errors.state && (
                  <p className="text-red-400 text-sm">{errors.state}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip">
                  ZIP Code <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  className="dark:bg-zinc-800 border-white/10 text-foreground"
                  required
                />
                {errors.zip && (
                  <p className="text-red-400 text-sm">{errors.zip}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">
                  Country <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="dark:bg-zinc-800 border-white/10 text-foreground"
                  required
                />
                {errors.country && (
                  <p className="text-red-400 text-sm">{errors.country}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-400 text-black hover:bg-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit Billing Information'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
