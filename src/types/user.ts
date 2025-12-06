// 1. Type cho user_metadata (Nằm trong Auth của Supabase)
export interface IUserMetadata {
  // Các trường bạn chủ động lưu từ form Register
  full_name?: string
  phone_number?: string
  avatar_url?: string

  // Các trường Supabase hoặc Provider (Google/Facebook) tự sinh ra
  // Nên để optional (?) vì không phải user nào cũng giống nhau
  email?: string
  email_verified?: boolean
  phone_verified?: boolean
  sub?: string
  iss?: string

  // Index signature để chấp nhận các trường lạ khác nếu có
  [key: string]: any
}

// 2. Type cho User Profile (Nằm trong Database - Bảng 'profiles')
// ĐÂY LÀ PHẦN QUAN TRỌNG CHO QUÁN TRÀ SỮA
export interface IUserProfile {
  id: string
  // Có thể lặp lại full_name nếu bạn muốn sync, hoặc chỉ lưu các dữ liệu nghiệp vụ
  loyalty_points: number // Điểm tích lũy (Không nên để trong metadata)
  member_rank: 'silver' | 'gold' | 'diamond' // Hạng thành viên
  total_spent: number // Tổng chi tiêu
}
