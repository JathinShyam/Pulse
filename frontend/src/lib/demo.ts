import type {
  ChannelMetrics,
  NotificationStatus,
  NotificationSummary,
  SeriesPoint,
} from "./types";

/**
 * Deterministic sample data used only when live metrics cannot be loaded.
 * Every surface that renders it marks it as "Sample".
 */

const bucket = (hour: number) =>
  new Date(Date.UTC(2026, 9, 22, hour, 0, 0)).toISOString();

export const DEMO_SERIES: SeriesPoint[] = [
  38, 34, 41, 36, 48, 56, 51, 63, 72, 66, 81, 88, 79, 94, 112, 104, 121, 108,
  96, 117, 132, 126, 141, 154,
].map((total, index) => {
  const push = Math.round(total * 0.56);
  const email = Math.round(total * 0.3);
  const sms = total - push - email;
  return {
    bucket: bucket(index),
    push,
    email,
    sms,
    total,
  };
});

export const DEMO_CHANNELS: ChannelMetrics[] = [
  {
    channel: "push",
    total: 1154,
    sent: 1146,
    failed: 4,
    retrying: 2,
    pending: 0,
    sending: 2,
    success_rate: 99.65,
    avg_latency_ms: 34,
    p95_latency_ms: 61,
  },
  {
    channel: "email",
    total: 618,
    sent: 611,
    failed: 5,
    retrying: 1,
    pending: 1,
    success_rate: 99.19,
    avg_latency_ms: 128,
    p95_latency_ms: 204,
  },
  {
    channel: "sms",
    total: 286,
    sent: 281,
    failed: 3,
    retrying: 0,
    pending: 2,
    success_rate: 98.94,
    avg_latency_ms: 412,
    p95_latency_ms: 780,
  },
];

export const DEMO_STATUS: Record<NotificationStatus, number> = {
  sent: 2038,
  pending: 3,
  sending: 2,
  retrying: 3,
  failed: 12,
};

const now = Date.UTC(2026, 9, 22, 9, 41, 0);

export const DEMO_NOTIFICATIONS: NotificationSummary[] = [
  {
    notification_id: "7f9a2ec419aa",
    user_id: "usr_9918",
    template_name: "security_alert",
    channel: "push",
    to: "fcm_device_token_99x",
    status: "sent",
    attempts: 1,
    created_at: new Date(now - 14_000).toISOString(),
    sent_at: new Date(now - 13_982).toISOString(),
  },
  {
    notification_id: "02ab4189ffbb",
    user_id: "usr_2091",
    template_name: "welcome_email",
    channel: "email",
    to: "nadia@northstar.studio",
    status: "sent",
    attempts: 1,
    created_at: new Date(now - 48_000).toISOString(),
    sent_at: new Date(now - 47_913).toISOString(),
  },
  {
    notification_id: "bc3488012acc",
    user_id: "usr_1182",
    template_name: "otp_login",
    channel: "sms",
    to: "+14155550123",
    status: "pending",
    attempts: 1,
    created_at: new Date(now - 66_000).toISOString(),
    sent_at: null,
  },
  {
    notification_id: "e9112a77dddd",
    user_id: "usr_8821",
    template_name: "incident_opened",
    channel: "push",
    to: "fcm_token_338a9",
    status: "sent",
    attempts: 1,
    created_at: new Date(now - 104_000).toISOString(),
    sent_at: new Date(now - 103_981).toISOString(),
  },
  {
    notification_id: "18ee50ab29ee",
    user_id: "usr_4402",
    template_name: "security_alert",
    channel: "push",
    to: "fcm_token_881x",
    status: "retrying",
    attempts: 2,
    created_at: new Date(now - 132_000).toISOString(),
    sent_at: null,
  },
  {
    notification_id: "92bb11cc021a",
    user_id: "usr_3018",
    template_name: "invoice_ready",
    channel: "email",
    to: "billing@fieldwork.co",
    status: "failed",
    attempts: 3,
    created_at: new Date(now - 186_000).toISOString(),
    sent_at: null,
  },
  {
    notification_id: "5ca70b2dd901",
    user_id: "usr_7710",
    template_name: "otp_login",
    channel: "sms",
    to: "+447700900184",
    status: "sent",
    attempts: 1,
    created_at: new Date(now - 214_000).toISOString(),
    sent_at: new Date(now - 213_212).toISOString(),
  },
  {
    notification_id: "af03c91e77b2",
    user_id: "usr_5521",
    template_name: "digest_weekly",
    channel: "email",
    to: "team@arcade.systems",
    status: "sent",
    attempts: 1,
    created_at: new Date(now - 298_000).toISOString(),
    sent_at: new Date(now - 297_840).toISOString(),
  },
];
