export const metadata = {
  title: "MeBot",
  description: "Your personal AI companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#020617",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
