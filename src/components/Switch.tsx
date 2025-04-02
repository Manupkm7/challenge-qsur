import * as SwitchPrimitive from '@radix-ui/react-switch';
import clsx from 'clsx';

type Props = {
    label?: string;
    disabled?: boolean;
    value: boolean;
    id?: string;
    onChange: (value: boolean) => void;
    className?: string;
    name?: string;
};

export const Switch = ({ label, disabled, value, onChange, className, name, id }: Props) => {
    return (
        <label className={clsx('flex justify-between items-center text-sm leading-normal', className)}>
            {label}
            <SwitchPrimitive.Root
                name={name || label}
                id={id}
                className="
        group focus:ring-1 w-[36px] h-[18px]
        rounded-full bg-gray-border enabled:data-[state=checked]:bg-black
        disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={disabled}
                checked={value}
                onCheckedChange={onChange}>
                <SwitchPrimitive.Thumb
                    className="
            block w-2.5 h-2.5 rounded-full
            will-change-transform
            transition-transform translate-x-1
            data-[state=checked]:translate-x-[22px]
            bg-white group-disabled:bg-gray-300 select-none"
                />
            </SwitchPrimitive.Root>
        </label>
    );
}
