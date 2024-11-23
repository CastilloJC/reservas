
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// const API_URL = '/api/reservations';

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

// Ajustamos ApiResponse para su uso en SWR
export async function apiRequest<T = unknown>(
  endpoint: string,
  method: RequestMethod = 'GET',
  data?: Partial<T>
): Promise<ApiResponse<T>> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${endpoint}`, options);

    console.log(response);

    if (!response.ok) {
      const error = await response.json();
      return {
        ok: false,
        error: error.error || 'API request failed',
      };
    }

    const responseData = await response.json();
    return {
      ok: true,
      data: responseData,
    };
  } catch {
    return {
      ok: false,
      error: 'An unexpected error occurred',
    };
  }
}
