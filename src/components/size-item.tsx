import { cn } from '@/lib/utils'

import Typography, { TypographySize } from '@/components/ui/typography'

interface SizeItem extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  icon?: React.ReactNode
  textSize?: TypographySize
  isSelected?: boolean
}

export default function SizeItem({
  className,
  name,
  icon,
  isSelected,
  textSize = 'sm',
  ...props
}: SizeItem) {
  return (
    <div
      className={cn(
        'flex flex-col px-2 py-1 gap-2 rounded-md cursor-pointer transition-colors duration-300',
        isSelected
          ? 'text-white bg-primary'
          : 'text-default-700 bg-default-100 hover:bg-default-200',
        className,
      )}
      {...props}
    >
      {icon}
      <Typography size={textSize}>{name || 'Size M'}</Typography>
    </div>
  )
}
