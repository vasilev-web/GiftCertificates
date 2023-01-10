import React, { forwardRef } from 'react';
import clsx from 'clsx';

import styles from './Button.module.scss';

export interface ButtonProps extends React.ComponentProps<'button'> {
    component?: React.ElementType;
    size?: 'sm' | 'bs' | 'md' | 'lg';
    variant?: 'base' | 'outline';
    color?: 'default' | 'brand-1' | 'sub-1' | 'sub-4' | 'dark' | 'white';
    disabled?: boolean;
    active?: boolean;
    width?: 'auto' | 'full';
    textSize?: 'sm' | 'bs' | 'lg';
    beforeElement?: React.ReactNode;
    afterElement?: React.ReactNode;
}

const Button = forwardRef((props: ButtonProps, ref) => {
    const {
        component,
        className,
        variant = 'base',
        color = 'default',
        size = 'bs',
        disabled = false,
        active = true,
        width = 'auto',
        textSize = 'bs',
        beforeElement,
        afterElement,
        children,
        ...other
    } = props;
    const Component = component || 'button';

    return (
        <Component
            ref={ref}
            className={clsx(
                className,
                styles.btn,
                styles[`btn-${size}`],
                styles[`btn-${variant}-${color}`],
                styles[`btn-text-size-${textSize}`],
                [active && styles.active],
                [width !== 'auto' && styles[`btn-width-${width}`]]
            )}
            disabled={disabled}
            {...other}
        >
            {beforeElement && <span className={clsx(styles['btn-before'])}>{beforeElement}</span>}
            {children}
            {afterElement && <span className={clsx(styles['btn-after'])}>{afterElement}</span>}
        </Component>
    );
});

export default Button;
