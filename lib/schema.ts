import { z } from 'zod';

export const rsvpSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(100),
  attendance: z.enum(['accept', 'decline']),
  dietary: z.enum(['standard', 'vegan', 'gluten-free', 'allergies']),
  message: z.string().trim().max(1000).optional().default(''),
});

export type RSVPInput = z.infer<typeof rsvpSchema>;
