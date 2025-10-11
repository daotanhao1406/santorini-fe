'use client'
import { motion, MotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface NumberProps {
  mv: MotionValue<number>
  number: number
}

function Number({ mv, number }: NumberProps) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10
    const offset = (10 + number - placeValue) % 10
    let memo = offset * 1 // mỗi số dịch 1em
    if (offset > 5) memo -= 10 * 1
    return memo + 'em'
  })

  const style: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return <motion.span style={{ ...style, y }}>{number}</motion.span>
}

interface DigitProps {
  place: number
  value: number
  digitStyle?: React.CSSProperties
}

function Digit({ place, value, digitStyle }: DigitProps) {
  const valueRoundedToPlace = Math.floor(value / place)
  const animatedValue = useSpring(valueRoundedToPlace)

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])

  const defaultStyle: React.CSSProperties = {
    position: 'relative',
    width: '1ch',
    height: '1em', // chiều cao bằng đúng line-height hiện tại
    overflow: 'hidden',
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  )
}

interface CounterProps {
  value: number
  places?: number[]
  gap?: number
  containerStyle?: React.CSSProperties
  counterStyle?: React.CSSProperties
  digitStyle?: React.CSSProperties
}

export default function Counter({
  value,
  places = [10, 1],
  gap = 0,
  containerStyle,
  counterStyle,
  digitStyle,
}: CounterProps) {
  const defaultContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  }

  const defaultCounterStyle: React.CSSProperties = {
    display: 'flex',
    gap,
    lineHeight: 1,
  }

  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit
            key={place}
            place={place}
            value={value}
            digitStyle={digitStyle}
          />
        ))}
      </div>
    </div>
  )
}
