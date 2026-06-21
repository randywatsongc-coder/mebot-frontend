export const metadata = {
  title: 'MeBot',
  description: 'MeBot – AI creation and showcase platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          backgroundColor: '#050816',
          color: '#f9fafb',
        }}
      >
        {children}
      </body>
    </html>
  );
}
