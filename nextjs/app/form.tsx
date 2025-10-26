"use client";

import React, { useEffect, useState } from 'react';
import type ParsedUrl from '@/lib/urlParser';
import { regexp, regexpMedia, parseUrl } from '@/lib/urlParser';

interface FormProps {
    setParsedUrl: (data: ParsedUrl | null) => void;
    setDecode: (decode: boolean) => void;
    setMediaLink: (mediaLink: boolean) => void;
    setMediaId: (mediaId: Record<string, string>) => void;
}

export default function Input({ setParsedUrl, setDecode, setMediaLink, setMediaId }: FormProps) {
    const [urlInput, setUrlInput] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const url = urlInput.replaceAll('\\', '').replaceAll(' ', '');
        if (!url.length) {
            setIsValid(false);
            setParsedUrl(null);
            setMediaLink(false);
            setMediaId({ contentType: '', contentId: '' });
            return;
        }
        const valid = regexp.UrlParts.test(url) || regexpMedia.SpotifyUri.re.test(url);
        setIsValid(valid);
        if (!valid) {
            setParsedUrl(null);
            setMediaLink(false);
            setMediaId({ contentType: '', contentId: '' });
        }
    }, [urlInput, setParsedUrl, setMediaLink, setMediaId]);

    const handleParse = (decode: boolean) => {
        if (!isValid)
            return;
        setDecode(decode);
        let urlToParse = urlInput;
        
        if (regexpMedia.SpotifyUri.re.test(urlToParse)) {
            urlToParse = (function(uri) {
                const matches = regexpMedia.SpotifyUri.re.exec(uri);
                if (!matches) return '';
                const contentType = matches[1];
                const contentId = matches[2];
                return `http://open.spotify.com/${contentType}/${contentId}`;
            })(urlToParse);
        }
        
        const result = parseUrl(urlToParse);
        setParsedUrl(result);

        const mediaId: Record<string, string> = {
            contentType: '',
            contentId: ''
        };
        let mediaFound = false;

        Array.from(Object.keys(regexpMedia)).forEach((e) => {
            const mediaKey = e as keyof typeof regexpMedia;
            if (!mediaFound && regexpMedia[mediaKey].re.test(urlInput)) {
                
                const id = regexpMedia[mediaKey].getId(urlInput);
                
                if (id) {
                    mediaFound = true;
                    mediaId.contentType = mediaKey;
                    mediaId.contentId = id;
                    
                    setMediaId(mediaId);
                    setMediaLink(true);
                    return;
                }
            }
        });
        
        if (!mediaFound) {
            setMediaId({ contentType: '', contentId: '' });
            setMediaLink(false);
        }
    };
    
    const handleParseClick = () => {
        handleParse(false);
    };

    const handleDecodeClick = () => {
        handleParse(true);
    };

    return (
        <form id="urlForm">
            <div className="form-group">
                <label htmlFor="urlInput">Enter URL:</label>
                <input id="urlInput"
                    className={`form-control ${urlInput.length ? (isValid ? 'valid' : 'invalid') : ''}`}
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/path?param=value#fragment" />
                <br />
                
                <div id="button-container">
                    <button type="button" id="parseButton" 
                        className="btn-primary"
                        disabled={!isValid}
                        onClick={handleParseClick}>
                        Parse
                    </button>
                    
                    <button type="button" id="decodeButton" 
                        className="btn-primary"
                        disabled={!isValid}
                        onClick={handleDecodeClick}>
                        Decode
                    </button>
                </div>
            </div>
        </form>
    );
}