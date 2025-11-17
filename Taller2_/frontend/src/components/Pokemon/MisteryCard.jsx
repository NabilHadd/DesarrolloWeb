import React from "react";
import AnimatedText from "../AnimatedText";

export default function MisteryCards({ ids, isExpanded, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {ids.map((id, index) => (
        <div
          key={id}
          className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
          onClick={() => onSelect(id)}
        >
          {/* Caja misteriosa */}
          <div className="w-full h-32 flex items-center justify-center bg-purple-50 rounded-lg mb-3 border border-purple-200 shadow-inner">
            <span
              className="text-purple-500 text-6xl font-extrabold"
              style={{ fontFamily: "'Comic Sans MS', 'Comic Neue', cursive" }}
            >
              ?
            </span>
          </div>

          {/* Texto animado */}
          <AnimatedText
            as="p"
            text="¡Ábreme!"
            isActive={isExpanded}
            className="text-center text-base font-bold text-purple-700"
            speed={10}
            delay={index * 40}
          />
        </div>
      ))}
    </div>
  );
}
