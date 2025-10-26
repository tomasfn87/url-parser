"use client";

import React, { useRef, useEffect } from 'react';
import { regexp } from '../lib/urlParser';

export default function Form() {
  const urlInputRef = useRef<HTMLInputElement>(null);
    const parseButtonRef = useRef<HTMLButtonElement>(null);
    const decodeButtonRef = useRef<HTMLButtonElement>(null);

    const validateUrlInput = () => {
        const urlInput = urlInputRef.current;
        const parseButton = parseButtonRef.current;
        const decodeButton = decodeButtonRef.current;
        
        if (!urlInput || !parseButton || !decodeButton) return;

        
        const url = urlInput.value.replaceAll('\\', '').replaceAll(' ', '');
        
        if (regexp.UrlParts.test(url) || regexp.SpotifyUri.test(url)) {
            urlInput.classList.remove('invalid');
            urlInput.classList.add('valid');
            parseButton.disabled = false;
            decodeButton.disabled = false;
        } else {
            urlInput.classList.remove('valid');
            urlInput.classList.add('invalid');
            parseButton.disabled = true;
            decodeButton.disabled = true;
        }
    };

    useEffect(() => {
        const inputElement = urlInputRef.current;
        
        if (inputElement) {
            inputElement.addEventListener('input', validateUrlInput);
        }

        return () => {
            if (inputElement) {
                inputElement.removeEventListener('input', validateUrlInput);
            }
        };
    }, []);

  return (
    <form id="urlForm">
      <div className="form-group">
        <label htmlFor="urlInput">Enter URL:</label>
        <input id="urlInput" className="form-control" type="text"
          placeholder="https://example.com/path?param=value#fragment"
          ref={urlInputRef} />
        <br />
        <div id="button-container">
          <button type="button" id="parseButton" className="btn btn-primary" ref={parseButtonRef} disabled>
            Parse
          </button>
          &nbsp;
          <button type="button" id="decodeButton" className="btn btn-primary" ref={decodeButtonRef} disabled>
            Decode
          </button>
        </div>
      </div>
    </form>
  );
}
