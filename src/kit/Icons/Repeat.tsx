import * as React from 'react';
import Icon from '@kit/Icon';

const SvgRepeatComponent = (props) => (
    <svg
        width='1em'
        height='1em'
        viewBox='0 0 21 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        role='img'
        {...props}
    >
        <path
            d='M6.484 8.348h1v-2h-1v2Zm-4.5-1h-1a1 1 0 0 0 1 1v-1Zm1-4.5v-1h-2v1h2Zm2.89 12.279-.708-.708-1.414 1.415.707.707 1.414-1.415ZM19.25 10h-1 1ZM5.166 4.166l.707.707-.707-.707Zm1.318 2.182h-4.5v2h4.5v-2Zm-3.5 1v-4.5h-2v4.5h2Zm1.475 9.193a9.25 9.25 0 0 0 4.736 2.531l.39-1.961a7.25 7.25 0 0 1-3.712-1.985L4.46 16.541Zm4.736 2.531a9.25 9.25 0 0 0 5.345-.526l-.766-1.848a7.25 7.25 0 0 1-4.188.413l-.39 1.961Zm5.345-.526a9.25 9.25 0 0 0 4.151-3.407l-1.663-1.111a7.25 7.25 0 0 1-3.254 2.67l.766 1.848Zm4.151-3.407A9.25 9.25 0 0 0 20.25 10h-2a7.25 7.25 0 0 1-1.222 4.028l1.663 1.111ZM20.25 10a9.25 9.25 0 0 0-1.559-5.139l-1.663 1.111A7.25 7.25 0 0 1 18.25 10h2Zm-1.559-5.139a9.25 9.25 0 0 0-4.151-3.407l-.766 1.848a7.25 7.25 0 0 1 3.254 2.67l1.663-1.111ZM14.54 1.454A9.25 9.25 0 0 0 9.195.928l.39 1.961a7.25 7.25 0 0 1 4.19.413l.765-1.848ZM9.195.928A9.25 9.25 0 0 0 4.46 3.459l1.414 1.414A7.25 7.25 0 0 1 9.586 2.89L9.196.928ZM4.46 3.459 1.277 6.641l1.414 1.414 3.182-3.182L4.46 3.46Z'
            fill='#383741'
        />
    </svg>
);
const SvgRepeat = (props) => (
    <Icon {...props}>
        <SvgRepeatComponent />
    </Icon>
);
export default SvgRepeat;
