import React from 'react';
import { WindowButtons } from './buttons';

function Frame({
  height,
  title,
  children,
}: {
  height?: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="shadow"
        style={{
          height,
          borderRadius: '6px',
          // border: '1px solid rgba(175, 173, 169, 0.15)',
          boxShadow:
            '0 13px 27px -5px rgba(50,50,93,.25), 0 8px 16px -8px rgba(0,0,0,.3), 0 -6px 16px -6px rgba(0,0,0,.025)',
          overflow: 'hidden',
          fontFamily:
            'Ubuntu,Droid Sans,-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,sans-serif',
        }}
      >
        <Bar title={title} />
        <div
          style={{
            height: 'calc(100% - 28px)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Bar({ title }: { title: string }) {
  return (
    <div
      style={{
        height: '28px',
        background: 'rgb(45, 45, 45)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        color: '#fafafa',
        userSelect: 'none',
      }}
    >
      <WindowButtons />
      <div style={{ flex: 1, textAlign: 'center', fontSize: '14px' }}>
        {title}
      </div>
      <div style={{ width: 54 }} />
    </div>
  );
}

export { Frame };
