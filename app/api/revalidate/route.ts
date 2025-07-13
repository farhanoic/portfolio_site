import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the path to revalidate from the request
    const { path } = await request.json()
    
    // Revalidate the specific path or default to hire-me page
    const pathToRevalidate = path || '/hire-me'
    
    revalidatePath(pathToRevalidate)
    
    return NextResponse.json({ 
      revalidated: true, 
      path: pathToRevalidate,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    return NextResponse.json({ 
      revalidated: false, 
      error: 'Failed to revalidate',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Manual revalidation endpoint for testing
    revalidatePath('/hire-me')
    
    return NextResponse.json({ 
      revalidated: true, 
      path: '/hire-me',
      timestamp: new Date().toISOString(),
      message: 'Hire me page cache cleared'
    })
  } catch (err) {
    return NextResponse.json({ 
      revalidated: false, 
      error: 'Failed to revalidate',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}