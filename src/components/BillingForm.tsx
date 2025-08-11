import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { CustomerInfo } from '../types';

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
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load Google Places API script dynamically
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES;
    if (!apiKey) {
      console.log('Google Places API key is missing. Autocomplete disabled.');
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initAutocomplete;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    if (!inputRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: {
          country: ['us', 'ca', 'mx', 'de', 'gb', 'fr', 'cn', 'jp', 'kr', 'br'],
        }, // Restrict to US and Canada, adjust as needed
        fields: ['address_components'], // Only fetch address components
      }
    );

    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  };

  // Handle place selection and update form fields
  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    const addressComponents = place.address_components || [];
    const updatedFormData: Partial<CustomerInfo> = {};

    addressComponents.forEach((component) => {
      const types = component.types;
      if (types.includes('street_number') || types.includes('route')) {
        updatedFormData.address = updatedFormData.address
          ? `${updatedFormData.address} ${component.long_name}`
          : component.long_name;
      }
      if (types.includes('locality')) {
        updatedFormData.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        updatedFormData.state = component.short_name; // e.g., "ON" for Ontario
      }
      if (types.includes('postal_code')) {
        updatedFormData.zip = component.long_name;
      }
      if (types.includes('country')) {
        updatedFormData.country = component.short_name; // e.g., "CA" for Canada
      }
    });

    setFormData((prev) => ({
      ...prev,
      ...updatedFormData,
      address: updatedFormData.address || prev.address,
      city: updatedFormData.city || prev.city,
      state: updatedFormData.state || prev.state,
      zip: updatedFormData.zip || prev.zip,
      country: updatedFormData.country || prev.country,
    }));

    // Clear errors for updated fields
    setErrors((prev) => ({
      ...prev,
      address: undefined,
      city: undefined,
      state: undefined,
      zip: undefined,
      country: undefined,
    }));
  };

  // Sample country list (ISO 3166-1 alpha-2 codes)
  const countries = useMemo(
    () => [
      // North America
      { code: 'US', name: 'United States' },
      { code: 'CA', name: 'Canada' },
      { code: 'MX', name: 'Mexico' },

      // Europe
      { code: 'DE', name: 'Germany' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'FR', name: 'France' },

      // Asia-Pacific
      { code: 'CN', name: 'China' },
      { code: 'JP', name: 'Japan' },
      { code: 'KR', name: 'South Korea' },

      // Latin America
      { code: 'BR', name: 'Brazil' },
      // Add other countries as needed
    ],
    []
  );

  // Load saved data from sessionStorage
  useEffect(() => {
    const savedInfo = sessionStorage.getItem('customerInfo');
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo);
        setFormData((prev) => {
          const loadedData = {
            name: parsedInfo.name || '',
            email: parsedInfo.email || '',
            emailConfirm: parsedInfo.email || '',
            address: parsedInfo.address || '',
            city: parsedInfo.city || '',
            state: parsedInfo.state || '',
            zip: parsedInfo.zip || '',
            country: parsedInfo.country || '',
          };
          // Ensure country is a valid ISO code
          return {
            ...prev,
            ...loadedData,
            country: countries.some((c) => c.code === loadedData.country)
              ? loadedData.country
              : '',
          };
        });
      } catch (e) {
        console.error('Error parsing customer info:', e);
      }
    }
  }, [countries]);

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
    else if (!/^[A-Z]{2}$/.test(formData.country))
      newErrors.country =
        'Country must be a valid ISO code (e.g., CA for Canada)';

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
    // setFormData((prev) => ({ ...prev, [name]: value }));
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
                ref={inputRef}
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
                {/* <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="dark:bg-zinc-800 border-white/10 text-foreground"
                  required
                /> */}
                <Select
                  name="country"
                  value={formData.country}
                  defaultValue={formData.country}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, country: value }))
                  }
                >
                  <SelectTrigger className="dark:bg-zinc-800 border-white/10 text-foreground">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
