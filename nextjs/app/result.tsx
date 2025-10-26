"use client";

import type ParsedUrl from '@/lib/urlParser';
import { stringifyKeyOptionalValueObj } from '@/lib/urlParser';
import React, { JSX } from 'react';

import type { KeyOptionalValue } from '@/lib/urlParser';

interface ParsedUrlProps {
    data: ParsedUrl | null;
    decode: boolean; 
}

function renderSimpleRow(label: string, value: string | undefined | null, isOdd: boolean, isOriginRow = false): JSX.Element | null {
    if (value === undefined || value === null) return null;
    
    const bgColor = isOdd ? '#222' : '#282828';
    
    let ValueContent: React.ReactNode = value;

    if (isOriginRow) {
        const originUrl = `https://${value.replace(/^\s*\w+:\/\//, '')}`;
        const faviconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${originUrl}&size=18`;

        ValueContent = (
            <a 
                href={originUrl} 
                className="url-link" 
                target="_blank"
                rel="noopener noreferrer"
            >
                <img 
                    src={faviconUrl} 
                    alt="" 
                    width={18} 
                    height={18} 
                    style={{ marginRight: '8px', verticalAlign: 'middle' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                />
                {value}
            </a>
        );
    } else if (label === 'Full URL') {
        const fullUrlLink = `https://${value.replace(/^\s*\w+:\/\//, '')}`;
        ValueContent = (
            <a 
                href={fullUrlLink} 
                className="url-link" 
                target="_blank"
                rel="noopener noreferrer"
            >
                {value}
            </a>
        );
    }

    return (
        <tr key={label} style={{ backgroundColor: bgColor }}>
            <td>{label}</td> 
            <td>
                {ValueContent}
            </td>
        </tr>
    );
}

function renderDetailedRow(
    title: string, 
    obj: KeyOptionalValue | undefined, 
    decode: boolean, 
    isOdd: boolean
): JSX.Element | null {
    if (!obj || Object.keys(obj).length === 0) return null;

    let index = 0;
    
    const bgColor = isOdd ? '#222' : '#282828'; 
    
    const subTableContent = (
        <table className="sub-table">
            <tbody>
                {Object.entries(obj).map(([key, value]) => {
                    const decodedKey = decode ? decodeURIComponent(key) : key;
                    const decodedValue = decode && value ? decodeURIComponent(String(value)) : (value || '');
                    
                    const rowBgColor = index % 2 === 0 ? '#2a2a2a' : '#333';
                    index++;
                    
                    return (
                        <tr key={`${title}-${key}`} style={{ backgroundColor: rowBgColor }}>
                            <td className="param-key-cell">
                                <span className="param-key-sub">{decodedKey}</span>
                            </td>
                            <td className="param-value-cell">
                                {decodedValue || '(sem valor)'}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <tr key={title} style={{ backgroundColor: bgColor }}>
            <td>{title}</td> 
            <td>
                {subTableContent}
            </td>
        </tr>
    );
}

export default function Output({ data, decode }: ParsedUrlProps) {
    if (!data) {
        return (
            <div id="output-container" className="mt-4 text-center text-muted">
                <p>Insira uma URL válida no campo acima para visualizar a análise.</p>
            </div>
        );
    }
    
    let isOdd = true;
    const rows: (JSX.Element | null)[] = [];
    
    rows.push(renderSimpleRow("Origin", data.origin, isOdd, true));
    isOdd = !isOdd;

    rows.push(renderSimpleRow("Path", data.path, isOdd));
    isOdd = !isOdd;
    
    if (data.parameters && Object.keys(data.parameters).length > 0) {
        const parameterSummaryValue = decode 
            ? decodeURIComponent(stringifyKeyOptionalValueObj(data.parameters))
            : stringifyKeyOptionalValueObj(data.parameters);
            
        rows.push(renderSimpleRow("Parameters", parameterSummaryValue, isOdd));
        isOdd = !isOdd;

        rows.push(renderDetailedRow("Detailed Parameters", data.parameters, decode, isOdd));
        isOdd = !isOdd;
    }

    if (data.fragment && Object.keys(data.fragment).length > 0) {
        const fragmentSummaryValue = decode 
            ? decodeURIComponent(stringifyKeyOptionalValueObj(data.fragment))
            : stringifyKeyOptionalValueObj(data.fragment);
            
        rows.push(renderSimpleRow("Fragment", fragmentSummaryValue, isOdd));
        isOdd = !isOdd;
        
        rows.push(renderDetailedRow("Detailed Fragment", data.fragment, decode, isOdd));
        isOdd = !isOdd;
    }

    const fullUrlValue = decode ? decodeURIComponent(data.fullUrl()) : data.fullUrl();
    rows.push(renderSimpleRow("Full URL", fullUrlValue, isOdd));

    const filteredRows = rows.filter((row): row is JSX.Element => row !== null);

    return (
        <div id="output-container" className="mt-4">
            <h2>Analysis Result:</h2>
            <div className="table-wrapper"> 
                <table id="parsedResult" className="url-table">
                    <tbody>
                        {filteredRows} 
                    </tbody>
                </table>
            </div>
        </div>
    );
}