// API utility for making backend requests
// Uses environment variable in server-side, relative URLs in client-side

const getApiBaseUrl = (): string => {
  // In browser (client-side), use relative URLs since nginx handles routing
  if (typeof window !== 'undefined') {
    return ''; // Empty string means relative URLs
  }
  
  // In server-side (Next.js API routes), use environment variable
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const baseUrl = getApiBaseUrl(); // Evaluate at runtime
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const baseUrl = getApiBaseUrl(); // Evaluate at runtime
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API request failed: ${response.statusText}`);
    }
    return response.json();
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const baseUrl = getApiBaseUrl(); // Evaluate at runtime
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API request failed: ${response.statusText}`);
    }
    return response.json();
  },

  delete: async (endpoint: string): Promise<void> => {
    const baseUrl = getApiBaseUrl(); // Evaluate at runtime
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
  },

  upload: async (endpoint: string, formData: FormData): Promise<any> => {
    const baseUrl = getApiBaseUrl(); // Evaluate at runtime
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `Upload failed: ${response.statusText}`);
    }
    return response.json();
  },
};

