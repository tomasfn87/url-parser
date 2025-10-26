// app/spotifyPlayer.tsx

"use client";

import React, { useEffect } from 'react';
import { regexpMedia } from '@/lib/urlParser'; 

interface SpotifyPlayerProps {
    contentId: string;
    contentType: keyof typeof regexpMedia;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ contentId, contentType }) => {
    
    const iframeId = `spotify-iframe-{contentId}`;
    
    const embedUrl = `https://open.spotify.com/embed/${contentId.replace(':', '/')}`;

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        const deferredMessage = () => {
            timeoutId = setTimeout(() => {
                
                const iframeSelector = `iframe[src^="${embedUrl}"]`;
                const spotifyPlayer = document.querySelector(iframeSelector) as HTMLIFrameElement | null;

                if (spotifyPlayer && spotifyPlayer.contentWindow) {
                    try {
                        const targetOrigin = 'https://open.spotify.com';
                        
                        spotifyPlayer.contentWindow.postMessage({
                            type: 'listeningOn',
                            origin: window.location.hostname,
                            gtmId: 'MXNVD4PJ' 
                        }, targetOrigin);
                    } catch (e) {
                        console.error('Erro ao enviar postMessage para Spotify:', e);
                    }
                }
            }, 250);
        };

        deferredMessage();

        return () => {
            clearTimeout(timeoutId);
        };
        
    }, [contentId, embedUrl]);

    return (
        <div id="spotify-embed-container" className="flex justify-content-center">
            <iframe
                id={iframeId}
                src={embedUrl}
                width="300" 
                height="380"
                allow="encrypted-media"
                title={`Spotify ${contentType}`}
            />
        </div>
    );
};

export default SpotifyPlayer;