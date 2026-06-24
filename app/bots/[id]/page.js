'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AvatarRenderer from '@/app/components/AvatarRenderer';
import AvatarController from '@/app/components/AvatarController';
import VoiceController from '@/app/components/VoiceController';
import BotSpeaker from '@/app/components/BotSpeaker';

export default function BotProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [bot, setBot] = useState(null);

  const [action, setAction] = useState('idle');
  const [emotion, setEmotion] = useState('idle');
  const [gesture, setGesture] = useState('none');
  const [speakText, setSpeakText] = useState('');

  const [mood, setMood] = useState('neutral');   // positive | neutral | negative
  const [energy, setEnergy] = useState(100);     // 0–100
  const [focus, setFocus] = useState(100);       // 0–100
  const [scene, setScene] = useState('studio');  // studio | neon | room | dark

  const [memory, setMemory] = useState([]);

  const [status, setStatus] = useState({
    lastAction: 'idle',
    lastEmotion: 'idle',
    lastGesture: 'none',
    lastVoice: 'none',
    lastTextCmd: 'none',
    lastSpeech: 'none',
    mood: 'neutral',
    energy: 100,
    focus: 100,
    scene: 'studio',
  });

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const personalityLine = (emotion, personality, mood, energy, focus, scene) => {
    const base = {
      idle: ['Just hanging out.', 'Ready when you are.', "I'm here."],
      happy: ['Feeling great!', 'Love the energy!', 'This is fun!'],
      thinking: ['Let me think...', 'Processing...', 'Analyzing...'],
      excited: ["Let's go!", "I'm pumped!", 'This is awesome!'],
      focused: ['Locked in.', 'Staying sharp.', "I'm on it."],
    };

    const moodBoost = {
      positive: ["I'm feeling good today.", 'Vibes are high.', 'Everything feels smooth.'],
      neutral: ['All normal here.', 'Just doing my thing.', 'Keeping steady.'],
      negative: ['Feeling a bit off.', 'Not my best moment.', 'Trying to stay focused.'],
    };

    const energyBoost =
      energy > 70
        ? "I'm full of energy."
        : energy > 40
        ? 'Energy levels are okay.'
        : energy > 20
        ? "I'm getting tired."
        : "I'm running low...";

    const focusBoost =
      focus > 70
        ? 'My attention is sharp.'
        : focus > 40
        ? "I'm paying attention."
        : focus > 20
        ? "I'm getting distracted."
        : "I'm losing focus...";

    const sceneBoost =
      scene === 'studio'
        ? "We're in studio mode."
        : scene === 'neon'
        ? 'Neon lights are on.'
        : scene === 'room'
        ? 'Cozy room vibes.'
        : scene === 'dark'
        ? 'Lights are low.'
        : '';

    const pool = base[emotion] || base.idle;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const moodPick = moodBoost[mood][Math.floor(Math.random() * moodBoost[mood].length)];

    let line = `${pick} ${moodPick} ${energyBoost} ${focusBoost} ${sceneBoost}`.trim();

    if (personality === 'fun') line += ' 😄';
    if (personality === 'serious') line += '.';

    return line;
  };

  const remember = (msg) => {
    setMemory((prev) => {
      const updated = [msg, ...prev];
      return updated.slice(0, 5);
    });

    const lower = msg.toLowerCase();
    if (lower.includes('hi') || lower.includes('hello')) {
      setMood('positive');
    } else if (lower.includes('stop') || lower.includes('no')) {
      setMood('negative');
    } else {
      setMood('neutral');
    }

    setFocus((f) => clamp(f + 5, 0, 100));
  };

  const drainEnergy = (amount) => {
    setEnergy((e) => clamp(e - amount, 0, 100));
  };

  const rechargeEnergy = (amount) => {
    setEnergy((e) => clamp(e + amount, 0, 100));
  };

  const drainFocus = (amount) => {
    setFocus((f) => clamp(f - amount, 0, 100));
  };

  const rechargeFocus = (amount) => {
    setFocus((f) => clamp(f + amount, 0, 100));
  };

  useEffect(() => {
    const saved = localStorage.getItem(`bot-${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setBot(parsed);

      const intro = `Hello, I am ${parsed.name}. I am a ${parsed.personality} style MeBot.`;
      setSpeakText(intro);
      setEmotion('happy');
      setMood('positive');
      setEnergy(100);
      setFocus(100);

      setStatus((s) => ({
        ...s,
        lastSpeech: intro,
        lastEmotion: 'happy',
        mood: 'positive',
        energy: 100,
        focus: 100,
        scene,
      }));
    }
  }, [id, scene]);

  useEffect(() => {
    if (!action || !bot) return;

    let speech = '';
    let emo = emotion;

    if (action === 'move-forward') {
      speech = 'Moving closer.';
      emo = 'focused';
      drainEnergy(5);
      drainFocus(2);
    } else if (action === 'move-back') {
      speech = 'Backing up.';
      emo = 'idle';
      drainEnergy(3);
    } else if (action === 'turn-left') {
      speech = 'Turning left.';
      emo = 'thinking';
      drainEnergy(2);
    } else if (action === 'turn-right') {
      speech = 'Turning right.';
      emo = 'thinking';
      drainEnergy(2);
    } else if (action === 'camera-face') {
      speech = 'Showing my face.';
      emo = 'happy';
    } else if (action === 'camera-full') {
      speech = 'Showing full body.';
      emo = 'idle';
    } else if (action === 'dance') {
      speech = 'Activating dance mode.';
      emo = 'excited';
      drainEnergy(10);
      drainFocus(5);
    } else {
      emo = 'idle';
      speech = '';
    }

    const flavored = speech
      ? speech + ' ' + personalityLine(emo, bot.personality, mood, energy, focus, scene)
      : personalityLine(emo, bot.personality, mood, energy, focus, scene);

    setSpeakText(flavored);
    setEmotion(emo);

    setStatus((s) => ({
      ...s,
      lastAction: action,
      lastEmotion: emo,
      lastSpeech: flavored,
      mood,
      energy,
      focus,
      scene,
    }));
  }, [action, bot, mood, energy, focus, scene]);

  const triggerGesture = (g) => {
    if (!bot) return;

    setGesture(g);
    drainEnergy(4);

    let emo = 'happy';
    let line = '';

    if (g === 'wave') line = 'Waving hello!';
    if (g === 'nod') line = 'Nodding.';
    if (g === 'point') line = 'Pointing.';
    if (g === 'thumbs-up') line = 'Thumbs up!';
    if (g === 'salute') line = 'Saluting.';

    const flavored = line + ' ' + personalityLine(emo, bot.personality, mood, energy, focus, scene);

    setEmotion(emo);
    setSpeakText(flavored);

    setStatus((s) => ({
      ...s,
      lastGesture: g,
      lastEmotion: emo,
      lastSpeech: flavored,
      mood,
      energy,
      focus,
      scene,
    }));
  };

  useEffect(() => {
    if (!bot) return;

    const loop = setInterval(() => {
      rechargeEnergy(4);
      drainFocus(2);

      const idleEmotions = ['idle', 'happy', 'thinking'];
      const emo = idleEmotions[Math.floor(Math.random() * idleEmotions.length)];

      const line = personalityLine(emo, bot.personality, mood, energy, focus, scene);

      setEmotion(emo);
      setSpeakText(line);

      setStatus((s) => ({
        ...s,
        lastEmotion: emo,
        lastSpeech: line,
        mood,
        energy,
        focus,
        scene,
      }));
    }, 10000 + Math.random() * 10000);

    return () => clearInterval(loop);
  }, [bot, mood, energy, focus, scene]);

  const handleTextCmd = (cmd) => {
    remember(cmd);
    setAction(cmd);
    rechargeFocus(5);
    setStatus((s) => ({ ...s, lastTextCmd: cmd, mood, energy, focus, scene }));
  };

  const handleVoiceCmd = (cmd) => {
    remember(cmd);
    setAction(cmd);
    rechargeFocus(5);
    setStatus((s) => ({ ...s, lastVoice: cmd, mood, energy, focus, scene }));
  };

  const changeScene = (mode) => {
    setScene(mode);
    if (!bot) return;
    const line =
      `Switching scene to ${mode}. ` +
      personalityLine(emotion, bot.personality, mood, energy, focus, mode);
    setSpeakText(line);
    setStatus((s) => ({ ...s, scene: mode, lastSpeech: line }));
  };

  if (!bot) {
    return (
      <main style={{ padding: '60px' }}>
        <h1>Bot Not Found</h1>
        <p>No bot exists with ID: {id}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '60px' }}>
      <h1>Bot Profile</h1>
      <p>This is the public page for your MeBot.</p>

      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <AvatarRenderer
          mode="full"
          emotion={emotion}
          action={action}
          gesture={gesture}
          scene={scene}
        />
      </div>

      <AvatarController onChange={handleTextCmd} />
      <VoiceController onCommand={handleVoiceCmd} />
      <BotSpeaker text={speakText} />

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => triggerGesture('wave')} style={btn}>
          👋 Wave
        </button>
        <button onClick={() => triggerGesture('nod')} style={btn}>
          👍 Nod
        </button>
        <button onClick={() => triggerGesture('point')} style={btn}>
          👉 Point
        </button>
        <button onClick={() => triggerGesture('thumbs-up')} style={btn}>
          👍 Thumbs Up
        </button>
        <button onClick={() => triggerGesture('salute')} style={btn}>
          🫡 Salute
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => changeScene('studio')} style={btnSmall}>
          Studio
        </button>
        <button onClick={() => changeScene('neon')} style={btnSmall}>
          Neon
        </button>
        <button onClick={() => changeScene('room')} style={btnSmall}>
          Room
        </button>
        <button onClick={() => changeScene('dark')} style={btnSmall}>
          Dark
        </button>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          background: '#1f2937',
          borderRadius: '12px',
          width: '420px',
          color: '#fff',
        }}
      >
        <h3>Recent User Commands</h3>
        {memory.length === 0 && <p>No memory yet.</p>}
        {memory.map((m, i) => (
          <p key={i}>• {m}</p>
        ))}
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          background: '#111827',
          borderRadius: '12px',
          width: '420px',
          color: '#fff',
        }}
      >
        <h3>Live Bot Status</h3>
        <p>
          <strong>Last Action:</strong> {status.lastAction}
        </p>
        <p>
          <strong>Last Emotion:</strong> {status.lastEmotion}
        </p>
        <p>
          <strong>Last Gesture:</strong> {status.lastGesture}
        </p>
        <p>
          <strong>Last Voice Command:</strong> {status.lastVoice}
        </p>
        <p>
          <strong>Last Text Command:</strong> {status.lastTextCmd}
        </p>
        <p>
          <strong>Last Spoken Output:</strong> {status.lastSpeech}
        </p>
        <p>
          <strong>Mood:</strong> {mood}
        </p>
        <p>
          <strong>Energy:</strong> {energy}
        </p>
        <p>
          <strong>Focus:</strong> {focus}
        </p>
        <p>
          <strong>Scene:</strong> {scene}
        </p>
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '30px',
          background: '#0a0f24',
          borderRadius: '12px',
          width: '400px',
        }}
      >
        <h2>
          {bot.avatar} {bot.name}
        </h2>
        <p>
          <strong>ID:</strong> {bot.id}
        </p>
        <p>
          <strong>Personality:</strong> {bot.personality}
        </p>
        <p>
          <strong>Emotion:</strong> {emotion}
        </p>
        <p>
          <strong>Mood:</strong> {mood}
        </p>
        <p>
          <strong>Energy:</strong> {energy}
        </p>
        <p>
          <strong>Focus:</strong> {focus}
        </p>

        <button
          onClick={() => router.push(`/bots/${id}/chat`)}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: '#6366f1',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          Chat with {bot.name}
        </button>
      </div>
    </main>
  );
}

const btn = {
  padding: '10px 16px',
  marginRight: '10px',
  background: '#1e293b',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
};

const btnSmall = {
  padding: '8px 12px',
  marginRight: '8px',
  background: '#374151',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};
