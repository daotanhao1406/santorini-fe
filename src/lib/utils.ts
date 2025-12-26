import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import isEqual from 'fast-deep-equal'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSiteURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Ưu tiên cấu hình trong Dashboard/Env
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Tự động lấy URL preview của Vercel
    'http://localhost:3000/' // Fallback cho localhost

  // Đảm bảo có protocol (Vercel URL thường không có http/https ở đầu)
  url = url.includes('http') ? url : `https://${url}`

  // Xóa dấu / ở cuối nếu có để chuẩn hóa
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url

  return url
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

/**
 * Hàm format ngày tháng trả về string
 * @param date - Chuỗi ISO hoặc Date object
 * @param formatStr - Định dạng mong muốn (Mặc định: dd/MM/yyyy HH:mm)
 * @returns string đã format
 */
export const formatDate = (
  date: string | Date | null | undefined,
  formatStr: string = 'dd/MM/yyyy HH:mm',
): string => {
  // 1. Kiểm tra đầu vào
  if (!date) return ''

  // 2. Chuyển đổi sang Date object
  const dateObj = new Date(date)

  // 3. Kiểm tra tính hợp lệ của ngày
  if (isNaN(dateObj.getTime())) return ''

  // 4. Trả về string (Sử dụng locale tiếng Việt)
  return format(dateObj, formatStr, { locale: vi })
}
