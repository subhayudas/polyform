
import * as z from 'zod';

export const vendorFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  businessType: z.string().min(1, 'Business type is required'),
  experienceYears: z.number().min(0, 'Experience years must be 0 or greater'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  productionCapacity: z.string().min(1, 'Production capacity is required'),
});

export type VendorFormData = z.infer<typeof vendorFormSchema>;
