interface JuicyLogoProps {
  text: string
  color?: string
  fontSize?: string
  fontFamily?: string
  className?: string
  isMobile?: boolean
}

export default function JuicyLogo({
  text,
  color = 'white',
  className = '',
}: JuicyLogoProps) {
  return (
    <div className='absolute z-0 left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-full text-center'>
      <h1
        className={`leading-none select-none font-bold ${className} xl:text-[24rem] lg:text-[17rem] md:text-[12rem] text-[7rem]`}
        style={{
          color,
          letterSpacing: '0.01em',
          textTransform: 'uppercase',
          display: 'inline-block',
        }}
      >
        {text}
      </h1>
    </div>
  )
}
