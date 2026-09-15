"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface FishItem {
  id: string;
  name: string;
  icon: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary";
  description: string;
}

const FISH_ITEMS: FishItem[] = [
  {
    id: "trout",
    name: "Pixel Trout",
    icon: "🐟",
    rarity: "Common",
    description: "Pacific Northwest freshwater classic. Clean and scalable.",
  },
  {
    id: "crab",
    name: "Dungeness Crab",
    icon: "🦀",
    rarity: "Uncommon",
    description: "Vancouver coastal special. Excellent concurrency handling.",
  },
  {
    id: "boot",
    name: "Old Boot",
    icon: "👢",
    rarity: "Common",
    description: "Zero memory leaks in the sole.",
  },
  {
    id: "udp",
    name: "Lost UDP Packet",
    icon: "📦",
    rarity: "Rare",
    description: "Arrived out of order, but it made it.",
  },
  {
    id: "redis",
    name: "Redis Key",
    icon: "⚡",
    rarity: "Rare",
    description: "TTL: Forever. Sub-millisecond latency.",
  },
  {
    id: "cookie",
    name: "Blue Chip Cookie",
    icon: "🍪",
    rarity: "Uncommon",
    description: "UBC campus fuel for Systems Software & 3am debugging.",
  },
  {
    id: "duck",
    name: "Rubber Duck",
    icon: "🦆",
    rarity: "Uncommon",
    description: "Silently listens to your toughest algorithmic bugs.",
  },
  {
    id: "bottle",
    name: "Message in a Bottle",
    icon: "📜",
    rarity: "Rare",
    description: "Reads: 'Let's build something: kelvinwu0002@gmail.com'",
  },
  {
    id: "koi",
    name: "Golden Koi",
    icon: "⭐",
    rarity: "Legendary",
    description: "Rumored to solve NP-complete problems in O(1) time.",
  },
];

type GameState = "idle" | "casting" | "waiting" | "nibble" | "bite" | "caught" | "missed";

export function FishingGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [caughtItem, setCaughtItem] = useState<FishItem | null>(null);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Click the pond or [Cast Line] to begin.");

  const stateRef = useRef<GameState>("idle");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const bobberYRef = useRef(0);
  const fishShadowsRef = useRef([
    { x: 140, y: 100, speed: 0.35, depth: 1 },
    { x: 280, y: 120, speed: -0.28, depth: 2 },
    { x: 210, y: 88, speed: 0.45, depth: 0 },
  ]);
  const cloudsRef = useRef([
    { x: 30, y: 14, speed: 0.08, w: 32 },
    { x: 190, y: 22, speed: 0.05, w: 44 },
    { x: 340, y: 10, speed: 0.07, w: 26 },
  ]);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, delay = 0) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  const soundCast = useCallback(() => {
    playTone(320, "sine", 0.1);
    playTone(480, "sine", 0.12, 0.05);
  }, [playTone]);

  const soundSplash = useCallback(() => {
    playTone(180, "triangle", 0.15);
  }, [playTone]);

  const soundBite = useCallback(() => {
    playTone(880, "square", 0.08);
    playTone(990, "square", 0.12, 0.08);
  }, [playTone]);

  const soundCatch = useCallback(() => {
    playTone(523.25, "sine", 0.1);
    playTone(659.25, "sine", 0.12, 0.1);
    playTone(783.99, "sine", 0.15, 0.2);
    playTone(1046.5, "sine", 0.25, 0.3);
  }, [playTone]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleAction = useCallback(() => {
    const current = stateRef.current;

    if (current === "idle" || current === "caught" || current === "missed") {
      setGameState("casting");
      setStatusMessage("Casting line...");
      soundCast();
      clearTimer();

      timerRef.current = setTimeout(() => {
        setGameState("waiting");
        setStatusMessage("Waiting for a bite...");
        soundSplash();

        const waitDuration = 2000 + Math.random() * 2500;
        timerRef.current = setTimeout(() => {
          setGameState("nibble");
          playTone(400, "triangle", 0.05);

          timerRef.current = setTimeout(() => {
            setGameState("bite");
            setStatusMessage("BITE! Click to reel in!");
            soundBite();

            timerRef.current = setTimeout(() => {
              if (stateRef.current === "bite") {
                setGameState("missed");
                setStatusMessage("The fish got away. Cast again.");
                clearTimer();
              }
            }, 1800);
          }, 600);
        }, waitDuration);
      }, 600);
    } else if (current === "waiting" || current === "casting" || current === "nibble") {
      clearTimer();
      setGameState("missed");
      setStatusMessage("Reeled in too early. The hook was empty.");
      soundSplash();
    } else if (current === "bite") {
      clearTimer();
      setGameState("caught");

      const roll = Math.random();
      let picked: FishItem;
      if (roll < 0.04) {
        picked = FISH_ITEMS.find((i) => i.rarity === "Legendary") || FISH_ITEMS[0];
      } else if (roll < 0.22) {
        const rares = FISH_ITEMS.filter((i) => i.rarity === "Rare");
        picked = rares[Math.floor(Math.random() * rares.length)];
      } else if (roll < 0.58) {
        const uncommons = FISH_ITEMS.filter((i) => i.rarity === "Uncommon");
        picked = uncommons[Math.floor(Math.random() * uncommons.length)];
      } else {
        const commons = FISH_ITEMS.filter((i) => i.rarity === "Common");
        picked = commons[Math.floor(Math.random() * commons.length)];
      }

      setCaughtItem(picked);
      setInventory((prev) => ({
        ...prev,
        [picked.id]: (prev[picked.id] || 0) + 1,
      }));
      setStatusMessage(`You reeled in a ${picked.name}!`);
      soundCatch();
    }
  }, [soundCast, soundSplash, soundBite, soundCatch, playTone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;
      const waterY = 74;

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, waterY);

      ctx.fillStyle = "#f4f4f5";
      cloudsRef.current.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > w + 40) cloud.x = -50;
        const cx = Math.floor(cloud.x);
        ctx.fillRect(cx, cloud.y, cloud.w, 4);
        ctx.fillRect(cx + 4, cloud.y - 3, cloud.w - 8, 3);
      });

      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, waterY, w, h - waterY);

      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, waterY);
      ctx.lineTo(w, waterY);
      ctx.stroke();

      for (let y = waterY + 12; y < h; y += 14) {
        const speed = y % 2 === 0 ? 0.35 : -0.25;
        const rowShift = frame * speed;
        for (let x = -20; x < w + 20; x += 36) {
          const px = Math.floor(((x + rowShift) % (w + 40)) - 20);
          ctx.beginPath();
          ctx.moveTo(px, y);
          ctx.lineTo(px + 10, y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "#d4d4d8";
      fishShadowsRef.current.forEach((fish) => {
        fish.x += fish.speed;
        if (fish.x > w + 24) fish.x = 90;
        if (fish.x < 80) fish.x = w + 16;
        const fx = Math.floor(fish.x);
        const fy = Math.floor(fish.y);
        ctx.fillRect(fx, fy, 8, 2);
        ctx.fillRect(fx + 2, fy - 1, 4, 1);
        if (fish.speed > 0) {
          ctx.fillRect(fx - 2, fy - 1, 2, 4);
        } else {
          ctx.fillRect(fx + 8, fy - 1, 2, 4);
        }
      });

      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 48, 64, 26);
      ctx.fillStyle = "#27272a";
      ctx.fillRect(0, 48, 64, 3);
      ctx.fillRect(18, waterY, 5, h - waterY);
      ctx.fillRect(50, waterY, 5, h - waterY);

      for (let i = 0; i < 64; i += 12) {
        ctx.strokeStyle = "#09090b";
        ctx.beginPath();
        ctx.moveTo(i, 49);
        ctx.lineTo(i, 74);
        ctx.stroke();
      }

      const idleBounce = Math.floor(Math.sin(frame * 0.05) * 1);
      const px = 44;
      const py = 32 + idleBounce;

      ctx.fillStyle = "#18181b";
      ctx.fillRect(px + 1, py - 4, 7, 2);
      ctx.fillRect(px + 2, py - 2, 5, 2);
      ctx.fillRect(px + 2, py, 5, 5);

      ctx.fillRect(px + 1, py + 5, 7, 9);
      ctx.fillRect(px + 5, py + 12, 8, 4);

      let rodTipX = px + 28;
      let rodTipY = py - 6;

      const curr = stateRef.current;
      if (curr === "casting") {
        rodTipX = px + 18;
        rodTipY = py - 14;
      } else if (curr === "bite") {
        rodTipX = px + 26;
        rodTipY = py + 2;
      }

      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px + 6, py + 8);
      ctx.lineTo(rodTipX, rodTipY);
      ctx.stroke();

      const bobberTargetX = 185;
      const bobberBaseY = waterY + 4;

      if (curr === "waiting" || curr === "nibble" || curr === "bite" || curr === "casting") {
        let bobberY = bobberBaseY + Math.sin(frame * 0.08) * 1.5;

        if (curr === "nibble") {
          bobberY += Math.sin(frame * 0.3) * 2;
        } else if (curr === "bite") {
          bobberY += Math.sin(frame * 0.5) * 5;
        }

        bobberYRef.current = bobberY;

        ctx.strokeStyle = "#a1a1aa";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rodTipX, rodTipY);
        ctx.quadraticCurveTo(
          (rodTipX + bobberTargetX) / 2,
          rodTipY + 16,
          bobberTargetX,
          bobberY - 2
        );
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.fillRect(bobberTargetX - 2, bobberY - 4, 4, 3);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(bobberTargetX - 2, bobberY - 1, 4, 3);
        ctx.strokeStyle = "#18181b";
        ctx.strokeRect(bobberTargetX - 2.5, bobberY - 4.5, 5, 6);

        ctx.strokeStyle = "#e4e4e7";
        const rippleR = 3 + (frame % 24) * 0.3;
        ctx.beginPath();
        ctx.ellipse(bobberTargetX, waterY + 2, rippleR, rippleR * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();

        if (curr === "nibble") {
          ctx.fillStyle = "#71717a";
          ctx.font = "bold 10px monospace";
          ctx.fillText("?", bobberTargetX - 2, bobberY - 8);
        } else if (curr === "bite") {
          ctx.fillStyle = "#18181b";
          ctx.font = "bold 15px monospace";
          const biteBounce = Math.sin(frame * 0.4) * 3;
          ctx.fillText("!", bobberTargetX - 3, bobberY - 10 + biteBounce);
        }
      } else if (curr === "caught" && caughtItem) {
        const floatY = waterY - 12 + Math.sin(frame * 0.08) * 3;
        ctx.font = "18px sans-serif";
        ctx.fillText(caughtItem.icon, bobberTargetX - 8, floatY);

        ctx.fillStyle = "#e4e4e7";
        const spark = (frame * 0.1) % (Math.PI * 2);
        ctx.fillRect(bobberTargetX + Math.cos(spark) * 14, floatY + Math.sin(spark) * 8, 2, 2);
        ctx.fillRect(bobberTargetX - Math.cos(spark) * 14, floatY - Math.sin(spark) * 8, 2, 2);
      }

      ctx.strokeStyle = "#e4e4e7";
      ctx.strokeRect(0, 0, w, h);

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      clearTimer();
    };
  }, [caughtItem]);

  const uniqueCaught = Object.keys(inventory).length;
  const totalCaught = Object.values(inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-3.5 pt-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-neutral-900">Pixel Pond</h2>
          <span className="text-xs text-neutral-400">
            ({uniqueCaught}/{FISH_ITEMS.length} caught)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer select-none"
            title={soundEnabled ? "Mute audio" : "Enable audio"}
          >
            {soundEnabled ? "Sound: On" : "Sound: Off"}
          </button>
        </div>
      </div>

      <div
        onClick={handleAction}
        className="relative border border-neutral-200 bg-white rounded cursor-pointer overflow-hidden select-none transition-colors hover:border-neutral-400 active:scale-[0.998]"
      >
        <canvas
          ref={canvasRef}
          width={412}
          height={140}
          className="w-full h-[140px] block"
          style={{ imageRendering: "pixelated" }}
        />

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none">
          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-colors ${
              gameState === "bite"
                ? "bg-neutral-900 text-white border-neutral-900 font-semibold animate-pulse"
                : "bg-white/95 text-neutral-600 border-neutral-200"
            }`}
          >
            {gameState === "idle" && "READY"}
            {gameState === "casting" && "CASTING..."}
            {gameState === "waiting" && "WAITING..."}
            {gameState === "nibble" && "NIBBLE..."}
            {gameState === "bite" && "STRIKE! REEL IN!"}
            {gameState === "caught" && "CAUGHT!"}
            {gameState === "missed" && "MISSED"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <p className="text-neutral-600 truncate">{statusMessage}</p>
        <button
          type="button"
          onClick={handleAction}
          className={`font-mono text-xs px-3 py-1.5 rounded transition-all shrink-0 cursor-pointer ${
            gameState === "bite"
              ? "bg-neutral-900 text-white font-medium hover:bg-black scale-105 shadow-sm"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 active:scale-95"
          }`}
        >
          {gameState === "bite"
            ? "Reel In!"
            : gameState === "waiting" || gameState === "nibble" || gameState === "casting"
            ? "Pull Line"
            : "Cast Line"}
        </button>
      </div>

      {caughtItem && gameState === "caught" && (
        <div className="p-3 rounded border border-neutral-200 bg-neutral-50/70 text-xs space-y-1 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-medium text-neutral-900 flex items-center gap-1.5">
              <span>{caughtItem.icon}</span>
              <span>{caughtItem.name}</span>
            </span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${
                caughtItem.rarity === "Legendary"
                  ? "bg-neutral-900 text-white font-bold"
                  : caughtItem.rarity === "Rare"
                  ? "bg-neutral-200 text-neutral-800 font-medium"
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {caughtItem.rarity}
            </span>
          </div>
          <p className="text-neutral-600 text-[11px] leading-relaxed">
            {caughtItem.description}
          </p>
        </div>
      )}

      {totalCaught > 0 && (
        <div className="pt-1">
          <div className="text-[11px] text-neutral-400 font-mono mb-1.5">
            Fish Logbook ({totalCaught} items):
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {FISH_ITEMS.map((item) => {
              const count = inventory[item.id] || 0;
              const isDiscovered = count > 0;
              return (
                <div
                  key={item.id}
                  className={`p-1.5 rounded border transition-colors flex items-center justify-between ${
                    isDiscovered
                      ? "border-neutral-200 bg-white text-neutral-800"
                      : "border-neutral-100 bg-neutral-50/50 text-neutral-300"
                  }`}
                  title={isDiscovered ? item.description : "Not yet discovered"}
                >
                  <span className="flex items-center gap-1 truncate text-[11px]">
                    <span>{isDiscovered ? item.icon : "•"}</span>
                    <span className="truncate">{isDiscovered ? item.name : "???"}</span>
                  </span>
                  {isDiscovered && (
                    <span className="font-mono text-[10px] text-neutral-400 shrink-0 ml-1">
                      ×{count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
