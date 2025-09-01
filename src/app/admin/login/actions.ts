
'use server';

import { cookies } from 'next/headers';

// This is a simplified server action.
// In a real-world scenario, this would be in a separate actions file.
export async function setLoginCookie(password: string): Promise<{ success: boolean; message: string }> {
    // IMPORTANT: This is a prototype implementation.
    // In a real production app, use a secure authentication provider.
    if (password === process.env.ADMIN_PASSWORD) {
        cookies().set('admin-auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        return { success: true, message: "Login successful!" };
    } else {
        return { success: false, message: "Invalid password." };
    }
}


export async function logout(): Promise<void> {
    // Clear the admin authentication cookie
    cookies().set('admin-auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1, // Expire the cookie immediately
        path: '/',
    });
}
