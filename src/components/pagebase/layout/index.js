import dynamic from 'next/dynamic';

export const Header = dynamic(() => import('./header'));
export const Sidebar = dynamic(() => import('./sidebar'));
