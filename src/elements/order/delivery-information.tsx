import { Mail, MapPin, Phone, UserRound } from 'lucide-react'

import Typography from '@/components/ui/typography'

interface DeliveryInformationProps {
  name?: string
  phone?: string
  email?: string
  address?: string
}

export default function DeliveryInformation({
  name,
  phone,
  email,
  address,
}: DeliveryInformationProps) {
  return (
    <div className='flex flex-col gap-2 w-full'>
      {name && (
        <Typography className='flex items-center gap-1.5'>
          <UserRound size={16} /> {name}
        </Typography>
      )}
      {phone && (
        <Typography className='flex items-center gap-1.5'>
          <Phone size={16} /> {phone}
        </Typography>
      )}
      {email && (
        <Typography className='flex items-center gap-1.5'>
          <Mail size={16} /> {email}
        </Typography>
      )}
      {address && (
        <Typography className='flex items-start gap-1.5'>
          <MapPin className='mt-0.75' size={16} /> {address}
        </Typography>
      )}
    </div>
  )
}
