'use client'

import Image from 'next/image'
import Link from 'next/link'

interface BrandLogoProps {
  showText?: boolean
  href?: string
  className?: string
  logoSize?: number
  textSize?: 'sm' | 'md' | 'lg'
}

export function BrandLogo({
  showText = true,
  href = '/',
  className = '',
  logoSize = 32,
  textSize = 'md',
}: BrandLogoProps) {
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const subtextSizeClasses = {
    sm: 'text-[8px]',
    md: 'text-xs',
    lg: 'text-xs',
  }

  const content = (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Discovery Medical Center"
          width={12}
          height={12}
          className="w-auto h-auto"
          priority
        />
      </div>
      {showText && (
        <div className="min-w-0">
          <h1 className={`${textSizeClasses[textSize]} font-bold text-sidebar-foreground leading-none`}>
            DMC
          </h1>
          <p className={`${subtextSizeClasses[textSize]} text-muted-foreground leading-none`}>
            Medical Center
          </p>
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
