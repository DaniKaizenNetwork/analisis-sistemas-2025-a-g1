// components/Layout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head'; // Importante para Pages Router

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  const title = pageTitle ? `${pageTitle} | Mi Blog` : 'Mi Blog Personal';
  return (
    <>
      {/* Para Pages Router, Head se maneja aquí o en _app.tsx.
          Para App Router, metadata se define en page.tsx o layout.tsx.
          Este Head es más relevante para Pages Router. */}
      <Head>
        <title>{title}</title>
        <meta name="description" content="Un blog personal sobre tecnología y desarrollo" />
        {/* Puedes añadir más meta tags aquí */}
      </Head>
      <header style={{ background: 'var(--card-background)', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5%'}}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-light)' }}>
            Mi Blog
          </Link>
          <nav>
            <Link href="/" style={{ marginRight: '1rem' }}>
              Inicio
            </Link>
            <Link href="/posts/new" className="button button-secondary" style={{padding: '0.5rem 1rem'}}>
              Nueva Entrada
            </Link>
          </nav>
        </div>
      </header>
      <main className="container">
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '2rem 0', marginTop: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
        <p>&copy; {new Date().getFullYear()} Mi Blog Personal. Inspirado visualmente.</p>
      </footer>
    </>
  );
};

export default Layout;