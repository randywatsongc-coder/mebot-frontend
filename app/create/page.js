'use client';
import { useState } from 'react';

export default function CreateBot() {
  const [botName, setBotName] = useState('');
  const [avatar, setAvatar] = useState('robot');
  const [personality, setPersonality] = useState('');
  const [customPersonality, setCustomPersonality] = useState('');

  return (
    <main style={{ padding: '60px' }}>
      <h1>Create Your Bot</h1>
      <p>Start building your AI-powered MeBot here.</p>

      {/* Bot Name */}
      <div style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="Bot Name"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
          style={{
            padding: '12px',
            width: '300px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: '#0a0f24',
            color: '#fff'
          }}
        />
      </div>

      {/* Avatar Selection */}
      <h3 style={{ marginTop: '40px' }}>Choose an Avatar</h3>

      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        <button
          onClick={() => setAvatar('robot')}
          style={{
            padding: '10px 20px',
            background: avatar === 'robot' ? '#6366f1' : '#1f2937',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          🤖 Robot
        </button>

        <button
          onClick={() => setAvatar('alien')}
          style={{
            padding: '10px 20px',
            background: avatar === 'alien' ? '#6366f1' : '#1f2937',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          👽 Alien
        </button>

        <button
          onClick={() => setAvatar('wizard')}
          style={{
            padding: '10px 20px',
            background: avatar === 'wizard' ? '#6366f1' : '#1f2937',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          🧙 Wizard
        </button>
      </div>

      {/* Personality Selection */}
      <h3 style={{ marginTop: '40px' }}>Choose a Personality</h3>

      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        <button
          onClick={() => {
            setPersonality('friendly');
            setCustomPersonality('');
          }}
          style={{
            padding: '10px 20px',
            background: personality === 'friendly' ? '#6366f1' : '#1f2937',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          😊 Friendly
        </button>

        <button
          onClick={() => {
            setPersonality('serious');
            setCustomPersonality('');
          }}
          style={{
            padding: '10px 20px',
            background: personality === 'serious' ? '#6366f1' : '#1f2937',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          🧠 Serious
        </button>

        <button
          onClick={() => {
            setPersonality('funny');
            setCustomPersonality('');
          }}
          style={{
            padding: '10px 20px',
            background: personality === 'funny' ? '#6366f1' : '#1f2937',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          😂 Funny
        </button>
      </div>

      {/* Custom Personality */}
      <div style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="Or type your own personality..."
          value={customPersonality}
          onChange={(e) => {
            setCustomPersonality(e.target.value);
            setPersonality('');
          }}
          style={{
            padding: '12px',
            width: '400px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: '#0a0f24',
            color: '#fff'
          }}
        />
      </div>

      {/* Continue Button */}
      <button
        style={{
          marginTop: '40px',
          padding: '14px 28px',
          background: '#6366f1',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
        onClick={() => {
          const finalPersonality =
            customPersonality.trim() !== '' ? customPersonality : personality;

          alert(
            `Bot Name: ${botName}\nAvatar: ${avatar}\nPersonality: ${finalPersonality}`
          );
        }}
      >
        Continue
      </button>
    </main>
  );
}
