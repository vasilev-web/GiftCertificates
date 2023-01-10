const Certificates = {
    send: (action, data) => {
        const trueNumber = data?.certificateNumber === '000000004-1150585a';
        return new Promise((resolve, reject) => {
            if (action === 'getStatus') {
                resolve({
                    data: {
                        data: {
                            error: trueNumber ? false : 'Такого сертификата не существует',
                            success: trueNumber ? true : false,
                            Date: '2023-02-05T15:14:43',
                            Status: 'Действует',
                            Nominal: '15000'
                        }
                    }
                });
            } else if (action === 'usage') {
                resolve({
                    data: {
                        data: {
                            error: false,
                            success: true,
                            balance: 0
                        }
                    }
                });
            } else if (action === 'getRemains') {
                resolve({
                    data: {
                        data: {
                            error: false,
                            success: true,
                            remains: '15000'
                        }
                    }
                });
            } else {
                reject({
                    data: {
                        data: {
                            error: 'Произошла неизвестная ошибка',
                            success: false
                        }
                    }
                });
            }
        });
    }
};

export default Certificates;
