/**
 * Línea divisoria para separar contenido.
 */

export const Divider = ({ className }: { className?: string }) => (
  <div data-testid="divider" className={`w-full border-t border-gray-300 my-2.5 ${className}`} />
);
