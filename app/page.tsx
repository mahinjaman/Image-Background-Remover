"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";

type Status = "idle" | "loading" | "done" | "error";

export default function BGRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const imageRef = useRef<string | null>(null);
  const resultRef = useRef<string | null>(null);

  useEffect(() => {
    imageRef.current = image;
  }, [image]);
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    return () => {
      if (imageRef.current) URL.revokeObjectURL(imageRef.current);
      if (resultRef.current) URL.revokeObjectURL(resultRef.current);
    };
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (PNG, JPG, WEBP).");
      setStatus("error");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File too large. Max 15MB.");
      setStatus("error");
      return;
    }

    if (imageRef.current) URL.revokeObjectURL(imageRef.current);
    if (resultRef.current) URL.revokeObjectURL(resultRef.current);

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setResult(null);
    setStatus("loading");
    setProgress(0);
    setStage("Initializing AI model");
    setFileName(file.name);
    setFileSize(file.size);
    setErrorMsg("");

    try {
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          const pct = total ? current / total : 0;
          setProgress(Math.round(pct * 100));
          if (key.includes("fetch")) setStage("Downloading model");
          else if (key.includes("compute")) setStage("Removing background");
          else setStage(key.replace(/[:_]/g, " "));
        },
      });
      const url = URL.createObjectURL(blob);
      setResult(url);
      setStatus("done");
      setProgress(100);
      setStage("Done");
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    if (image) URL.revokeObjectURL(image);
    if (result) URL.revokeObjectURL(result);
    setImage(null);
    setResult(null);
    setStatus("idle");
    setProgress(0);
    setStage("");
    setFileName("");
    setFileSize(0);
    setErrorMsg("");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-112 w-md rounded-full bg-indigo-500/30 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 h-104 w-104 rounded-full bg-fuchsia-500/25 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 h-120 w-120 rounded-full bg-cyan-400/20 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(2,6,23,0.85)_75%)]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
              <path
                d="M4 16l4.5-6 3.5 4.5L15 11l5 7H4z"
                fill="currentColor"
              />
              <circle cx="9" cy="8" r="1.6" fill="currentColor" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight">
            ClipCanvas
          </span>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
          100% on-device · No upload
        </span>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-24">
        <section className="w-full text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
            <span className="text-fuchsia-300">✦</span>
            Free · Private · AI-powered
          </span>
          <h1 className="mt-5 bg-linear-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl">
            Remove background
            <br />
            <span className="bg-linear-to-r from-indigo-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              in seconds, on your device
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            ছবি আপলোড করুন — AI মডেল আপনার ব্রাউজারেই চলে। কোনো সার্ভারে কিছু পাঠানো হয় না।
          </p>
        </section>

        <section className="mt-10 w-full">
          <div className="rounded-3xl border border-white/10 bg-white/3 p-1.5 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
            <div className="rounded-[20px] bg-linear-to-b from-white/4 to-transparent p-6 sm:p-8">
              {!image && status !== "loading" && (
                <label
                  htmlFor="upload-input"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-all ${
                    dragOver
                      ? "border-fuchsia-400 bg-fuchsia-500/10"
                      : "border-white/15 bg-white/2 hover:border-indigo-400/60 hover:bg-indigo-500/5"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileInput}
                    className="hidden"
                    id="upload-input"
                  />
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-indigo-500 to-fuchsia-500 shadow-xl shadow-indigo-500/30 transition group-hover:scale-105">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="h-7 w-7 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                      />
                    </svg>
                  </div>
                  <p className="mt-5 text-lg font-medium text-white">
                    Drop your image here
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    or <span className="text-indigo-300">click to browse</span>{" "}
                    · PNG, JPG, WEBP up to 15MB
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      🔒 Private
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      ⚡ Fast
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      🎨 Transparent PNG
                    </span>
                  </div>
                </label>
              )}

              {status === "loading" && (
                <div className="flex flex-col items-center justify-center px-4 py-14">
                  <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                    <div
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-r-fuchsia-400"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-white">
                      {progress}%
                    </div>
                  </div>
                  <p className="mt-6 text-base font-medium text-white">
                    {stage || "Processing"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    First run downloads the model (~50MB). Future runs are instant.
                  </p>
                  <div className="mt-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-indigo-400 via-fuchsia-400 to-cyan-300 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-medium">Something went wrong</p>
                      <p className="mt-1 text-red-300/80">{errorMsg}</p>
                      <button
                        onClick={reset}
                        className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-medium hover:bg-red-500/20"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {image && status !== "loading" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/5">
                        🖼️
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {fileName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatSize(fileSize)}
                          {status === "done" && (
                            <span className="ml-2 text-emerald-400">
                              ✓ Background removed
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={reset}
                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                      >
                        New image
                      </button>
                      {result && (
                        <a
                          href={result}
                          download={fileName.replace(/\.[^.]+$/, "") + "-no-bg.png"}
                          className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-fuchsia-400"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                            />
                          </svg>
                          Download PNG
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ImageCard label="Original" url={image} />
                    {result ? (
                      <ImageCard label="Background removed" url={result} checker />
                    ) : (
                      <div className="grid h-full min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 bg-white/2 text-sm text-slate-500">
                        Result will appear here
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Feature
              title="On-device AI"
              text="Your image never leaves your browser."
              icon="🔒"
            />
            <Feature
              title="Pixel-perfect cutouts"
              text="Powered by IMG.LY's transformer model."
              icon="🎯"
            />
            <Feature
              title="Free forever"
              text="No accounts, no watermarks, no limits."
              icon="✨"
            />
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-xs text-slate-500">
        Built with Next.js · Runs entirely in your browser
      </footer>

      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -40px) scale(1.08);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.95);
          }
        }
        .animate-blob {
          animation: blob 14s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

function ImageCard({
  label,
  url,
  checker,
}: {
  label: string;
  url: string;
  checker?: boolean;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/2">
      <div className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-300">
        <span>{label}</span>
      </div>
      <div
        className={`relative grid min-h-64 place-items-center p-4 ${
          checker ? "checker" : "bg-slate-900/40"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={label}
          className="max-h-72 w-auto rounded-lg object-contain transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <style jsx>{`
        .checker {
          background-color: #0f172a;
          background-image:
            linear-gradient(45deg, rgba(255, 255, 255, 0.06) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255, 255, 255, 0.06) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.06) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.06) 75%);
          background-size: 18px 18px;
          background-position: 0 0, 0 9px, 9px -9px, -9px 0;
        }
      `}</style>
    </div>
  );
}

function Feature({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur-sm transition hover:bg-white/5">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-base">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-0.5 text-xs text-slate-400">{text}</p>
        </div>
      </div>
    </div>
  );
}
