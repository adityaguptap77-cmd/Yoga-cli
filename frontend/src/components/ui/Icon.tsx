import type { ReactNode } from 'react';

const PATHS: Record<string, ReactNode> = {
  lotus: (<><path d="M12 4c2.6 2.7 3.4 5.6 0 10.4C8.6 9.6 9.4 6.7 12 4z" /><path d="M4 9.5c3.2-.2 6 1.6 8 4.9-3.7 1-7.4.2-8-4.9z" /><path d="M20 9.5c-3.2-.2-6 1.6-8 4.9 3.7 1 7.4.2 8-4.9z" /><path d="M5.5 17.5c3.4 2.4 9.6 2.4 13 0" /></>),
  wave: (<><path d="M3 8.5c3-3 6 3 9 0s6 3 9 0" /><path d="M3 15.5c3-3 6 3 9 0s6 3 9 0" /></>),
  breath: (<><circle cx="12" cy="12" r="2.6" /><circle cx="12" cy="12" r="6.4" /><path d="M12 2.5v1.2M12 20.3v1.2M2.5 12h1.2M20.3 12h1.2" /></>),
  spine: (<><path d="M12 3v18" /><path d="M9.5 6.5h5M8.5 10h7M8.5 14h7M9.5 17.5h5" /></>),
  sun: (<><circle cx="12" cy="12" r="3.8" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></>),
  moon: <path d="M19.5 14.2A7.7 7.7 0 1 1 9.8 4.5a6.2 6.2 0 0 0 9.7 9.7z" />,
  spark: <path d="M12 3.5l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" />,
  circle: (<><circle cx="12" cy="7" r="2.6" /><circle cx="7" cy="16" r="2.6" /><circle cx="17" cy="16" r="2.6" /></>),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />,
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="M4 7l8 6 8-6" /></>),
  pin: (<><path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  chat: <path d="M4 5.5h16v10.5H9.5L5 19.5V16H4z" />,
  edit: (<><path d="M4 20h4l10.5-10.5-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>),
  instagram: (<><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r=".6" fill="currentColor" /></>),
  youtube: (<><rect x="3" y="6" width="18" height="12" rx="3.5" /><path d="M10.5 9.5v5l4.2-2.5z" fill="currentColor" /></>),
  facebook: <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V20H14v-5.5h2.3l.7-3.5H14V9a.5.5 0 0 1 .5-.5z" />,
  whatsapp: (<><path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z" /><path d="M9.3 8.8c.2 2.6 2.4 4.8 5 5l1.2-1.3-1.8-1-.9.7a3.8 3.8 0 0 1-1.8-1.8l.7-.9-1-1.8z" /></>),
};

export default function Icon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg className={`icon icon-${name}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
