"use client";

import React, { useEffect, useRef } from 'react';
import type { KeyOptionalValue } from '@/lib/urlParser';
import { regexpMedia } from '@/lib/urlParser';

declare global {
    var YT: any;
    interface Window {
        onYouTubeIframeAPIReady: (() => void) | undefined;
    }
}

interface YouTubePlayerProps {
    contentId: string;
    contentType: keyof typeof regexpMedia;
    urlParameters: KeyOptionalValue | null;
}

const youTubePlayer: React.FC<YouTubePlayerProps> = ({ contentId, contentType, urlParameters }) => {
    
    const containerId = 'youtube-embed-container'; 
    const playerRef = useRef<any>(null);

    const params = urlParameters as Record<string, string | null> | null;

    const startTimeParam = params ? params['t'] : null;
    const startParam = params ? params['start'] : null;
    const effectiveStartTimeParam = startTimeParam || startParam;
    
    let videoStart = 0;
    if (effectiveStartTimeParam && typeof effectiveStartTimeParam === 'string' && /\d+/.test(effectiveStartTimeParam)) {
        videoStart = parseInt(effectiveStartTimeParam);
    }

    useEffect(() => {
        
        const videoId = contentId;
        let youTubePlaylistId = '';
        let youTubeUserId = '';

        const initYouTube = () => {
            if (!window.YT || !window.YT.Player || !videoId) {
                return;
            }
            
            let playerVars: any = {
                'playsinline': 1,
                'autoplay': 1,
                'mute': 1,
                'start': videoStart
            };
            
            let currentVideoId = undefined;

            if (contentType === 'YouTubeVideo' || contentType === 'YouTubeLive') {
                currentVideoId = videoId;
            } else if (contentType === 'YouTubePlaylist') {
                youTubePlaylistId = videoId;
            } else if (contentType === 'YouTubeUser') {
                youTubeUserId = videoId;
            }

            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }

            playerRef.current = new window.YT.Player(containerId, {
                height: '270',
                width: '480',
                videoId: currentVideoId,
                playerVars: playerVars,
                events: {
                    'onReady': (event: any) => {
                         if (youTubePlaylistId) {
                            event.target.loadPlaylist({
                                list: youTubePlaylistId,
                                listType: 'playlist',
                                index: 0,
                                startSeconds: videoStart
                            });
                            youTubePlaylistId = '';
                        } else if (youTubeUserId) {
                            event.target.loadPlaylist({
                                list: youTubeUserId,
                                listType: 'user_uploads',
                                index: 0,
                                startSeconds: videoStart
                            });
                            youTubeUserId = '';
                        }
                        event.target.playVideo();
                    },
                    'onStateChange': (event: any) => {
                        
                    }
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initYouTube();
        } else {
            window.onYouTubeIframeAPIReady = initYouTube;
        }
        
        return () => {
             if (playerRef.current) {
                 playerRef.current.destroy();
                 playerRef.current = null;
             }
        };

    }, [contentId, contentType, videoStart]);
    
    return (
        <div className="flex justify-content-center">
             <div id={containerId}></div>
        </div>
    );
};

export default youTubePlayer;