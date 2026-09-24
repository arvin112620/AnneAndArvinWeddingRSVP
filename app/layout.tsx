import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { ScrollEffects } from '@/components/ScrollEffects';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arvin & Anne | Our Wedding',
  description: 'A warm invitation to celebrate with Arvin and Anne.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider><ScrollEffects />{children}</AuthProvider></body></html>;
}
