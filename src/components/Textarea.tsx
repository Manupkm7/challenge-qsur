import { clsx } from 'clsx';
import { darkModeAtom } from '../atoms';
import { useRecoilValue } from 'recoil';

type TextareaProps = {
  className?: string;
  id?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  testId?: string;
  disabled?: boolean;
};

export const Textarea = ({
  className,
  id,
  value,
  onChange,
  testId,
  disabled,
  ...props
}: TextareaProps) => {
    const dark = useRecoilValue(darkModeAtom);
  
  return (
    <textarea
      id={id}
      value={value}
      data-testid={testId}
      onChange={onChange}
      disabled={disabled}
      className={clsx(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
        dark ? "text-white bg-[#111317]" : "text-black",
      )}
      {...props}
    />
  );
};
