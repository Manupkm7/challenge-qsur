import { SVGProps } from "react";

export type SvgProps = Pick<SVGProps<SVGSVGElement>, 'className' | 'color' | 'strokeWidth' | 'onClick'> & {
    size?: string | number;
    direction?: 'left' | 'right' | 'top' | 'bottom';
};

