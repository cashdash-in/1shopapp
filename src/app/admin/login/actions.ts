
'use server';

// This is a simplified server action.
// In a real-world scenario, this would be in a separate actions file.
export async function setLoginCookie(password: string): Promise<{ success: boolean; message: string }> {
    // IMPORTANT: This is a prototype implementation.
    // In a real production app, use a secure authentication provider.
    if (password === process.env.ADMIN_PASSWORD) {
        const { cookies } = await import('next/headers');
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
