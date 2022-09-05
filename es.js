var axios = require('axios');
var amqp = require('amqplib/callback_api');

var config = {
    /* Your settings here like Accept / Headers etc. */
}

module.exports = {
    SendRabbitMq: async ({
        data
    }) => {


        function generateGuid() {
            var result, i, j;
            result = '';
            for (j = 0; j < 32; j++) {
                if (j == 8 || j == 12 || j == 16 || j == 20)
                    result = result + '-';
                i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
                result = result + i;
            }
            return result;
        }
        let transaction_id = generateGuid()
        let message_id = generateGuid()
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getFullYear() + "T"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds() + "Z";
        // console.log(datetime)
        let resPayload = {
            "context": {
                "domain": "nic2004:52110",
                "country": "IND",
                "city": "std:080",
                "action": "search",
                "core_version": "1.0.0",
                "bap_id": "sizeguarantee.com",
                "bap_uri": "https://sizeguarantee-app.org/protocol/v1",
                "transaction_id": transaction_id,
                "message_id": message_id,
                "timestamp": datetime
            },
            "message": {
                "ack": {
                    "status": "ACK"
                }
            }
        }



        amqp.connect('amqp://140.238.207.118', function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var queue = 'ondc';
                var msg = message_id;

                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(msg));
                console.log(" [x] Sent %s", msg);
            });
        });


        // console.log(data)
        return resPayload
    },
    getProductsES: async (res) => {
        


        // aa = {
        //     "platform": [],
        //     "brand": [],
        //     "categories": [],
        //     "style": [],
        //     "color": [],
        //     "gender": [],
        //     "froms": 0,
        //     "productUrl": "",
        //     "sort": "",
        //     "search": "",
        //     "location": "IN",
        //     "measurementsUnit": "CM"
        // }
        // axios.post('https://testnodeelastic.herokuapp.com/getSearchResult', aa, config)
        //     .then(function (response) {
        //         // console.log(response.data);
        //         // console.log(response.status);
        //         // console.log(response.statusText);
        //         // console.log(response.headers);
        //         // console.log(response.config);
        //         return response.data
        //     });





    }
}

