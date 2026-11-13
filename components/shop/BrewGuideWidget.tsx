"use client";

import { useState, useEffect, useRef } from "react";
import { BrewGuide } from "@/data/products";
import { Play, Pause, RotateCcw, Clock, Thermometer, Scale, CheckCircle2 } from "lucide-react";

export default function BrewGuideWidget({ guide }: { guide: BrewGuide }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 text-[#EFEBE3] font-mono text-xs">
      {/* Recipe Parameters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-sm bg-[#13261F] border border-[#EFEBE3]/15">
        <div>
          <span className="text-[10px] uppercase text-[#EFEBE3]/40 flex items-center gap-1 mb-1">
            <Scale className="w-3 h-3" />
            DOSE & RATIO
          </span>
          <div className="text-sm font-bold text-[#EFEBE3]">
            {guide.dose} ({guide.ratio})
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase text-[#EFEBE3]/40 flex items-center gap-1 mb-1">
            <Scale className="w-3 h-3" />
            WATER VOLUME
          </span>
          <div className="text-sm font-bold text-[#EFEBE3]">{guide.water}</div>
        </div>

        <div>
          <span className="text-[10px] uppercase text-[#EFEBE3]/40 flex items-center gap-1 mb-1">
            <Thermometer className="w-3 h-3" />
            WATER TEMP
          </span>
          <div className="text-sm font-bold text-[#CFE0C3]">{guide.temp}</div>
        </div>

        <div>
          <span className="text-[10px] uppercase text-[#EFEBE3]/40 flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" />
            TARGET TIME
          </span>
          <div className="text-sm font-bold text-[#E8472B]">{guide.time}</div>
        </div>
      </div>

      {/* Digital Pour Stopwatch Companion */}
      <div className="p-4 rounded-sm bg-[#0A1410] border border-[#E8472B]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-mono font-light tracking-wider text-[#EFEBE3] tabular-nums">
            {formatTime(seconds)}
          </div>
          <div className="text-[10px] text-[#EFEBE3]/50 uppercase">
            {isRunning ? "TIMER RUNNING · POUR GENTLY" : "STANDBY · READY TO BLOOM"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors ${
              isRunning
                ? "bg-[#E8472B] text-[#EFEBE3]"
                : "bg-[#CFE0C3] text-[#0D1B16] hover:bg-[#b8cba9]"
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? "Pause" : "Start Brew Timer"}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-2 rounded-sm border border-[#EFEBE3]/20 hover:border-[#EFEBE3]/50 transition-colors"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#EFEBE3]/60" />
          </button>
        </div>
      </div>

      {/* Step by Step Pour Protocol */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] uppercase tracking-widest text-[#E8472B] block">
          EXTRACTION PROTOCOL STEPS
        </span>
        <div className="space-y-2">
          {guide.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-sm bg-[#13261F]/60 border border-[#EFEBE3]/10 flex items-start gap-3"
            >
              <span className="text-[10px] font-mono text-[#E8472B] mt-0.5">0{idx + 1}</span>
              <p className="font-sans text-xs text-[#EFEBE3]/80 leading-relaxed font-light">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
