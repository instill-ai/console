import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// twMerge is a utility function to efficiently merge Tailwind CSS classes in JS without style conflicts.
// twMerge('px-2 py-1 bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]')
// → 'hover:bg-dark-red p-3 bg-[#B91C1C]'

// cs is an alias of clsx

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { cn };
