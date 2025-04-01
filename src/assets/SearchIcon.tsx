import { SvgProps } from "../types/svgIconProps";

export const SearchIcon = ({ className, color = 'currentColor', size = '24', strokeWidth = '2' }: SvgProps) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={className}
      >
        <circle
          cx='10'
          cy='10'
          r='7'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path d='M21 21L15 15' stroke={color} strokeWidth={strokeWidth} strokeLinecap='round' strokeLinejoin='round' />
      </svg>
    );
  };
  