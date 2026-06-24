export default function NotFound() {
  return (
    <main
      style={{
        padding: "60px",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>404</h1>
      <p style={{ opacity: 0.7, marginBottom: "30px" }}>
        This page doesn’t exist in the MeBot universe.
      </p>

      <a
        href="/"
        style={{
          padding: "12px 20px",
          background: "#6366f1",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Go Home
      </a>
    </main>
  );
}
