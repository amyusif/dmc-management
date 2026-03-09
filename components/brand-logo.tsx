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
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
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
        <div>
          <h1 className={`${textSizeClasses[textSize]} font-bold text-sidebar-foreground`}>
            Discovery
          </h1>
          <p className="text-xs text-muted-foreground">Medical Center</p>
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
