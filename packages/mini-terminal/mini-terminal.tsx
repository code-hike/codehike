import React from 'react';
import { TerminalContent } from './terminal-content';
import { Frame } from './frame';

function MiniTerminal({
  height,
  title = 'bash',
  text,
}: {
  height?: number;
  title?: string;
  text: string;
}) {
  return (
    <Frame title={title} height={height}>
      <div
        style={{
          fontSize: '14px',
          height: '100%',
          boxSizing: 'border-box',
          background: 'rgb(30, 30, 30)',
          color: 'rgb(231, 231, 231)',
          overflow: 'hidden',
          padding: '0 8px 8px',
          fontFamily:
            'Ubuntu,Droid Sans,-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,sans-serif',
        }}
      >
        <div>
          <TerminalContent text={text} progress={1} />
        </div>
      </div>
    </Frame>
  );
}

export { MiniTerminal };
