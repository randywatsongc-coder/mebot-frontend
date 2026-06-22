import './styles/globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'MeBot',
  description: 'Create and chat with your own AI bots',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          background: '#f3f4f6',
          borderBottom: '1px solid #ddd'
        }}>
          <Link href="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
            Home
          </Link>

          <Link href="/create" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
            Create Bot
          </Link>

          <Link href="/bots" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
            Your Bots
          </Link>
        </nav>

        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
