
const crypto = require('crypto');

const Hmac = {

    create: function (data, key, algo = 'sha256') {

        if (!crypto.getHashes().includes(algo))
            return false;

        data = Hmac._strValAndSort(data);

        console.log(JSON.stringify(data))

        return crypto.createHmac(algo, key)
            .update(JSON.stringify(data))
            .digest('hex')
    },


    verify: function (data, key, sign, algo = 'sha256') {
        const _sign = Hmac.create(data, key, algo);
        return (_sign && _sign.toLowerCase() == sign.toLowerCase());
    },

    _strValAndSort: function (data) {

        data = Hmac._sortObject(data);

        for (var item in data)
            if (data.hasOwnProperty(item))
                if (typeof data[item] === "object")
                    data[item] = Hmac._strValAndSort(data[item]);
                else
                    data[item] = data[item].toString();

        return data;
    },

    _sortObject: function (obj) {

        if (Array.isArray(obj))
            return obj;

        const res = Object.keys(obj).sort().reduce(function (result, key) {
            result[key] = obj[key];
            return result;
        }, {});

        return res
    }

};

const key = '986af10457d0e78f981507d720bdfb40ac7bcf10072c4be001c2a853040bc033'
const data = {
    order_id: '1',
    customer_phone: '+79999999999',

    customer_email: 'example@gmail.com',
    products: [{
        name: 'Course 1123',
        price: '123',
        quantity: '1',

    },
    {
        name: 'Course 23213',
        price: '231',
        quantity: '2',
    }],
    customer_extra: 'customer_extra',
    do: 'pay',
    urlReturn: 'https://rihter-art.ru/payment-cancel/',
    urlSuccess: 'https://rihter-art.ru/payment-success/',
    sys: 'rihterart',
}

console.log(Hmac.create(data, key))

module.exports = Hmac