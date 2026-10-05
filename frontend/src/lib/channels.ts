import { Bell, Mail, MessageSquareText, type LucideIcon } from "lucide-react";
import type { NotificationStatus } from "./types";

export interface ChannelMeta {
  key: string;
  label: string;
  provider: string;
  color: string; // hex, for SVG
  text: string; // tailwind text class
  bg: string; // tailwind tinted bg class
  icon: LucideIcon;
}

export const CHANNELS: Record<string, ChannelMeta> = {
  push: {
    key: "push",
    label: "Push",
    provider: "Firebase FCM",
    color: "#fe5824",
    text: "text-push",
    bg: "bg-push/10",
    icon: Bell,
  },
  email: {
    key: "email",
    label: "Email",
    provider: "SMTP Relay",
    color: "#22d3ee",
    text: "text-email",
    bg: "bg-email/10",
    icon: Mail,
  },
  sms: {
    key: "sms",
    label: "SMS",
    provider: "Twilio",
    color: "#a78bfa",
    text: "text-sms",
    bg: "bg-sms/10",
    icon: MessageSquareText,
  },
};

export const CHANNEL_ORDER = ["push", "email", "sms"] as const;

export function channelMeta(key: string): ChannelMeta {
  return (
    CHANNELS[key] ?? {
      key,
      label: key,
      provider: key,
      color: "#8d929d",
      text: "text-muted",
      bg: "bg-white/5",
      icon: Bell,
    }
  );
}

export const STATUS_META: Record<
  NotificationStatus,
  { label: string; text: string; bg: string; dot: string; pulse?: boolean }
> = {
  sent: { label: "Delivered", text: "text-ok", bg: "bg-ok/10", dot: "bg-ok" },
  pending: {
    label: "Queued",
    text: "text-warn",
    bg: "bg-warn/10",
    dot: "bg-warn",
    pulse: true,
  },
  retrying: {
    label: "Retrying",
    text: "text-email",
    bg: "bg-email/10",
    dot: "bg-email",
    pulse: true,
  },
  failed: { label: "Failed", text: "text-err", bg: "bg-err/10", dot: "bg-err" },
};
