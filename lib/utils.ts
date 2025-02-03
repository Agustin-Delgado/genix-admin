import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleRipple(e: React.MouseEvent<any>) {
  console.log('handleRipple');

  const button = e.currentTarget;
  const x = e.clientX - button.getBoundingClientRect().left;
  const y = e.clientY - button.getBoundingClientRect().top;
  const ripples = document.createElement("span");

  ripples.style.cssText = `
    left: ${x}px; 
    top: ${y}px; 
    position: absolute; 
    transform: translate(-50%, -50%); 
    pointer-events: none; 
    border-radius: 50%; 
    animation: ripple 500ms linear infinite; 
  `;

  ripples.classList.add('absolute', 'rounded-full', 'bg-black/15', 'animate-ripple');
  button.appendChild(ripples);

  setTimeout(() => {
    ripples.remove();
  }, 500);
};