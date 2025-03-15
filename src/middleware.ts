import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'



export function middleware (request: NextRequest){

    const token = request.cookies.get('MapToken')
    if(!token){
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}


export const config = {
    matcher: [{ source: '/home' }, { source: '/notes' }, { source: '/profile' }]
}