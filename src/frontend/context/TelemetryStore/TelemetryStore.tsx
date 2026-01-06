import type { Telemetry, TelemetryVar } from '@irdashies/types';
import { create, useStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { useMemo, useEffect, useRef, useState } from 'react';
import { arrayCompare, telemetryCompare } from './telemetryCompare';

interface TelemetryState {
  telemetry: Telemetry | null;
  setTelemetry: (telemetry: Telemetry | null) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  telemetry: null,
  setTelemetry: (telemetry: Telemetry | null) => set({ telemetry }),
}));

/**
 * Throttles value updates with a delay, always remembering the latest value
 * @param value The value to throttle
 * @param delay The delay in milliseconds (default: 100ms)
 * @param logKey Optional key for logging
 * @returns The throttled value
 */
const useThrottledValue = <T,>(value: T, delay = 100, logKey?: string): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const pendingValue = useRef<T>(value);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const delayRef = useRef(delay);
  const logKeyRef = useRef(logKey);

  delayRef.current = delay;
  logKeyRef.current = logKey;
  pendingValue.current = value;

  useEffect(() => {
    if (timeoutId.current === null) {
      timeoutId.current = setTimeout(() => {
        setThrottledValue(pendingValue.current);
        // if (logKeyRef.current) {
        //   console.log(`${logKeyRef.current}:`, pendingValue.current);
        // }
        timeoutId.current = null;
      }, delayRef.current);
    }
  }, [value]); 

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
  }, []);

  return throttledValue;
};

export const useTelemetry = <T extends number[] | boolean[] = number[]>(
  key: keyof Telemetry,
  throttle: number = 100
) => {
  const storeValue = useStoreWithEqualityFn(
    useTelemetryStore,
    (state) => state.telemetry?.[key] as TelemetryVar<T>,
    telemetryCompare
  );

  return useThrottledValue(storeValue, throttle, `useTelemetry[${String(key)}]`);
};

/**
 * Returns the first telemetry value for a given key.
 * @param key the key of the telemetry value to retrieve
 * @param throttle the throttle delay in milliseconds
 * @returns the first telemetry value
 */
export const useTelemetryValue = <T extends number | boolean = number>(
  key: keyof Telemetry,
  throttle: number = 100
): T | undefined => {
  const storeValue = useStore(
    useTelemetryStore,
    (state) => state.telemetry?.[key]?.value?.[0] as T
  );

  return useThrottledValue(storeValue, throttle, `useTelemetryValue[${String(key)}]`);
};

/**
 * Returns the first telemetry value for a given key.
 * @param key the key of the telemetry value to retrieve
 * @param throttle the throttle delay in milliseconds
 * @returns the first telemetry value
 */
export const useTelemetryValues = <T extends number[] | boolean[] = number[]>(
  key: keyof Telemetry,
  throttle: number = 100
): T => {
  const storeValue = useStoreWithEqualityFn(
    useTelemetryStore,
    (state) => (state.telemetry?.[key]?.value ?? []) as T,
    arrayCompare
  );
  return useThrottledValue(storeValue, throttle, `useTelemetryValues[${String(key)}]`);
}

/**
 * Returns the first telemetry value for a given key plus a mapping function.
 * @param key the key of the telemetry value to retrieve
 * @param mapFn the mapping function to apply to the value
 * @param throttle the throttle delay in milliseconds
 * @returns the first telemetry value
 */
export const useTelemetryValuesMapped = <
  T extends number[] | boolean[], // Ensure T is an array of numbers or booleans
>(
  key: keyof Telemetry,
  mapFn: (val: T[number]) => T[number],
  throttle: number = 100
): T => {
  const rawValues = useTelemetryValues<T>(key, throttle);
  const values = useMemo(() => rawValues.map(mapFn) as T, [rawValues, mapFn]);
  return useThrottledValue(values, throttle, `useTelemetryValuesMapped[${String(key)}]`);
};
