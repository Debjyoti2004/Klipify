'use client';

import { FileVideo, Loader2, CheckCircle, AlertCircle, Upload, Zap } from 'lucide-react';

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

interface ProcessingQueueProps {
    videos: VideoFile[];
}

export function ProcessingQueue({ videos }: ProcessingQueueProps) {
    const getStatusIcon = (video: VideoFile) => {
        switch (video.status) {
            case 'uploading':
                return <Upload className="w-5 h-5 text-blue-400 animate-pulse" />;
            case 'processing':
                return <Zap className="w-5 h-5 text-purple-400 animate-pulse" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            default:
                return <FileVideo className="w-5 h-5 text-slate-400" />;
        }
    };

    const getStatusText = (video: VideoFile) => {
        switch (video.status) {
            case 'uploading':
                return 'Uploading to S3...';
            case 'processing':
                return 'Transcoding...';
            case 'completed':
                return 'Complete';
            case 'error':
                return 'Failed';
            default:
                return 'Pending';
        }
    };

    const getProgressColor = (video: VideoFile) => {
        switch (video.status) {
            case 'uploading':
                return 'from-blue-500 to-blue-600';
            case 'processing':
                return 'from-purple-500 to-purple-600';
            case 'completed':
                return 'from-green-500 to-green-600';
            case 'error':
                return 'from-red-500 to-red-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    return (
        <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Loader2 className="w-5 h-5 mr-3 text-blue-400 animate-spin" />
                Processing Queue ({videos.length})
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                {getStatusIcon(video)}
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-white truncate text-sm">{video.name}</h4>
                                    <p className="text-xs text-slate-400">{getStatusText(video)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{Math.round(video.progress)}%</p>
                                <p className="text-xs text-slate-400">
                                    {(video.size / (1024 * 1024)).toFixed(1)} MB
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ease-out bg-gradient-to-r ${getProgressColor(video)}`}
                                style={{ width: `${video.progress}%` }}
                            >
                                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                            </div>
                        </div>

                        {/* Processing Steps */}
                        {video.status === 'processing' && (
                            <div className="mt-3 space-y-1">
                                <div className="text-xs text-slate-400 space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                        <span>✓ Upload completed</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                                        <span>⚡ Transcoding segments...</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                                        <span>⏳ Optimizing quality...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}