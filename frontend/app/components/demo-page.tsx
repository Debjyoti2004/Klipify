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
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const demoVideoUrl = "/Klipify-demo.mp4";

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const updateTime = () => setCurrentTime(videoElement.currentTime);
        const updateDuration = () => setDuration(videoElement.duration);

        videoElement.addEventListener('timeupdate', updateTime);
        videoElement.addEventListener('loadedmetadata', updateDuration);

        // Fullscreen change listener
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Auto-hide controls after 3 seconds of inactivity
        let hideControlsTimeout: NodeJS.Timeout;
        const resetHideControlsTimeout = () => {
            setShowControls(true);
            clearTimeout(hideControlsTimeout);
            hideControlsTimeout = setTimeout(() => {
                if (isPlaying) setShowControls(false);
            }, 3000);
        };

        videoElement.addEventListener('mousemove', resetHideControlsTimeout);
        videoElement.addEventListener('click', resetHideControlsTimeout);

        return () => {
            videoElement.removeEventListener('timeupdate', updateTime);
            videoElement.removeEventListener('loadedmetadata', updateDuration);
            videoElement.removeEventListener('mousemove', resetHideControlsTimeout);
            videoElement.removeEventListener('click', resetHideControlsTimeout);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            clearTimeout(hideControlsTimeout);
        };
    }, [isPlaying]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;
        
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await containerRef.current.requestFullscreen();
            }
        } catch (error) {
            console.error('Error toggling fullscreen:', error);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Demo Header */}
            <div className="relative bg-black/20 backdrop-blur-xl border-b border-white/10 p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center text-slate-400 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-2xl px-4 py-2 border border-white/10"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="font-medium">Back to Home</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Klipify Demo
                        </h1>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Live Demo</span>
                    </div>
                </div>
            </div>

            {/* Demo Video Player */}
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
                <div className="w-full max-w-6xl">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                        
                        <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                            <div 
                                ref={containerRef}
                                className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? 'bg-black' : ''}`}
                                onMouseEnter={() => setShowControls(true)}
                                onMouseLeave={() => isPlaying && setShowControls(false)}
                            >
                                <video
                                    ref={videoRef}
                                    src={demoVideoUrl}
                                    className="w-full aspect-video"
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onClick={togglePlay}
                                    crossOrigin="anonymous"
                                    controls={false}
                                />

                                {/* Video Controls Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button
                                            onClick={togglePlay}
                                            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 shadow-2xl cursor-pointer"
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-10 h-10 text-white" />
                                            ) : (
                                                <Play className="w-10 h-10 text-white ml-1" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={onBack}
                                            className="p-2 bg-black/60 backdrop-blur-sm text-white rounded-lg hover:bg-black/80 transition-all duration-300 cursor-pointer"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="relative group mb-4">
                                            <div className="w-full h-1 bg-slate-600/50 rounded-full overflow-hidden">
                                                <div 
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150"
                                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            
                                            <input
                                                type="range"
                                                min="0"
                                                max={duration || 0}
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-pointer"
                                            />
                                            
                                            <div 
                                                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg"
                                                style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)` }}
                                            ></div>
                                        </div>

                                        {/* Control buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={togglePlay}
                                                    className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 cursor-pointer"
                                                >
                                                    {isPlaying ? (
                                                        <Pause className="w-5 h-5" />
                                                    ) : (
                                                        <Play className="w-5 h-5 ml-0.5" />
                                                    )}
                                                </button>

                                                <div className="flex items-center space-x-2 text-white text-sm">
                                                    <span>{formatTime(currentTime)}</span>
                                                    <span>/</span>
                                                    <span>{formatTime(duration)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => setIsMuted(!isMuted)}
                                                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                    </button>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.1"
                                                        value={isMuted ? 0 : volume}
                                                        onChange={(e) => {
                                                            const newVolume = parseFloat(e.target.value);
                                                            setVolume(newVolume);
                                                            if (videoRef.current) {
                                                                videoRef.current.volume = newVolume;
                                                            }
                                                            setIsMuted(newVolume === 0);
                                                        }}
                                                        className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <button 
                                                    onClick={toggleFullscreen}
                                                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                                >
                                                    <Maximize className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Demo Info */}
                            <div className="mt-6 text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Klipify Platform Demo</h2>
                                <p className="text-slate-400 mb-4">
                                    See how Klipify transforms your videos with professional-grade quality and lightning-fast processing.
                                </p>
                                <div className="flex items-center justify-center space-x-6 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-slate-300">Professional Quality</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span className="text-slate-300">Multiple Formats</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-slate-300">Real-time Processing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
}
