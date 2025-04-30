import Image from "next/image"

export function Logo() {
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-full">
      <Image
        src="/logo.png"
        alt="Logo"
        fill
        className="object-cover"
        priority
      />
    </div>
  )
} 