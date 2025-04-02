import { ReactNode, useEffect, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { MdRadioButtonChecked as RadioButtonCheckIcon } from '@react-icons/all-files/md/MdRadioButtonChecked';
import { MdRadioButtonUnchecked as RadioButtonUncheckIcon } from '@react-icons/all-files/md/MdRadioButtonUnchecked';
import clsx from 'clsx';

export interface RadioButtonProps {
    disabled?: boolean;
    className?: string;
    value?: boolean;
    onChange?: () => void;
    children?: ReactNode;
}

export interface RadixRadioGroupProps {
    value: any;
    onChange: (string: string) => void;
    items: { value: any; label: string | ReactNode; disabled?: boolean }[];
    radioStyle?: string;
    selectedRadioStyle?: string;
    indicatorStyle?: string;
    orientation?: string;
}

export const RadioButton = ({
    disabled = false,
    className = '',
    value,
    onChange = () => { },
    children,
}: RadioButtonProps) => {
    const handleClick = () => {
        if (disabled) return;
        onChange();
    };

    return (
        <div
            className={`${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                } select-none flex items-center gap-3px ${className}`}
            onClick={handleClick}>
            <div className="w-6 h-6">{value ? <RadioButtonCheckIcon color="#279AF1" /> : <RadioButtonUncheckIcon />}</div>
            <div className="flex-1">{children}</div>
        </div>
    );
};

//Base element of the component
const RadioGroupRoot = (props: any) => {
    return (
        <RadioGroup.Root onValueChange={props.onValueChange} required={false} orientation="horizontal">
            {props.children}
        </RadioGroup.Root>
    );
};

// element that can be clicked to select the option
const RadioItem = (props: any) => {
    const borderColorClass = clsx(
        props.selected ? (props.selectedStyle ? '' : '#279AF1') : props.style ? '' : 'black'
    );

    return (
        <RadioGroup.Item
            id={props.id}
            className={
                props.selected
                    ? `${props.selectedStyle
                        ? props.selectedStyle
                        : `flex border-2 items-center justify-center relative min-w-6 min-h-6 rounded-full pt-6px ${props.disabled && 'opacity-25'
                        }`
                    }`
                    : props.style
                        ? `${props.style} ${props.disabled && 'opacity-25'}`
                        : `flex border-2 items-center justify-center relative min-w-6 min-h-6 rounded-full pt-6px ${props.disabled && 'opacity-25'
                        }`
            }
            style={{
                borderColor: borderColorClass,
                width: '16px',
                height: '16px',
            }}
            value={props.value}
            disabled={props.disabled}>
            {props.children}
        </RadioGroup.Item>
    );
};

// Indicates which element/s is/are currently selected
const RadioIndicator = (props: any) => {
    const styleRadioGroupIndicatorDefault = clsx(`
  flex
  items-center
  justify-center
  w-2
  h-2
  relative
  rounded-full
  `);

    return (
        <RadioGroup.Indicator
            className={`${props.style ? props.style : styleRadioGroupIndicatorDefault}`}
            style={{ backgroundColor: `${props.style ? '' : '#279AF1'}` }}
        />
    );
};

const RadioOption = (props: any) => {
    const divRadioOptionClass = clsx(`
  flex
  items-center
  my-4
  gap-10px
  `);

    return <div className={divRadioOptionClass}>{props.children}</div>;
};

export const RadixRadioGroup = ({ value, items, onChange = () => { } }: RadixRadioGroupProps) => {
    const [currentValue, setCurrentValue] = useState(value);

    const handleValueChange = (string: string) => {
        onChange(string);
        setCurrentValue(string);
    };

    useEffect(() => setCurrentValue(value), [value]);

    return (
        <RadioGroupRoot name={'radio-group'} onValueChange={handleValueChange} className={`flex flex-row gap-20px w-full`}>
            <div className="w-full px-4 py-1 mt-1 border-l-2 border-[#279AF1]">
                <div className="-my-3">
                    {items.map(({ value, label, disabled }, index) => (
                        <RadioOption key={index}>
                            <RadioItem id={`r-${index}`} value={value} disabled={disabled} selected={currentValue === value}>
                                <RadioIndicator />
                            </RadioItem>
                            <label htmlFor={`r-${index}`} className="ml-3 cursor-pointer select-none">
                                {label}
                            </label>
                        </RadioOption>
                    ))}
                </div>
            </div>
        </RadioGroupRoot>
    );
};
