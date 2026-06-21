export default function BotProfile({ params }) {
  const { id } = params;

  // Placeholder bot data (later we will load real data)
  const bot = {
    name: "Unnamed Bot",
    avatar: "🤖",
    personality: "Unknown",
  };

  return (
    <main style={{ padding: "60px" }}>
      <h1>Bot Profile</h1>
      <p>This is the public page for your MeBot.</p>

      <div
        style={{
          marginTop: "40px",
          padding: "30px",
          background: "#0a0f24",
          borderRadius: "12px",
          width: "400px",
        }}
      >
        <h2>{bot.avatar} {bot.name}</h2>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Personality:</strong> {bot.personality}</p>
      </div>
    </main>
  );
}
