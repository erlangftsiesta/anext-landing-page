import React from "react";

export function WordByWord({ children }: { children: string }) {
  const words = children.split(" ");

  return (
    <span>
      <style>{`
        @keyframes wordBlurIn {
          0% {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0);
          }
        }
        .hero-word {
          display: inline-block;
          opacity: 0;
          animation: wordBlurIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (max-width: 768px) {
          .hero-word {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            animation: none !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-word {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>
      {words.map((word, index) => (
        <span key={index}>
          <span
            className="hero-word"
            style={{
              animationDelay: `${0.08 + index * 0.07}s`,
            }}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

export default WordByWord;
