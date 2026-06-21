export default function Home() {
  return (
    <main style={{ padding: '60px', textAlign: 'center' }}>
      <h1>MeBot</h1>
      <p>The AI-powered creation hub where anyone can build, showcase, and share.</p>

      <div style={{ marginTop: '40px' }}>
        <button
          style={{
            padding: '14px 28px',
            background: '#6366f1',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Create Your Bot
        </button>
      </div>
    </main>
  );
}
