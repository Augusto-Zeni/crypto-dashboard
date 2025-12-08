import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a large number with appropriate suffix (M, B, T) using Intl.NumberFormat
 * @param value - The number to format
 * @param currency - Currency code (e.g., 'USD', 'BRL', 'EUR')
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted string with suffix
 */
export function formatLargeNumber(
  value: number | null | undefined,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0)
  }

  const absValue = Math.abs(value)
  let divisor = 1
  let suffix = ''

  if (absValue >= 1e12) {
    divisor = 1e12
    suffix = 'T'
  } else if (absValue >= 1e9) {
    divisor = 1e9
    suffix = 'B'
  } else if (absValue >= 1e6) {
    divisor = 1e6
    suffix = 'M'
  } else if (absValue >= 1e3) {
    divisor = 1e3
    suffix = 'K'
  }

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value / divisor)

  return suffix ? `${formattedValue}${suffix}` : formattedValue
}

/**
 * Formats a price using Intl.NumberFormat
 * @param value - The price to format
 * @param currency - Currency code (e.g., 'USD', 'BRL', 'EUR')
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted price string
 */
export function formatPrice(
  value: number | null | undefined,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
    ...options,
  }).format(value)
}
