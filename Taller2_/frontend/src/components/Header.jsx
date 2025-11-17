import AnimatedText from './AnimatedText';

export default function Header() {
  return (
    <header className="text-center px-4 py-6 md:py-8">
      <AnimatedText
        as="h1"
        text="InfoMóvil"
        isActive
        className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 hero-title"
        speed={18}
      />
    </header>
  );
}
