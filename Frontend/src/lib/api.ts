const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

type ApiErrorPayload = {
  message?: string;
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const payload = (await response.json()) as ApiErrorPayload;
      if (payload.message) {
        errorMessage = payload.message;
      }
    } catch (_error) {
      // Keep default message when server sends no JSON body.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}
