'use client';

import { useEffect, useRef } from 'react';
import { toast } from '@/components/ui/toaster';
import useAuthStore from '@/stores/auth';
import {
  createNotificationEventSource,
  SseNotificationPayload,
} from '@/lib/notification-sse';

const normalizeNotificationContent = (payload: SseNotificationPayload): { title: string; content: string } => {
  const title =
    (typeof payload.title === 'string' && payload.title.trim()) ||
    'Thông báo mới';

  const content =
    (typeof payload.message === 'string' && payload.message.trim()) ||
    (typeof payload.content === 'string' && payload.content.trim()) ||
    (typeof payload.body === 'string' && payload.body.trim()) ||
    'Bạn có một thông báo mới.';

  return { title, content };
};

const parsePayload = (rawData: string): SseNotificationPayload | null => {
  if (!rawData || !rawData.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawData) as SseNotificationPayload;
    return parsed;
  } catch {
    return {
      message: rawData,
    };
  }
};

const useSseNotifications = () => {
  const authId = useAuthStore((state) => state.id);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!authId || typeof window === 'undefined') {
      return;
    }

    const eventSource = createNotificationEventSource();
    eventSourceRef.current = eventSource;

    const handleMessage = (event: MessageEvent<string>) => {
      const payload = parsePayload(event.data);

      if (!payload) {
        return;
      }

      const { title, content } = normalizeNotificationContent(payload);
      toast.success({
        title,
        content,
      });
    };

    eventSource.addEventListener('notification', handleMessage as EventListener);
    eventSource.onmessage = handleMessage;

    eventSource.onerror = () => {
      // Browser EventSource auto-reconnects; keep handler for debug visibility.
      console.warn('SSE notification stream disconnected. Waiting for reconnect...');
    };

    return () => {
      eventSource.removeEventListener('notification', handleMessage as EventListener);
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [authId]);
};

export default useSseNotifications;
