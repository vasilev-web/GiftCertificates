import React, { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

import st from './Icon.module.scss';

export interface IconProps extends HTMLAttributes<HTMLElement & HTMLAnchorElement> {
    className: 'string';
}

const Icon = forwardRef((props: IconProps, ref) => {
    const { className, children, onClick } = props;
    return <span className={clsx(st.icon, className)} children={children} onClick={onClick} />;
});

export default Icon;
