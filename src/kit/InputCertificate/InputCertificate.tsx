import React, { useRef, useEffect } from 'react';
import imask from 'imask';
import clsx from 'clsx';
import Input from '@kit/Input';

import './InputCertificate.scss';

const InputCertificate = ({
    value = 'Код сертификата',
    name = 'name',
    label,
    onChange,
    returnUnmasked = false,
    className = '',
    country = 0,
    afterElement,
    maskPlaceholder = '000000000{-}********',
    ...other
}) => {
    const ref = useRef(null);

    useEffect(() => {
        let mask = imask(ref.current, {
            mask: maskPlaceholder,
            lazy: false
        });
        mask.on('accept', () => {
            onChange({
                value: returnUnmasked ? mask.unmaskedValue : mask.value,
                isComplete: false
            });
        });

        mask.on('complete', () => {
            onChange({
                value: returnUnmasked ? mask.unmaskedValue : mask.value,
                isComplete: true
            });
        });

        if (mask.value !== value) {
            mask.value = value;
        }

        return () => {
            mask.destroy();
        };
    }, [maskPlaceholder, onChange, returnUnmasked, value]);

    return (
        <Input
            label={label}
            name={name}
            afterElement={afterElement}
            placeholder='_________-________'
            className={clsx([className, 'cert-input'], value === '' && 'cert-input--empty')}
            ref={ref}
            {...other}
        />
    );
};

export default InputCertificate;
