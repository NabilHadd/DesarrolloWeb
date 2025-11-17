import React from "react";
import AnimatedText from "../AnimatedText";

export default function HabilidadesList({ habilidades }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-purple-200">
      <AnimatedText
        as="h3"
        text="Habilidades"
        isActive
        className="text-2xl font-bold text-center mb-6 text-purple-600"
        speed={12}
      />

      <ul className="space-y-3">
        {habilidades.map((hab) => (
          <li
            key={`hab-${hab.id}`}
            className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all shadow-sm border border-purple-200"
          >
            <AnimatedText
              as="p"
              text={`${hab.name} — ${hab.effect}`}
              isActive
              className="text-gray-800 font-medium capitalize"
              speed={10}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
