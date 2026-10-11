import { useEffect, useState } from "react";
import { callApi } from "../lib/api";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(path: string | null) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: Boolean(path),
    error: null,
  });

  useEffect(() => {
    if (path === null) {
      setState({
        data: null,
        loading: false,
        error: null,
      });
      return;
    }

    const url = path;
    const controller = new AbortController();

    setState({
      data: null,
      loading: true,
      error: null,
    });

    async function fetchData() {
      try {
        const data = await callApi<T>(url, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error
              : new Error("An unexpected error occurred"),
        });
      }
    }

    void fetchData();

    return () => {
      controller.abort();
    };
  }, [path]);

  return state;
}
