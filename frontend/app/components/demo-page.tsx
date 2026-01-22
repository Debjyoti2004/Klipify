'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';

interface DemoPageProps {
    onBack: () => void;
}

export function DemoPage({ onBack }: DemoPageProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const demoVideoUrl =
        'https://res.cloudinary.com/dttgxjfpf/video/upload/v1769089671/Klipify-demo_hwfse9.mp4';

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);

        const onFullscreenChange = () =>
            setIsFullscreen(!!document.fullscreenElement);

        document.addEventListener('fullscreenchange', onFullscreenChange);

        let hideTimeout: NodeJS.Timeout;

        const resetControls = () => {
            setShowControls(true);
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (!video.paused) setShowControls(false);
            }, 3000);
        };

        containerRef.current?.addEventListener('mousemove', resetControls);
        containerRef.current?.addEventListener('click', resetControls);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
            document.removeEventListener('fullscreenchange', onFullscreenChange);
            containerRef.current?.removeEventListener('mousemove', resetControls);
            containerRef.current?.removeEventListener('click', resetControls);
            clearTimeout(hideTimeout);
        };
    }, []);


    const togglePlay = async () => {
        const video = videoRef.current;
        if (!video) return;

        try {
            if (video.paused) {
                await video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        } catch (err) {
            console.error('Playback blocked:', err);
        }
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else {
            await containerRef.current.requestFullscreen();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (!videoRef.current) return;
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        const nextMuted = !isMuted;
        video.muted = nextMuted;
        setIsMuted(nextMuted);

        if (!nextMuted && volume === 0) {
            setVolume(1);
            video.volume = 1;
        }
    };

    const handleVolumeChange = (v: number) => {
        const video = videoRef.current;
        if (!video) return;

        setVolume(v);
        video.volume = v;

        const mute = v === 0;
        setIsMuted(mute);
        video.muted = mute;
    };

    const formatTime = (t: number) =>
        `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-300 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <h1 className="text-xl font-bold text-white">Klipify Demo</h1>
                </div>
            </div>

            <div className="flex justify-center p-6">
                <div
                    ref={containerRef}
                    className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden"
                >
                    <video
                        ref={videoRef}
                        src={demoVideoUrl}
                        preload="metadata"
                        playsInline
                        muted={isMuted}
                        controls={false}
                        className="w-full aspect-video"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />

                    <div
                        className={`absolute inset-0 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <button
                            onClick={togglePlay}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            {isPlaying ? (
                                <Pause size={56} className="text-white" />
                            ) : (
                                <Play size={56} className="text-white ml-1" />
                            )}
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80">
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full mb-3"
                            />

                            <div className="flex justify-between items-center text-white">
                                <div className="flex items-center gap-3">
                                    <button onClick={togglePlay}>
                                        {isPlaying ? <Pause /> : <Play />}
                                    </button>
                                    <span className="text-sm">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button onClick={toggleMute}>
                                        {isMuted ? <VolumeX /> : <Volume2 />}
                                    </button>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={isMuted ? 0 : volume}
                                        onChange={(e) =>
                                            handleVolumeChange(Number(e.target.value))
                                        }
                                    />
                                    <button onClick={toggleFullscreen}>
                                        <Maximize />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onBack}
                        className="absolute top-4 right-4 text-white"
                    >
                        <X />
                    </button>
                </div>
            </div>
        </div>
    );
}
