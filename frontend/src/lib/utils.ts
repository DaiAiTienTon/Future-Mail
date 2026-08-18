/**
 * Future Mail — Open Source Project
 * Released under the MIT License.
 * Copyright (c) 2026 DaiAiTienTon
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
