'use client';

import { useState } from 'react';
import { HomePage } from './components/home-page';
import { UploadFlow } from './components/upload-flow';
import { DemoPage } from './components/demo-page';

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
  availableQualities?: Array<{
    quality: string;
    playlistUrl: string;
    folder: string;
  }>;
  masterPlaylist?: string;
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'upload' | 'demo'>('home');
  const [videos, setVideos] = useState<VideoFile[]>([]);

  const handleNavigateToUpload = () => {
    setCurrentView('upload');
  };

  const handleNavigateToDemo = () => {
    setCurrentView('demo');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleFileUpload = async (files: File[]) => {
    console.log('🎬 Starting file upload process...', files.length, 'files');
    
    const newVideos = files.map((file, index) => {
      console.log(`📁 File ${index + 1}:`, {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      return {
        id: `temp-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        originalUrl: URL.createObjectURL(file),
        status: 'uploading' as const,
        progress: 0,
        duration: Math.floor(Math.random() * 300) + 30, 
      };
    });

    setVideos(prev => [...prev, ...newVideos]);

    // Upload each file to S3
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempVideo = newVideos[i];
      
      console.log(`Uploading file ${i + 1}/${files.length}:`, file.name);
      
      try {
        // Update progress to show upload starting
        console.log('Setting upload progress to 10%');
        setVideos(prev => prev.map(v => 
          v.id === tempVideo.id 
            ? { ...v, progress: 10 } 
            : v
        ));

        console.log('Creating FormData and sending request...');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Upload failed with response:', errorText);
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Upload result:', result);

        if (result.success) {
          console.log('Upload successful, updating video state');
          // Update video with real S3 data
          setVideos(prev => prev.map(v => 
            v.id === tempVideo.id 
              ? {
                  ...v,
                  id: result.video.id,
                  originalUrl: result.video.originalUrl,
                  status: 'processing' as const,
                  progress: 0,
                }
              : v
          ));

          // Start polling for processing status using filename
          console.log('Starting status polling for:', result.video.name);
          startStatusPolling(result.video.name);
        } else {
          console.error('Upload failed:', result.error);
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error for file:', file.name, error);
        setVideos(prev => prev.map(v => 
          v.id === tempVideo.id 
            ? { ...v, status: 'error' as const, progress: 0 } 
            : v
        ));
      }
    }
  };

  const startStatusPolling = (fileName: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/video/${encodeURIComponent(fileName)}/status`);
        if (!response.ok) {
          throw new Error('Failed to check status');
        }

        const result = await response.json();
        
        if (result.success) {
          setVideos(prev => prev.map(video => {
            if (video.name === fileName) {
              const updatedVideo = {
                ...video,
                status: result.video.status,
                progress: result.video.progress,
              };

              if (result.video.status === 'completed' && result.video.processedUrl) {
                updatedVideo.processedUrl = result.video.processedUrl;
                updatedVideo.thumbnail = result.video.processedUrl;
                updatedVideo.availableQualities = result.video.availableQualities;
                updatedVideo.masterPlaylist = result.video.masterPlaylist;
              }

              return updatedVideo;
            }
            return video;
          }));

          if (result.video.status === 'completed' || result.video.status === 'error') {
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 5000); // Poll every 5 seconds

    setTimeout(() => {
      clearInterval(pollInterval);
    }, 30 * 60 * 1000);
  };

  if (currentView === 'upload') {
    return (
      <UploadFlow
        onBackToHome={handleBackToHome}
        onFileUpload={handleFileUpload}
        videos={videos}
      />
    );
  }

  if (currentView === 'demo') {
    return (
      <DemoPage onBack={handleBackToHome} />
    );
  }

  return <HomePage onNavigateToUpload={handleNavigateToUpload} onNavigateToDemo={handleNavigateToDemo} />;
}