export function FloatingElements() {
  return (
    <>
      {/* Floating Circles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full opacity-10 top-[10%] left-[5%] animate-float-gentle" />
        <div className="absolute w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-full opacity-10 top-[60%] right-[10%] animate-float-gentle-delayed" />
        <div className="absolute w-28 h-28 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-10 bottom-[20%] left-[15%] animate-float-gentle-slow" />
      </div>

      {/* Floating Hearts */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {["💕", "💖", "💗", "💝", "💙", "🖤", "🧡", "💙"].map((heart, index) => (
          <div
            key={index}
            className="absolute text-2xl opacity-30 animate-heart-float"
            style={{
              left: `${10 + index * 10}%`,
              animationDelay: `${index * 2}s`,
              color: index % 2 === 0 ? "#ec4899" : "#6366f1",
            }}
          >
            {heart}
          </div>
        ))}
      </div>
    </>
  )
}
