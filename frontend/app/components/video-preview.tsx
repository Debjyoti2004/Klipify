'use client';

import { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import {
    ArrowLeft,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    SkipBack,
    SkipForward,
    Settings,
    Sliders,
    Zap,
    MoreVertical
} from 'lucide-react';

interface VideoFile {
    id: string;
    name: string;
    size: number;
    originalUrl: string;
    processedUrl?: string;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    progress: number;
    duration?: number;
    thumbnail?: string;
}

interface VideoPreviewProps {
    video: VideoFile;
    onBack: () => void;
    videos: VideoFile[];
    onSelectVideo: (video: VideoFile) => void;
}

const QUALITY_OPTIONS = [
    { value: '1080p', label: 'Full HD (1080p)', bitrate: '5000k', width: 1920, height: 1080 },
    { value: '720p', label: 'HD (720p)', bitrate: '2800k', width: 1280, height: 720 },
    { value: '480p', label: 'SD (480p)', bitrate: '1400k', width: 854, height: 480 },
    { value: '360p', label: 'SD (360p)', bitrate: '800k', width: 640, height: 360 },
    { value: '240p', label: 'Low (240p)', bitrate: '400k', width: 426, height: 240 },
];

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export function VideoPreview({ video, onBack, videos, onSelectVideo }: VideoPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState('1080p');
    const [selectedSpeed, setSelectedSpeed] = useState(1);
    const [showThumbnail, setShowThumbnail] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // Clear previous HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        const updateTime = () => setCurrentTime(videoElement.currentTime);
        const updateDuration = () => setDuration(videoElement.duration);

        // Initialize HLS video
        const initializeVideo = () => {
            console.log('🎬 Initializing video player...');
            console.log('🔍 Video object:', video);

            // Use direct HLS stream for 1080p quality
            const baseUrl = `https://klipify-debjyoti-prod.s3.ap-south-1.amazonaws.com`;
            const videoUrl = `${baseUrl}/hls-1080p-${video.name}/index.m3u8`;
            
            console.log('Using direct HLS stream:', videoUrl);

            if (Hls.isSupported()) {
                console.log('🔧 Creating new HLS instance...');
                hlsRef.current = new Hls({
                    debug: false,
                    enableWorker: false,
                });
                
                console.log('Loading HLS source:', videoUrl);
                hlsRef.current.loadSource(videoUrl);
                hlsRef.current.attachMedia(videoElement);
                
                hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('HLS manifest parsed successfully');
                });

                hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS error:', data);
                    if (data.fatal) {
                        console.error('Fatal HLS error, cannot recover');
                    }
                });
                        
            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                console.log('Native HLS support detected (Safari)');
                videoElement.src = videoUrl;
            } else {
                console.error('HLS not supported in this browser');
            }
        };

        videoElement.addEventListener('timeupdate', updateTime);
        videoElement.addEventListener('loadedmetadata', updateDuration);

        // Fullscreen change listener
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Initialize video
        initializeVideo();

        return () => {
            videoElement.removeEventListener('timeupdate', updateTime);
            videoElement.removeEventListener('loadedmetadata', updateDuration);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            
            // Cleanup HLS
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [video.processedUrl, video.originalUrl, video.name]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (showThumbnail) {
                setShowThumbnail(false);
                videoRef.current.play();
                setIsPlaying(true);
            } else if (isPlaying) {
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

    const handleQualityChange = (quality: string) => {
        console.log('🎯 Quality change requested:', quality);
        setSelectedQuality(quality);
        
        if (hlsRef.current && videoRef.current) {
            const baseUrl = `https://klipify-debjyoti-prod.s3.ap-south-1.amazonaws.com`;
            const newVideoUrl = `${baseUrl}/hls-${quality}-${video.name}/index.m3u8`;
            
            console.log('🔄 Switching to quality stream:', newVideoUrl);
            
            const currentTime = videoRef.current.currentTime;
            const wasPlaying = !videoRef.current.paused;
            
            hlsRef.current.loadSource(newVideoUrl);
            
            hlsRef.current.once(Hls.Events.MANIFEST_PARSED, () => {
                if (videoRef.current) {
                    videoRef.current.currentTime = currentTime;
                    if (wasPlaying) {
                        videoRef.current.play();
                    }
                }
            });
        }
    };

    const handleSpeedChange = (speed: number) => {
        console.log('⚡ Speed change requested:', speed + 'x');
        setSelectedSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            console.log('✅ Playback rate set to:', videoRef.current.playbackRate);
        }
    };

    const completedVideos = videos.filter(v => v.status === 'completed');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Library
                </button>
                <div className="flex items-center space-x-4">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8">
                {/* Main Video Player */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Video Container */}
                    <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-4 sm:p-6">
                        <div 
                            ref={containerRef}
                            className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? 'bg-black' : ''}`}
                        >
                            <video
                                ref={videoRef}
                                className="w-full aspect-video"
                                onPlay={() => {
                                    setIsPlaying(true);
                                    setShowThumbnail(false);
                                }}
                                onPause={() => setIsPlaying(false)}
                                crossOrigin="anonymous"
                                controls={false}
                                onLoadedData={() => console.log('Video loaded successfully')}
                                onError={(e) => console.error('Video load error:', e)}
                                onCanPlay={() => console.log('Video can play')}
                            />

                            {showThumbnail && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50 flex flex-col items-center justify-center p-6">
                                    <div className="flex items-center justify-center mb-6">
                                        <button
                                            onClick={togglePlay}
                                            className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 shadow-2xl border border-white/20"
                                        >
                                            <div className="flex items-center justify-center w-full h-full">
                                                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white" style={{ marginLeft: '2px' }} />
                                            </div>
                                        </button>
                                    </div>
                                    
                                    {/* Video info */}
                                    <div className="text-center text-white max-w-md">
                                        <h3 className="text-lg sm:text-xl font-semibold mb-3 truncate">{video.name}</h3>
                                        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-300 mb-2">
                                            <span>{(video.size / (1024 * 1024)).toFixed(2)} MB</span>
                                            <span>•</span>
                                            <span>{selectedQuality} Quality</span>
                                            <span>•</span>
                                            <span>{formatTime(duration || 0)}</span>
                                        </div>
                                        {video.processedUrl && (
                                            <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span>HLS Stream Ready</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Video Overlay Controls - Only show when not showing thumbnail */}
                            {!showThumbnail && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button
                                        onClick={togglePlay}
                                        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110 shadow-2xl"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-10 h-10 text-white" />
                                        ) : (
                                            <Play className="w-10 h-10 text-white ml-1" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Control Bar */}
                        <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 mt-4 border border-white/10">
                            <div className="space-y-4 mb-6">
                                <div className="relative group">
                                    <div className="w-full h-1 bg-slate-600/50 rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-slate-500/60 rounded-full" style={{ width: '100%' }}></div>
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
                                        style={{ margin: 0 }}
                                    />
                                    
                                    <div 
                                        className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg"
                                        style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)` }}
                                    ></div>
                                </div>
                                
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span className="font-medium">{formatTime(currentTime)}</span>
                                    <span className="font-medium">{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}
                                        className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <SkipBack className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={togglePlay}
                                        className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6" />
                                        ) : (
                                            <Play className="w-6 h-6 ml-0.5" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}
                                        className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <SkipForward className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setIsMuted(!isMuted)}
                                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
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
                                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                    >
                                        <Maximize className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Settings */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center">
                            <Settings className="w-5 h-5 mr-3 text-blue-400" />
                            Video Settings
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Quality Settings */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-white flex items-center">
                                    <Sliders className="w-4 h-4 mr-2 text-orange-400" />
                                    Quality
                                </h4>
                                <div className="space-y-2">
                                    {QUALITY_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleQualityChange(option.value)}
                                            className={`w-full p-3 rounded-xl text-left transition-all duration-200 border ${selectedQuality === option.value
                                                    ? 'border-blue-400 bg-blue-500/20 text-white'
                                                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-blue-400/50 hover:bg-blue-500/10'
                                                }`}
                                        >
                                            <div className="font-medium">{option.label}</div>
                                            <div className="text-sm opacity-70">{option.bitrate} • {option.width}×{option.height}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Speed Controls */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-white flex items-center">
                                    <Zap className="w-4 h-4 mr-2 text-purple-400" />
                                    Playback Speed
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {SPEED_OPTIONS.map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => handleSpeedChange(speed)}
                                            className={`p-3 rounded-xl font-medium transition-all duration-200 ${selectedSpeed === speed
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-white/5 text-slate-300 hover:bg-purple-500/20 hover:text-white border border-white/10'
                                                }`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Video Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Name:</span>
                                <span className="text-white font-medium truncate ml-2">{video.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Size:</span>
                                <span className="text-white font-medium">{(video.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Duration:</span>
                                <span className="text-white font-medium">{formatTime(duration)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Quality:</span>
                                <span className="text-white font-medium">{selectedQuality}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Status:</span>
                                <span className="text-green-400 font-medium">Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Other Videos */}
                    {completedVideos.length > 1 && (
                        <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Other Videos</h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {completedVideos
                                    .filter(v => v.id !== video.id)
                                    .map((otherVideo) => (
                                        <button
                                            key={otherVideo.id}
                                            onClick={() => onSelectVideo(otherVideo)}
                                            className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10 text-left"
                                        >
                                            <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center">
                                                <Play className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate text-sm">{otherVideo.name}</p>
                                                <p className="text-slate-400 text-xs">
                                                    {(otherVideo.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
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