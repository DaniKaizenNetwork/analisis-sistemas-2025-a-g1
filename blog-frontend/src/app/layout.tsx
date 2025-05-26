// app/layout.tsx
import './globals.css';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Mi Blog Personal',
  description: 'Un blog creado con Next.js y NestJS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={montserrat.className}>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}