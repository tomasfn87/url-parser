"use client";

import React, { useEffect, useRef } from 'react';
import { regexpMedia } from '@/lib/urlParser';

declare global {
    interface Window {
        Vimeo: any;
    }
    var Vimeo: {
        Player: new (element: HTMLElement | string, options: Record<string, any>) => any;
    };
}

interface VimeoPlayerProps {
    contentId: string;
    contentType: keyof typeof regexpMedia;
}

const VimeoPlayer: React.FC<VimeoPlayerProps> = ({ contentId }) => {
    
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!window.Vimeo || !window.Vimeo.Player) {
            console.error('Vimeo Player API não está carregada.');
            return;
        }

        if (containerRef.current && contentId) {
            
            containerRef.current.innerHTML = '';
            
            playerRef.current = new window.Vimeo.Player(
                containerRef.current,
                {
                    id: contentId,
                    width: 480,
                    volume: 1,
                    muted: true,
                    autoplay: true,
                    vimeo_logo: false,
                }
            );

            playerRef.current.on('play', () => {
                console.log('Vimeo: O vídeo está a tocar!');
            });

            return () => {
                if (playerRef.current) {
                    playerRef.current.destroy().then(() => {
                        console.log('Vimeo: Player destruído.');
                    }).catch((error: any) => {
                        console.error('Vimeo: Erro ao destruir o player:', error);
                    });
                    playerRef.current = null;
                }
            };
        }
        
    }, [contentId]);
    
    return (
        <div ref={containerRef} id="vimeo-embed-container" className="flex justify-center">
        </div>
    );
};

export default VimeoPlayer;