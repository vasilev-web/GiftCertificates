import React from 'react';
import clsx from 'clsx';

import { Container } from 'react-bootstrap';

import GiftCertificates from '@components/GiftCertificates';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.module.scss';

const App = ({ props }) => {
    return (
        <Container fluid className={clsx(['page', 'g-2'])}>
            <GiftCertificates {...props} />
        </Container>
    );
};

export default App;
