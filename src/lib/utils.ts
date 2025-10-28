import { type ClassValue, clsx } from 'clsx'
import isEqual from 'fast-deep-equal'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const simpleGet = (obj: any, path: string) => {
  if (obj == null) return undefined

  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (
      result == null ||
      (typeof result !== 'object' && typeof result !== 'function')
    ) {
      return undefined
    }
    result = result[key]
  }

  return result
}

/**
 * So sánh hai object với tùy chọn chỉ định các key cần so sánh
 * @param obj1 - Object thứ nhất
 * @param obj2 - Object thứ hai
 * @param keys - Mảng các key cần so sánh (hỗ trợ nested path như 'name.firstName'). Nếu không truyền thì so sánh toàn bộ
 * @returns true nếu các key được chỉ định giống nhau, false nếu khác nhau
 */
export function compareObjects<T extends Record<string, any>>(
  obj1: T,
  obj2: T,
  keys?: string[],
): boolean {
  try {
    // Kiểm tra input cơ bản
    if (obj1 === obj2) return true

    // Kiểm tra null/undefined
    if (obj1 == null || obj2 == null) {
      return obj1 === obj2
    }

    // Kiểm tra kiểu dữ liệu
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return isEqual(obj1, obj2) // Dùng fast-deep-equal
    }

    // Nếu không có keys được chỉ định, so sánh toàn bộ object
    if (!keys || keys.length === 0) {
      return isEqual(obj1, obj2) // Dùng fast-deep-equal
    }

    // So sánh từng key được chỉ định
    for (const key of keys) {
      try {
        // SỬA: Dùng simpleGet thay vì lodash.get
        const value1 = simpleGet(obj1, key)
        const value2 = simpleGet(obj2, key)

        // SỬA: Dùng fast-deep-equal thay vì lodash.isEqual
        if (!isEqual(value1, value2)) {
          return false
        }
      } catch {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}
