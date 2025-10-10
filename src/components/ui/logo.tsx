export function Logo() {
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-full">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/videos/loop.mp4" type="video/mp4" />
      </video>
    </div>
  )
} 