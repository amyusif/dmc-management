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
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const subtextSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-xs',
  }

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Discovery Medical Center"
          width={logoSize}
          height={logoSize}
          className="w-auto h-auto"
          priority
        />
      </div>
      {showText && (
        <div className="min-w-0">
          <h1 className={`${textSizeClasses[textSize]} font-bold text-sidebar-foreground leading-tight`}>
            Discovery
          </h1>
          <p className={`${subtextSizeClasses[textSize]} text-muted-foreground leading-tight`}>
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
