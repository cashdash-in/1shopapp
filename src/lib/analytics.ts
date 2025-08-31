
'use client';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// In a real app, this would be a database. For this prototype, we'll use localStorage.
interface ClickData {
    category: string;
    brand: string;
    clicks: number;
}

export const trackLinkClick = (categoryName: string, linkName: string) => {
    if (typeof window === 'undefined') return;

    // For Firebase Analytics
    if (analytics) {
        logEvent(analytics, 'link_click', {
            category_name: categoryName,
            link_name: linkName,
        });
    }

    // For Brand Popularity Report
    try {
        const storedClicks = localStorage.getItem('brandClicks');
        const clicks: Record<string, ClickData> = storedClicks ? JSON.parse(storedClicks) : {};
        
        const key = `${categoryName}_${linkName}`;
        if (clicks[key]) {
            clicks[key].clicks += 1;
        } else {
            clicks[key] = {
                category: categoryName,
                brand: linkName,
                clicks: 1,
            };
        }

        localStorage.setItem('brandClicks', JSON.stringify(clicks));
    } catch (error) {
        console.error("Failed to track click in localStorage:", error);
    }
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
