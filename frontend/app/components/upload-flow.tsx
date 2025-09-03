'use client';

import { useState } from 'react';
import { ArrowLeft, Upload, FileVideo, X, Play, Pause, Download, Share2, Settings } from 'lucide-react';
import { VideoPreview } from './video-preview';
import { ProcessingQueue } from './processing-queue';

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

interface UploadFlowProps {
    onBackToHome: () => void;
    onFileUpload: (files: File[]) => void;
    videos: VideoFile[];
}

export function UploadFlow({ onBackToHome, onFileUpload, videos }: UploadFlowProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('video/')
        );

        if (files.length > 0) {
            setSelectedFiles(files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
    };

    const handleUpload = () => {
        if (selectedFiles.length > 0) {
            onFileUpload(selectedFiles);
            setSelectedFiles([]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const completedVideos = videos.filter(v => v.status === 'completed');
    const processingVideos = videos.filter(v => v.status === 'uploading' || v.status === 'processing');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBackToHome}
                                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FileVideo className="w-5 h-5 text-white" />
                                </div>
                                                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Klipify
                            </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-slate-400 text-sm">
                                {videos.length} video{videos.length !== 1 ? 's' : ''} uploaded
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {selectedVideo ? (
                    <VideoPreview
                        video={selectedVideo}
                        onBack={() => setSelectedVideo(null)}
                        videos={videos}
                        onSelectVideo={setSelectedVideo}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Upload className="w-6 h-6 mr-3 text-blue-400" />
                                    Upload Videos
                                </h2>

                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${isDragOver
                                        ? 'border-blue-400 bg-blue-500/10 scale-[1.02]'
                                        : 'border-white/20 bg-white/5 hover:border-blue-400/50 hover:bg-blue-500/5'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="video/*"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    <div className="space-y-6">
                                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${isDragOver ? 'bg-blue-500/20 scale-110' : 'bg-white/10'
                                            }`}>
                                            <Upload className={`w-10 h-10 transition-colors duration-300 ${isDragOver ? 'text-blue-400' : 'text-slate-400'
                                                }`} />
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-3">
                                                {isDragOver ? 'Drop your videos here' : 'Upload your videos'}
                                            </h3>
                                            <p className="text-slate-400 text-lg">
                                                Drag and drop your video files or click to browse
                                            </p>
                                            <p className="text-slate-500 text-sm mt-2">
                                                Supports MP4, AVI, MOV, WMV, FLV, MKV, WEBM and more
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="mt-8 space-y-4">
                                        <h4 className="text-lg font-semibold text-white">Selected Files ({selectedFiles.length})</h4>
                                        <div className="space-y-3 max-h-60 overflow-y-auto">
                                            {selectedFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <FileVideo className="w-8 h-8 text-blue-400" />
                                                        <div>
                                                            <p className="font-medium text-white">{file.name}</p>
                                                            <p className="text-sm text-slate-400">
                                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile(index)}
                                                        className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={handleUpload}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-xl text-lg"
                                        >
                                            Upload & Process ({selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''})
                                        </button>
                                    </div>
                                )}
                            </div>

                            {completedVideos.length > 0 && (
                                <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                                        <FileVideo className="w-6 h-6 mr-3 text-blue-400" />
                                        Your Videos ({completedVideos.length})
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {completedVideos.map((video) => (
                                            <div
                                                key={video.id}
                                                onClick={() => setSelectedVideo(video)}
                                                className="group cursor-pointer bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-blue-400/50 hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 transform hover:scale-[1.02]"
                                            >
                                                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative shadow-lg">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
                                                    
                                                    <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                                                        <FileVideo className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                                    </div>
                                                    
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                                                        <div className="w-16 h-16 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                                            <Play className="w-8 h-8 text-white ml-1" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg">
                                                        HD
                                                    </div>
                                                    
                                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
                                                        {Math.floor((video.duration || 0) / 60)}:{String(Math.floor((video.duration || 0) % 60)).padStart(2, '0')}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
                                                        {video.name}
                                                    </h4>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-400">
                                                            {(video.size / (1024 * 1024)).toFixed(2)} MB
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                            <span className="text-green-400 font-medium">Ready</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="w-full bg-slate-700/50 rounded-full h-1">
                                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full w-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-blue-400">{completedVideos.length}</div>
                                                <div className="text-xs text-slate-400">Videos</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-purple-400">
                                                    {(completedVideos.reduce((acc, v) => acc + v.size, 0) / (1024 * 1024)).toFixed(1)}
                                                </div>
                                                <div className="text-xs text-slate-400">MB Total</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-green-400">5</div>
                                                <div className="text-xs text-slate-400">Qualities</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-8">
                            {processingVideos.length > 0 && (
                                <ProcessingQueue videos={processingVideos} />
                            )}

                            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all duration-300 flex items-center border border-white/10">
                                        <Settings className="w-5 h-5 mr-3 text-blue-400" />
                                        Batch Settings
                                    </button>
                                    <button className="w-full bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all duration-300 flex items-center border border-white/10">
                                        <Download className="w-5 h-5 mr-3 text-green-400" />
                                        Download All
                                    </button>
                                    <button className="w-full bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all duration-300 flex items-center border border-white/10">
                                        <Share2 className="w-5 h-5 mr-3 text-purple-400" />
                                        Share Library
                                    </button>
                                </div>
                            </div>

                            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                                    <Settings className="w-5 h-5 mr-3 text-purple-400" />
                                    Video Analytics
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-400/20">
                                            <div className="text-2xl font-bold text-blue-400">{videos.length}</div>
                                            <div className="text-xs text-slate-400">Total Videos</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-400/20">
                                            <div className="text-2xl font-bold text-green-400">{completedVideos.length}</div>
                                            <div className="text-xs text-slate-400">Completed</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 border border-purple-400/20">
                                            <div className="text-2xl font-bold text-purple-400">{processingVideos.length}</div>
                                            <div className="text-xs text-slate-400">Processing</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-4 border border-orange-400/20">
                                            <div className="text-2xl font-bold text-orange-400">5</div>
                                            <div className="text-xs text-slate-400">Qualities</div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-white">Available Qualities</h4>
                                        <div className="space-y-2">
                                            {['1080p', '720p', '480p', '360p', '240p'].map((quality, index) => (
                                                <div key={quality} className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            index === 0 ? 'bg-blue-400' :
                                                            index === 1 ? 'bg-purple-400' :
                                                            index === 2 ? 'bg-green-400' :
                                                            index === 3 ? 'bg-yellow-400' : 'bg-orange-400'
                                                        }`}></div>
                                                        <span className="text-slate-300">{quality}</span>
                                                    </div>
                                                    <span className="text-slate-400">Available</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium flex items-center justify-center">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Video Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}