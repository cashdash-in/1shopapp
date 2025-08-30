'use client';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

export const trackLinkClick = (serviceName: string, linkName: string) => {
    if (analytics) {
        logEvent(analytics, 'link_click', {
            service_name: serviceName,
            link_name: linkName,
        });
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
