import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import clsx from 'clsx';

import InputCertificate from '@kit/InputCertificate';
import Button from '@kit/Button';
import Repeat from '@kit/Icons/Repeat';

import Certificates from '@api/Certificates';

import FormaterPrice from '@helpers/FormaterPrice';

import './GiftCertificates.scss';

type propsDefaultSertificate = {
    Date: string;
    Status: string;
    Nominal: number;
    balance: number;
    remains: number;
    paymentUrl: boolean;
    success: boolean;
};

const currectDate = (date = Date.now()) => {
    const fullDate = (value) => (value < 10 ? `0${value}` : value);
    const formDate = new Date(date);
    const day = formDate.getDate();
    const month = formDate.getMonth() + 1;
    const year = formDate.getFullYear().toString().slice(2, 4);

    return `${fullDate(day)}.${fullDate(month)}.${year}`;
};

const defaultSertificate: propsDefaultSertificate = {
    Date: currectDate(),
    Status: '',
    Nominal: 0,
    balance: 0,
    remains: 0,
    paymentUrl: false,
    success: false
};

const GiftCertificates = ({ ...dataset }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        getValues,
        setValue,
        reset
    } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    });
    const [changeCertificate, setChangeCertificate] =
        useState<propsDefaultSertificate>(defaultSertificate);
    const [errorOrder, setErrorOrder] = useState<string>(null);
    const [errorMessage, setErrorMessage] = useState<string>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingChange, setLoadingChange] = useState<boolean>(false);
    const [codeIsComplete, setCodeIsComplete] = useState<boolean>(false);
    const [used, setUsed] = useState<boolean>(false);

    const { orderId } = dataset;

    const changingCertificate = useCallback(() => {
        setErrorMessage(null);
        setErrorOrder(null);
        setUsed(false);
        reset();
        setChangeCertificate((prevState) => ({
            ...prevState,
            Date: currectDate(),
            Status: '',
            Nominal: 0,
            balance: 0,
            success: false
        }));
    }, [reset]);

    const onSubmit = (data, type) => {
        setLoading(true);

        data.orderId = orderId;

        if (type !== 'getStatus') {
            setLoading(false);
            setLoadingChange(true);
        }

        Certificates.send(type, data)
            .then(({ data }) => {
                if (data?.errors && data?.errors?.length) {
                    setErrorMessage(data?.errors[0]?.message);
                } else if (!data?.data?.success) {
                    if (type === 'getStatus') {
                        setErrorMessage(data?.data?.error);
                    } else {
                        setErrorOrder(data?.data?.error);
                    }
                } else {
                    setErrorMessage(null);

                    if (type === 'getStatus') {
                        setChangeCertificate((prevState) => ({
                            ...prevState,
                            Date: currectDate(data?.data?.Date),
                            Status: data?.data?.Status,
                            Nominal: data?.data?.Nominal,
                            balance: data?.data?.Nominal,
                            success: data?.data?.success
                        }));
                    } else {
                        if (type === 'usage' && data?.data?.success) {
                            setUsed(true);
                            setChangeCertificate((prevState) => ({
                                ...prevState,
                                balance: 0
                            }));
                        }

                        if (type === 'paymentUrl' && data?.data?.success) {
                            setChangeCertificate((prevState) => ({
                                ...prevState,
                                paymentUrl: data?.data?.success
                            }));
                        }
                    }
                }
                setLoading(false);
            })
            .then(() => {
                if (type === 'getStatus') {
                    Certificates.send('getRemains', data).then(({ data }) => {
                        setLoadingChange(false);
                        setLoading(false);

                        if (data?.data?.success) {
                            setChangeCertificate((prevState) => ({
                                ...prevState,
                                remains: data?.data?.remains
                            }));
                        }
                    });
                } else {
                    setLoadingChange(false);
                    setLoading(false);
                }
            });
    };

    useEffect(() => {
        Certificates.send('getRemains', {
            orderId
        }).then(({ data }) => {
            setLoadingChange(false);
            setLoading(false);

            if (data?.data?.success) {
                setChangeCertificate((prevState) => ({
                    ...prevState,
                    remains: data?.data?.remains
                }));
            }
        });
    }, [orderId]);

    return (
        <div className='certificates__wrap'>
            <div className='certificates__body'>
                <div className='certificates__title'>Оплата сертификатом</div>
                <div className='certificates__text'>
                    Электронный подарочный сертификат можно использовать только для одного заказа.
                    При частичном использовании электронного подарочного сертификата остаток
                    денежных средств покупателю не компенсируется.
                </div>
            </div>

            <div className='certificates__form'>
                <form
                    className='certificates__form-body'
                    onSubmit={handleSubmit((data) => onSubmit(data, 'getStatus'))}
                >
                    <Controller
                        name='certificateNumber'
                        control={control}
                        defaultValue={getValues().certificateNumber}
                        rules={{
                            validate: () => codeIsComplete || 'Неверный формат сертификата'
                        }}
                        render={({ field }) => (
                            <InputCertificate
                                sizeInput='lg'
                                name='certificateNumber'
                                className='certificates__input'
                                error={
                                    (errors.certificateNumber &&
                                        errors.certificateNumber.message) ||
                                    errorMessage
                                }
                                {...register('certificateNumber', {
                                    pattern: {
                                        value: /[\d]{9}-[\d\w]{8}/,
                                        message: 'Неверный формат сертификата'
                                    }
                                })}
                                value={field.value}
                                returnUnmasked
                                label='Код сертификата'
                                onChange={(e) => {
                                    field.onChange(e.value);
                                    setValue('certificateNumber', e.value);
                                    setCodeIsComplete(e.isComplete);
                                }}
                                readOnly={!loading && !changeCertificate.success ? false : true}
                                afterElement={
                                    <>
                                        {!loading && !changeCertificate.success ? (
                                            <Button
                                                className={clsx([
                                                    'form-submit',
                                                    'icon icon-arrow-slider'
                                                ])}
                                                type='submit'
                                                children='&rarr;'
                                            />
                                        ) : (
                                            <div className='form-code-checked'></div>
                                        )}
                                    </>
                                }
                            />
                        )}
                    />
                    {loading && !changeCertificate.success && (
                        <div className='preloader-gift'></div>
                    )}
                    {!loading && changeCertificate.success && (
                        <div className='certificates__form-values'>
                            <div className='certificates__form-valid'>
                                Действителен до: {changeCertificate.Date}
                            </div>
                            <div className='certificates__form-balance'>
                                <div className='certificates__form-balance-label'>Баланс</div>
                                <div className='certificates__form-balance-value'>
                                    {FormaterPrice(changeCertificate.balance)}
                                </div>
                            </div>
                        </div>
                    )}
                </form>
                {loadingChange && <div className='preloader-gift'></div>}
                {!loadingChange && changeCertificate.success ? (
                    <div className='certificates__form-footer'>
                        {used ? (
                            <div className='certificates__form-text certificates__form-text--success icon icon-muted'>
                                Сертификат № {getValues().certificateNumber} применен к заказу №{' '}
                                {orderId}. <br />
                                {changeCertificate.remains < changeCertificate.Nominal && (
                                    <>
                                        Сумма заказа меньше, чем сумма сертификата, остатки денежных
                                        средств по сертификату сгорели.
                                    </>
                                )}
                                {changeCertificate.remains > changeCertificate.Nominal && (
                                    <>Суммы сертификата не достаточно для полной оплаты заказа.</>
                                )}
                            </div>
                        ) : (
                            <>
                                {changeCertificate.remains < changeCertificate.Nominal &&
                                    !errorOrder && (
                                        <div className='certificates__form-text certificates__form-text--warning icon icon-warning'>
                                            Сумма заказа меньше, чем баланс сертификата. <br />
                                            После оплаты остатки денежных средств <br />
                                            по сертификату сгорают
                                        </div>
                                    )}
                                {changeCertificate.remains > changeCertificate.Nominal &&
                                    !errorOrder && (
                                        <div className='certificates__form-text certificates__form-text--warning icon icon-warning'>
                                            Баланса сертификата недостаточно для полной оплаты
                                            заказа. После погашения сертификата, остаток по заказу
                                            доплачивается отдельно
                                        </div>
                                    )}
                            </>
                        )}
                        {errorOrder && (
                            <div className='certificates__form-text certificates__form-text--error icon icon-warning'>
                                {errorOrder}
                            </div>
                        )}
                        <div className='certificates__form-table'>
                            <div className='certificates__form-table-row'>
                                <div className='certificates__form-table-label'>Сумма заказа</div>
                                <div className='certificates__form-table-value'>
                                    {FormaterPrice(changeCertificate.remains)}
                                </div>
                            </div>
                            {used && changeCertificate.remains > changeCertificate.Nominal && (
                                <>
                                    <div className='certificates__form-table-row'>
                                        <div className='certificates__form-table-label'>
                                            Сумма сертификата
                                        </div>
                                        <div className='certificates__form-table-value red'>
                                            –{FormaterPrice(changeCertificate.Nominal)}
                                        </div>
                                    </div>
                                    <div className='certificates__form-table-row certificates__form-table-row--surcharge'>
                                        <div className='certificates__form-table-label'>
                                            Доплата по заказу
                                        </div>
                                        <div className='certificates__form-table-value'>
                                            {FormaterPrice(
                                                changeCertificate.remains -
                                                    changeCertificate.Nominal
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className='certificates__form-button-wrap'>
                            {used ? (
                                <>
                                    {changeCertificate.remains <= changeCertificate.Nominal ? (
                                        <a
                                            className='certificates__form-link btn btn-base-brand-1'
                                            href={`/personal/orders/#order_${orderId}`}
                                        >
                                            Перейти к заказу
                                        </a>
                                    ) : (
                                        <>
                                            <form
                                                className='certificates__form-footer'
                                                onSubmit={handleSubmit((data) =>
                                                    onSubmit(data, 'paymentUrl')
                                                )}
                                            >
                                                {changeCertificate.paymentUrl ? (
                                                    <div className='certificates__form-footer-text'>
                                                        Cсылка отправлена на телефонный номер,
                                                        указанный в заказе
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                                <Button
                                                    className='certificates__form-button'
                                                    variant='base'
                                                    color='brand-1'
                                                    active={false}
                                                >
                                                    Получить ссылку на доплату
                                                </Button>
                                            </form>
                                            <div
                                                className='certificates__form-change'
                                                onClick={changingCertificate}
                                            >
                                                <Repeat />
                                                <span className='certificates__form-change-text'>
                                                    Использовать другой сертификат
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <form
                                    className='certificates__form-footer'
                                    onSubmit={handleSubmit((data) => onSubmit(data, 'usage'))}
                                >
                                    <Button
                                        className='certificates__form-button'
                                        variant='base'
                                        color='brand-1'
                                        active={false}
                                    >
                                        Оплатить сертификатом
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default GiftCertificates;
