import { describe, it, expect, vi, beforeEach } from 'vitest'

// mock next-auth before importing the route
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}))

// mock the auth config
vi.mock('@/lib/auth/config', () => ({
  authOptions: {},
}))

// tracks what gets inserted into supabase
const mockInsert = vi.fn()

// mock supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      from: vi.fn((table: string) => {
        if (table === 'artworks') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() =>
                  Promise.resolve({ data: { id: 'artwork-1' }, error: null })
                ),
              })),
            })),
          }
        }
        return {
          insert: vi.fn((data: unknown) => {
            mockInsert(data)
            return {
              select: vi.fn(() => ({
                single: vi.fn(() =>
                  Promise.resolve({
                    data: { id: 'inquiry-1', ...data as Record<string, unknown> },
                    error: null,
                  })
                ),
              })),
            }
          }),
        }
      }),
    })
  ),
}))

// helper to create a mock NextRequest with json body
function createMockRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// import after mocks are set up
const { POST } = await import('@/app/api/inquiries/route')

describe('POST /api/inquiries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 201 for valid submission', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      inquiry_type: 'general',
      message: 'Hello, this is a test inquiry.',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.success).toBe(true)
  })

  it('returns 400 when name is missing', async () => {
    const body = {
      email: 'test@example.com',
      inquiry_type: 'general',
      message: 'Hello',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('name is required')
  })

  it('returns 400 when name is empty string', async () => {
    const body = {
      name: '   ',
      email: 'test@example.com',
      inquiry_type: 'general',
      message: 'Hello',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('name is required')
  })

  it('returns 400 when email is missing', async () => {
    const body = {
      name: 'Test User',
      inquiry_type: 'general',
      message: 'Hello',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('email is required')
  })

  it('returns 400 for invalid email format', async () => {
    const body = {
      name: 'Test User',
      email: 'not-an-email',
      inquiry_type: 'general',
      message: 'Hello',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('invalid email format')
  })

  it('returns 400 when inquiry_type is missing', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('inquiry_type is required')
  })

  it('returns 400 for invalid inquiry_type', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      inquiry_type: 'invalid_type',
      message: 'Hello',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toContain('invalid inquiry_type')
  })

  it('returns 400 when message is missing', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      inquiry_type: 'general',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('message is required')
  })

  it('returns 400 when message is empty whitespace', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      inquiry_type: 'general',
      message: '   ',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('message is required')
  })

  it('returns 400 for invalid json body', async () => {
    const request = new Request('http://localhost:3000/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    }) as any

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('invalid json in request body')
  })

  it('accepts valid commission inquiry type', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      inquiry_type: 'commission',
      message: 'I would like to commission a piece.',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)

    expect(response.status).toBe(201)
  })

  it('accepts valid purchase inquiry type', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      inquiry_type: 'purchase',
      message: 'I want to buy this piece.',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)

    expect(response.status).toBe(201)
  })

  it('trims whitespace from name and message', async () => {
    const body = {
      name: '  Test User  ',
      email: 'TEST@EXAMPLE.COM',
      inquiry_type: 'general',
      message: '  Hello world  ',
    }

    const request = createMockRequest(body) as any
    const response = await POST(request)

    expect(response.status).toBe(201)

    // verify the insert was called with trimmed data
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello world',
      })
    )
  })
})
