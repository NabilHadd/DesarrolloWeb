import { useMemo } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

export default function AnimatedText({
  as: Component = 'p',
  text = '',
  isActive = false,
  speed = 12,
  delay = 0,
  className = '',
  style = {},
  ...rest
}) {
  const shouldAnimate = useMemo(() => Boolean(isActive && text), [isActive, text]);
  const renderedText = useTypewriter(text, shouldAnimate, speed, delay);

  const animationClass = shouldAnimate ? 'animate-text-slide' : '';

  return (
    <Component
      className={`${className} ${animationClass}`.trim()}
      style={{
        ...style,
        animationDelay: shouldAnimate ? `${delay}ms` : undefined,
      }}
      {...rest}
    >
      {renderedText}
    </Component>
  );
}
