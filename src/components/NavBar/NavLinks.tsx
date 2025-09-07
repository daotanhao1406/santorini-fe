import { NavLinksProps } from './types'

export default function NavLinks({ navItems, textColor }: NavLinksProps) {
  return (
    <div className='hidden space-x-8 md:flex xl:space-x-20 '>
      {navItems.map((item, index) => (
        <span
          key={index}
          className='text-base font-normal cursor-pointer relative group'
          style={{ color: textColor }}
        >
          {item.label}
          <span
            className='absolute left-0 bottom-0 w-0 h-[2px] group-hover:w-full transition-all duration-300'
            style={{ backgroundColor: textColor }}
          />
        </span>
      ))}
    </div>
  )
}
