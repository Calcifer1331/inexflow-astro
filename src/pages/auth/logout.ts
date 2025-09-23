import type { APIContext } from 'astro';

export async function POST(context: APIContext) {
    return handleLogout(context);
}

export async function GET(context: APIContext) {
    return handleLogout(context);
}

async function handleLogout({ session, request, redirect }: APIContext) {
    await session?.destroy()
    return redirect('/')
}