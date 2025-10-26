// app/medias.tsx

"use client";

import React from 'react';
// Importamos os tipos necessários
import type ParsedUrl from '@/lib/urlParser'; 
import { regexpMedia, KeyOptionalValue } from '@/lib/urlParser'; 
import YouTubePlayer from './youTubePlayer';
import VimeoPlayer from './vimeoPlayer';
import SpotifyPlayer from './spotifyPlayer';

interface MediasProps {
    parsedUrl: ParsedUrl | null; 
    mediaLink: boolean;
    mediaId: Record<string, string>;
}

export default function Medias({ parsedUrl, mediaLink, mediaId }: MediasProps) {
    
    const contentType = mediaId.contentType as keyof typeof regexpMedia;
    const contentId = mediaId.contentId;
    
    const isYouTube = contentType.startsWith('YouTube');
    const isVimeo = contentType.startsWith('Vimeo');
    const isSpotify = contentType.startsWith('Spotify');
    
    let mediaTitle = '';
    if (isYouTube) {
        mediaTitle = 'YouTube';
    } else if (isVimeo) {
        mediaTitle = 'Vimeo';
    } else if (isSpotify) {
        mediaTitle = 'Spotify';
    }

    let linkUrl: string | null = null;
    if (mediaLink) {
        const mediaConfig = regexpMedia[contentType];
        if (mediaConfig) {
            linkUrl = 'https://tomasfn87.github.io/url-parser/?';
            linkUrl += mediaConfig.identifier;
            linkUrl += `=${contentId}`;
        }
    }

    const showPlayers = (isYouTube || isVimeo || isSpotify) && parsedUrl;

    return (
        <div id="media-embed-container" className="mt-4">
            <span className="mt-4 flex items-center">
                <a 
                    href="https://www.youtube.com" 
                    title="YouTube content supported" 
                    aria-label="YouTube content supported" 
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg height="32px" width="32px" version="1.1" id="Layer_1_youtube" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-46.1 -46.1 553.20 553.20" xmlSpace="preserve" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0" transform="translate(126.775275,126.775275), scale(0.45)">
                            <rect x="-46.1" y="-46.1" width="553.20" height="553.20" rx="138.3" fill="#FFFFFF" strokeWidth="0"></rect>
                        </g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="3.688008"></g>
                        <g id="SVGRepo_iconCarrier"> 
                            <g> 
                                <path style={{ fill: '#FF0033' }} d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"></path> 
                            </g> 
                        </g>
                    </svg>
                </a>
                
                <a 
                    href="https://www.vimeo.com" 
                    title="Vimeo content supported" 
                    aria-label="Vimeo content supported" 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '5px' }}
                >
                    <svg height="24px" width="24px" viewBox="0 -3.5 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                            <defs> </defs> 
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
                                <g id="Color-" transform="translate(-300.000000, -365.000000)" style={{ fill: '#00B2EA' }}> 
                                    <path d="M347.975851,374.479329 C347.767002,379.100014 344.498808,385.41644 338.193846,393.431401 C331.668746,401.81233 326.13991,406 321.621448,406 C318.827396,406 316.459507,403.452198 314.526249,398.339832 C313.230825,393.649305 311.943867,388.958779 310.651265,384.282221 C309.211905,379.167061 307.670943,376.610878 306.022735,376.610878 C305.664306,376.610878 304.414038,377.356781 302.25782,378.85138 L300,375.971134 C302.365066,373.917807 304.696265,371.856098 306.996419,369.799977 C310.146078,367.101318 312.513967,365.684941 314.094441,365.536878 C317.819844,365.179292 320.117175,367.701951 320.983614,373.096476 C321.906498,378.921221 322.555621,382.541782 322.91405,383.960952 C323.992159,388.788367 325.17187,391.196487 326.464472,391.196487 C327.466379,391.196487 328.973474,389.637634 330.982934,386.517135 C332.992393,383.391049 334.062036,381.016453 334.208794,379.379378 C334.496666,376.680719 333.421379,375.339771 330.982934,375.339771 C329.834268,375.339771 328.648912,375.580024 327.432512,376.08288 C329.803223,368.486965 334.318863,364.793769 340.99072,365.00888 C345.932524,365.145768 348.266545,368.308172 347.975851,374.479329" id="Vimeo"> </path> 
                                </g> 
                            </g> 
                        </g>
                    </svg>
                </a>
                
                <a 
                    href="https://www.spotify.com" 
                    title="Spotify content supported" 
                    aria-label="Spotify content supported" 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '5px' }}
                >
                    <svg height="24px" width="24px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                            <defs> </defs> 
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
                                <g id="Color-" transform="translate(-200.000000, -460.000000)" style={{ fill: '#00DA5A' }}> 
                                    <path d="M238.16,481.36 C230.48,476.8 217.64,476.32 210.32,478.6 C209.12,478.96 207.92,478.24 207.56,477.16 C207.2,475.96 207.92,474.76 209,474.4 C217.52,471.88 231.56,472.36 240.44,477.64 C241.52,478.24 241.88,479.68 241.28,480.76 C240.68,481.6 239.24,481.96 238.16,481.36 M237.92,488.08 C237.32,488.92 236.24,489.28 235.4,488.68 C228.92,484.72 219.08,483.52 211.52,485.92 C210.56,486.16 209.48,485.68 209.24,484.72 C209,483.76 209.48,482.68 210.44,482.44 C219.2,479.8 230,481.12 237.44,485.68 C238.16,486.04 238.52,487.24 237.92,488.08 M235.04,494.68 C234.56,495.4 233.72,495.64 233,495.16 C227.36,491.68 220.28,490.96 211.88,492.88 C211.04,493.12 210.32,492.52 210.08,491.8 C209.84,490.96 210.44,490.24 211.16,490 C220.28,487.96 228.2,488.8 234.44,492.64 C235.28,493 235.4,493.96 235.04,494.68 M224,460 C210.8,460 200,470.8 200,484 C200,497.2 210.8,508 224,508 C237.2,508 248,497.2 248,484 C248,470.8 237.32,460 224,460" id="Spotify"> </path> 
                                </g> 
                            </g> 
                        </g>
                    </svg>
                </a>
                
                <span style={{ marginLeft: '10px', marginRight: '10px' }}>Content supported</span>

                {linkUrl && (
                    <span id="media-link" className="text-center mt-2">
                            |  <a href={linkUrl} target="_blank" rel="noopener noreferrer">Media Link</a>
                    </span>
                )}
                
                <span id="github-logo">
                    <a 
                        href="https://github.com/tomasfn87/url-parser" 
                        title="This website's repository at github.com" 
                        aria-label="This website's repository at github.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg id="github-logo-svg" aria-hidden="true" height="24" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true" className="octicon octicon-mark-github">
                            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                    </a>
                </span>
            </span>

            {showPlayers && (
                <div id="player-container">
                    <h2 className="text-2xl font-bold border-b pb-2">▶️ Player de {mediaTitle}</h2>

                    <div id="youtube-embed-container" style={{ display: isYouTube ? 'block' : 'none' }}>
                        {isYouTube && parsedUrl && (
                            <YouTubePlayer 
                                contentId={contentId} 
                                contentType={contentType} 
                                urlParameters={parsedUrl.parameters} 
                            />
                        )}
                    </div>

                    <div id="vimeo-embed-container" style={{ display: isVimeo ? 'block' : 'none' }}>
                        {isVimeo && (
                            <VimeoPlayer 
                                contentId={contentId} 
                                contentType={contentType} 
                            />
                        )}
                    </div>

                    <div id="spotify-embed-container" style={{ display: isSpotify ? 'block' : 'none' }}>
                        {isSpotify && (
                            <SpotifyPlayer 
                                contentId={contentId} 
                                contentType={contentType} 
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}