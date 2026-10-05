// Shapes returned by the Django API (see notifications/serializers.py and
// notifications/metrics_view.py).

export type Channel = "email" | "sms" | "push";
export type NotificationStatus = "pending" | "sent" | "failed" | "retrying";
export type MetricsWindow = "1h" | "24h" | "7d" | "30d";

export interface NotificationSummary {
  notification_id: string;
  user_id: string;
  template_name: string;
  channel: string;
  to: string;
  status: NotificationStatus;
  attempts: number;
  created_at: string;
  sent_at: string | null;
}

export interface NotificationDetail extends NotificationSummary {
  max_retries: number;
  last_attempt_at: string | null;
  next_retry_at: string | null;
  error_message: string | null;
  provider_config: Record<string, unknown>;
  idempotency_key: string | null;
}

export interface ListResponse<T> {
  count: number;
  results: T[];
}

export interface Template {
  id: string;
  name: string;
  channel: string;
  subject: string;
  body_template: string;
  created_at: string;
}

export interface ChannelMetrics {
  channel: string;
  total: number;
  sent: number;
  failed: number;
  retrying: number;
  pending: number;
  success_rate: number | null;
  avg_latency_ms: number | null;
  p95_latency_ms: number | null;
}

export interface SeriesPoint {
  bucket: string;
  email: number;
  sms: number;
  push: number;
  total: number;
}

export interface Metrics {
  window: MetricsWindow;
  generated_at: string;
  total: number;
  previous_total: number;
  volume_change_pct: number | null;
  by_status: Record<NotificationStatus, number>;
  deliverability: number | null;
  previous_deliverability: number | null;
  latency: {
    p50_ms: number | null;
    p95_ms: number | null;
    avg_ms: number | null;
  };
  avg_attempts: number | null;
  throughput_per_min: number;
  channels: ChannelMetrics[];
  series: SeriesPoint[];
  templates: number;
}

export interface SendPayload {
  template_name: string;
  user_id: string;
  to: string;
  context?: Record<string, string>;
  channel?: Channel;
  priority?: "high" | "low";
  idempotency_key?: string;
  title?: string;
}

export interface SendResponse {
  notification_id: string;
  status: string;
}

export interface Me {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}
