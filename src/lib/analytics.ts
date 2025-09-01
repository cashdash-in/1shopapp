
'use client';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';
import { updateClickCount } from '@/ai/flows/click-tracking-flow';


export const trackLinkClick = (categoryName: string, linkName:string) => {
    if (typeof window === 'undefined') return;

    // For Firebase Analytics (optional, good for high-level tracking)
    if (analytics) {
        logEvent(analytics, 'link_click', {
            category_name: categoryName,
            link_name: linkName,
        });
    }

    // For our centralized Brand Popularity Report
    // This is an async call, but we don't need to wait for it.
    // We can fire-and-forget, letting it run in the background.
    updateClickCount({ category: categoryName, brand: linkName })
        .catch(console.error); // Log errors if the server call fails
};

export const trackPWAInstall = () => {
    if(analytics) {
        logEvent(analytics, 'pwa_install');
    }
};

export const trackAdminLogin = () => {
    if (analytics) {
        logEvent(analytics, 'login', {
            method: 'Admin'
        });
    }
}
