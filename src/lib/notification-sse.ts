import baseConfig from '@/configs/base';

export type SseNotificationPayload = {
  id?: string | number;
  title?: string;
  message?: string;
  content?: string;
  body?: string;
  created_at?: string;
  createdAt?: string;
  [key: string]: unknown;
};

const SSE_STREAM_PATH = '/api/v1.0/notifications/stream';

const resolveApiBaseUrl = (): string => {
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (envApiUrl) {
    return envApiUrl.replace(/\/$/, '');
  }

  return baseConfig.backendDomain.replace(/\/$/, '');
};

export const buildNotificationSseUrl = (): string => {
  return `${resolveApiBaseUrl()}${SSE_STREAM_PATH}`;
};

export const createNotificationEventSource = (): EventSource => {
  return new EventSource(buildNotificationSseUrl(), {
    withCredentials: true,
  });
};
