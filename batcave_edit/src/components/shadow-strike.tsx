import { useEffect, useRef, useState } from "react";
import { BatEmblem } from "./bat-emblem";
import { BatButton } from "./bat-button";
import { useCaveStore } from "@/lib/cave-store";

interface Target {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  born: number;
}

export function ShadowStrike() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const high = useCaveStore((s) => s.highScore);
  const setHigh = useCaveStore((s) => s.setHighScore);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let spawnAcc = 0;
    let id = 1;
    const targets: Target[] = [];
    let timeLeft = 45;
    let ended = false;

    function resize() {
      w = wrap!.clientWidth;
      h = Math.max(320, wrap!.clientHeight);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      const fromLeft = Math.random() > 0.5;
      targets.push({
        id: id++,
        x: fromLeft ? -30 : w + 30,
        y: 40 + Math.random() * (h - 80),
        vx: (fromLeft ? 1 : -1) * (80 + Math.random() * 140),
        vy: (Math.random() - 0.5) * 50,
        life: 1,
        born: performance.now(),
      });
    }

    function drawBat(x: number, y: number, s: number, a: number) {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.scale(s, s);
      ctx!.globalAlpha = a;
      ctx!.fillStyle = "#e8e6e1";
      ctx!.beginPath();
      ctx!.moveTo(0, -10);
      ctx!.bezierCurveTo(-6, 4, -18, 6, -28, 2);
      ctx!.bezierCurveTo(-20, 8, -10, 14, 0, 18);
      ctx!.bezierCurveTo(10, 14, 20, 8, 28, 2);
      ctx!.bezierCurveTo(18, 6, 6, 4, 0, -10);
      ctx!.fill();
      ctx!.restore();
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = "#070708";
      ctx!.fillRect(0, 0, w, h);
      ctx!.strokeStyle = "#2c2c32";
      ctx!.strokeRect(8, 8, w - 16, h - 16);

      if (runningRef.current && !ended) {
        timeLeft -= dt;
        spawnAcc += dt;
        const rate = Math.max(0.35, 0.9 - scoreRef.current / 400);
        if (spawnAcc > rate) {
          spawnAcc = 0;
          spawn();
        }
        if (timeLeft <= 0) {
          ended = true;
          runningRef.current = false;
          setRunning(false);
          setHigh(scoreRef.current);
        }
      }

      for (let i = targets.length - 1; i >= 0; i--) {
        const t = targets[i];
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        t.life -= dt * 0.12;
        if (t.x < -60 || t.x > w + 60 || t.life <= 0) {
          if (runningRef.current && t.life <= 0) {
            comboRef.current = 0;
            setCombo(0);
          }
          targets.splice(i, 1);
          continue;
        }
        drawBat(t.x, t.y, 1.1, Math.max(0.3, t.life));
      }

      ctx!.fillStyle = "#9a968e";
      ctx!.font = "12px Barlow, sans-serif";
      ctx!.fillText(`TIME ${Math.max(0, timeLeft).toFixed(1)}`, 20, 28);
      ctx!.fillText(`SCORE ${scoreRef.current}`, 20, 48);
      ctx!.fillText(`COMBO ${comboRef.current}`, 20, 68);

      raf = requestAnimationFrame(frame);
    }

    function hit(e: PointerEvent) {
      if (!runningRef.current || ended) return;
      const r = canvas!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      for (let i = targets.length - 1; i >= 0; i--) {
        const t = targets[i];
        const dx = x - t.x;
        const dy = y - t.y;
        if (dx * dx + dy * dy < 40 * 40) {
          targets.splice(i, 1);
          comboRef.current += 1;
          const gain = 10 + comboRef.current * 2;
          scoreRef.current += gain;
          setScore(scoreRef.current);
          setCombo(comboRef.current);
          return;
        }
      }
      comboRef.current = 0;
      setCombo(0);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", hit);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", hit);
    };
  }, [setHigh]);

  function start() {
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setRunning(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-kicker">Shadow Strike</p>
          <p className="text-sm text-muted">
            Strike the silhouettes. Miss and the combo dies. 45 seconds.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm tabular text-muted">
          <span>Score {score}</span>
          <span>Combo {combo}</span>
          <span>Best {high}</span>
          <BatButton
            label={running ? "In flight" : "Begin"}
            variant="inline"
            disabled={running}
            onClick={start}
          />
        </div>
      </div>
      <div ref={wrapRef} className="relative h-[min(58vh,480px)] overflow-hidden rounded-[10px] border border-line">
        <canvas ref={canvasRef} className="h-full w-full touch-none" />
        {!running ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
            <BatEmblem className="h-10 w-24 fill-accent" />
            <p className="type-display tracking-[0.28em]">STRIKE</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
