"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type {
  ListResponse,
  Me,
  Metrics,
  MetricsWindow,
  NotificationDetail,
  NotificationSummary,
  SendPayload,
  SendResponse,
  Template,
} from "./types";

export function useMetrics(window: MetricsWindow = "24h") {
  return useQuery({
    queryKey: ["metrics", window],
    queryFn: async () =>
      (await api.get<Metrics>("/metrics", { params: { window } })).data,
    refetchInterval: 10_000,
    placeholderData: (prev) => prev,
  });
}

export interface NotificationFilters {
  status?: string;
  channel?: string;
  user_id?: string;
  limit?: number;
}

export function useNotifications(
  filters: NotificationFilters = {},
  opts: { live?: boolean } = {},
) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== ""),
  );
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () =>
      (
        await api.get<ListResponse<NotificationSummary>>(
          "/notifications/list/",
          { params },
        )
      ).data,
    refetchInterval: opts.live === false ? false : 5_000,
    placeholderData: (prev) => prev,
  });
}

export function useNotification(id: string | null) {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: async () =>
      (await api.get<NotificationDetail>(`/notifications/status/${id}/`)).data,
    enabled: !!id,
    refetchInterval: (q) => {
      const s = q.state.data?.status;
      return s === "pending" || s === "retrying" ? 2_000 : false;
    },
  });
}

export function useTemplates(channel?: string) {
  return useQuery({
    queryKey: ["templates", channel ?? "all"],
    queryFn: async () =>
      (
        await api.get<ListResponse<Template>>("/notifications/templates/", {
          params: channel ? { channel } : {},
        })
      ).data,
    staleTime: 60_000,
  });
}

export function useSendNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SendPayload) =>
      (await api.post<SendResponse>("/notifications/send/", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get<Me>("/auth/me/")).data,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
