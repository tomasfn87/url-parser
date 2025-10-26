// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import Script from 'next/script'; // Importação do componente Script
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.css';


export const metadata: Metadata = {
  title: 'URL Parser',
  description: 'App to analyze URLs. Supports YouTube, Vimeo and Spotify Content via IFrame API (dynamically loaded content). Check github.com/tomasfn87/url-parser for the Spotify Audio Tag for Google Tag Manager and Google Analytics.',
  icons: {
    icon: [
      { url: 'https://raw.githubusercontent.com/tomasfn87/url-parser/refs/heads/main/icons/favicon.ico', type: 'image/x-icon' },
      { url: 'https://raw.githubusercontent.com/tomasfn87/url-parser/refs/heads/main/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://raw.githubusercontent.com/tomasfn87/url-parser/refs/heads/main/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: 'https://raw.githubusercontent.com/tomasfn87/url-parser/refs/heads/main/icons/apple-icon-180x180.png',
  },
  manifest: 'https://raw.githubusercontent.com/tomasfn87/url-parser/refs/heads/main/icons/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
    return (
      <html lang="pt-BR">
        <head>
          <Script id="gtm-snippet" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MXNVD4PJ');
            `}
          </ Script>
        </head>
        <body>
            {children}
            <Script 
              src="https://www.youtube.com/iframe_api" 
              strategy="lazyOnload" 
              id="youtube-api" 
            />
            <Script 
              src="https://player.vimeo.com/api/player.js" 
              strategy="lazyOnload" 
              id="vimeo-api" 
            />
            <Script 
              src="https://open.spotify.com/embed/iframe-api/v1" 
              strategy="lazyOnload" 
              id="spotify-api" 
              async 
            />

        </body>
      </html>
  );
}