"use client";

import Input from './form';
import Medias from './medias';
import Output from './result';
import ParsedUrl from '../lib/urlParser';
import React, { useState } from 'react';

export default function Home() {
  const [parsedUrl, setParsedUrl] = useState<ParsedUrl | null>(null);
  const [decode, setDecode] = useState<boolean>(false);
  const [mediaLink, setMediaLink] = useState<boolean>(false);
  const [mediaId, setMediaId] = useState<Record<string, string>>({
    contentType: '', contentId: ''
  });

  return (
    <main>
      <div className="container">
        <h1>
          <a id="self-link" href="https://tomasfn87.github.io/url-parser">
            <img height="80px" width="80px" src="https://iili.io/3QLo60P.png" />
          </a>&nbsp; URL Parser
        </h1>
        <Input
          setParsedUrl={ setParsedUrl }
          setDecode={ setDecode }
          setMediaLink={ setMediaLink }
          setMediaId={ setMediaId }
        />
        <Output data={ parsedUrl } decode={ decode } />
        <Medias
          parsedUrl={ parsedUrl }
          mediaLink={ mediaLink }
          mediaId={ mediaId }
        />
      </div>
    </main>
  );
}
