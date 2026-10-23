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
    color: "#d94a2b",
    text: "text-push",
    bg: "bg-push/10",
    icon: Bell,
  },
  email: {
    key: "email",
    label: "Email",
    provider: "SMTP",
    color: "#3f6f8f",
    text: "text-email",
    bg: "bg-email/10",
    icon: Mail,
  },
  sms: {
    key: "sms",
    label: "SMS",
    provider: "Twilio",
    color: "#9a6b2f",
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
      color: "#898c84",
      text: "text-muted",
      bg: "bg-surface-2",
      icon: Bell,
    }
  );
}

export const STATUS_META: Record<
  NotificationStatus,
  { label: string; text: string; bg: string; dot: string; pulse?: boolean }
> = {
  sent: {
    label: "Sent",
    text: "text-ok",
    bg: "bg-ok/10",
    dot: "bg-ok",
  },
  pending: {
    label: "Queued",
    text: "text-warn",
    bg: "bg-warn/10",
    dot: "bg-warn",
    pulse: true,
  },
  sending: {
    label: "Sending",
    text: "text-accent-ink",
    bg: "bg-accent-soft",
    dot: "bg-accent",
    pulse: true,
  },
  retrying: {
    label: "Retrying",
    text: "text-accent-ink",
    bg: "bg-accent-soft",
    dot: "bg-accent",
    pulse: true,
  },
  failed: {
    label: "Failed",
    text: "text-err",
    bg: "bg-err/10",
    dot: "bg-err",
  },
};
