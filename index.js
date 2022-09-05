var express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000

const { SendRabbitMq } = require("./utiles/Es")
var amqp = require('amqplib/callback_api');
const fetch = require("node-fetch");
var axios = require('axios');

var config = {
  /* Your settings here like Accept / Headers etc. */
}


app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: [],
  })
);
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

let Received_msg_id = ""

// amqp.connect('amqp://140.238.207.118', function (error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function (error1, channel) {
//     if (error1) {
//       throw error1;
//     }

//     var queue = 'ondc';

//     channel.assertQueue(queue, {
//       durable: false
//     });

//     console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

//     channel.consume(queue, function (msg) {
//       console.log(" [x] Received %s", msg.content.toString());
//       Received_msg_id = msg.content.toString()
//     }, {
//       noAck: true
//     });
//   });
// });
var currentdate = new Date();
var datetime = currentdate.getDate() + "-"
  + (currentdate.getMonth() + 1) + "-"
  + currentdate.getFullYear() + "T"
  + currentdate.getHours() + ":"
  + currentdate.getMinutes() + ":"
  + currentdate.getSeconds() + "Z";

let resPayload = {
  "context": {
    "domain": "nic2004:52110",
    "country": "IND",
    "city": "std:080",
    "action": "search",
    "core_version": "1.0.0",
    "bap_id": "sizeguarantee.com",
    "bap_uri": "https://sizeguarantee-app.org/protocol/v1",
    "transaction_id": "",
    "message_id": "",
    "timestamp": ""
  },
  "message": {

  }
}
var aa = {
  "platform": [],
  "brand": [],
  "categories": [],
  "style": [],
  "color": [],
  "gender": [],
  "froms": 0,
  "productUrl": "",
  "sort": "",
  "search": "",
  "location": "IN",
  "measurementsUnit": "CM"
}

var selectedData = []

app.get('/', (req, res) => res.send({
  "App": "Mock API for ONDC",
  "Seller": "sizeguarantee.com",
  "version": "1.0.0"
}));
app.post("/search", async (req, res) => {
  try {

    //     aa={
    //       "platform": [],
    //       "brand": [],
    //       "categories": [],
    //       "style": [],
    //       "color": [],
    //       "gender": [],
    //       "froms": 0,
    //       "productUrl": "",
    //       "sort": "",
    //       "search": "",
    //       "location": "IN",
    //       "measurementsUnit": "CM"
    //   }
    //     axios.post('https://testnodeelastic.herokuapp.com/getSearchResult',aa, config)
    // .then(function(response) {
    //     console.log(response.data);
    //     // console.log(response.status);
    //     // console.log(response.statusText);
    //     // console.log(response.headers);
    //     // console.log(response.config);
    //     res.send(response.data)

    // });




    let data = SendRabbitMq({ data: req.body })


    const p = Promise.resolve(data);

    p.then(value => {
      // console.log("value",value); // 👉️ "hello"
      res.send(value)
    }).catch(err => {
      console.log(err);
    });



  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: true,
      message: err,
    });
  }
})

app.get("/on_search", async (req, res) => {
  try {
    let msg_id = Received_msg_id
    resPayload.context.message_id = Received_msg_id
    resPayload.context.transaction_id = Received_msg_id
    resPayload.context.timestamp = datetime
    axios.post('https://testnodeelastic.herokuapp.com/getSearchResult', aa, config)
      .then(function (response) {
        products = response.data.products
        var resObj = []

        te = {}
        for (var key in response.data.products) {
          var obj = response.data.products[key];
          console.log("key", key)
          console.log("obj", obj.name)
          temp = {
            "id": "1193692_9150538",
            "descriptor": {
              "name": "Dates Milk",
              "symbol": "http://lh3.googleusercontent.com/59XJAPWHZBhrwGAu-pHVXNRuA3416MGAia7LiCsSOL014c_eyLoSb-JDc_VWXOM7hnqiEANwwyneEOPtxJsnSo2Yo7WZhlD00iACCHF7",
              "images": [
                "http://lh3.googleusercontent.com/59XJAPWHZBhrwGAu-pHVXNRuA3416MGAia7LiCsSOL014c_eyLoSb-JDc_VWXOM7hnqiEANwwyneEOPtxJsnSo2Yo7WZhlD00iACCHF7"
              ]
            },
            "price": {
              "currency": "INR",
              "value": 125
            },
            "location_id": "9150538",
            "@ondc/org/time_to_ship": "PT10M",
            "provider_details": {
              "id": "9150538",
              "descriptor": {
                "name": "Chaicup",
                "symbol": "http://lh3.googleusercontent.com/Tr3Z-FifnP4u80QelAI06F42O-V-_3fQd2uFF9ICqKX9DXWBhSwXMv-FsK_ff8ilCOdDy9rtCKIZ6DkMaEHY2_17wUU",
                "images": [
                  "http://lh3.googleusercontent.com/Tr3Z-FifnP4u80QelAI06F42O-V-_3fQd2uFF9ICqKX9DXWBhSwXMv-FsK_ff8ilCOdDy9rtCKIZ6DkMaEHY2_17wUU"
                ]
              }
            },
            "location_details": {
              "id": "9150538",
              "gps": "13.06696502,80.26705667",
              "address": {
                "name": "Chaicup",
                "locality": "Egmore",
                "city": "Chennai",
                "country": "India"
              }
            },
            "category_details": {

            },
            "fulfillment_details": {

            },
            "bpp_details": {
              "name": "MAGICPIN",
              "symbol": "https://static.magicpin.com/samara/static/images/home/about-us/magicpin-logo.svg",
              "short_desc": "#ShopLocal",
              "bpp_id": "ultrontest.magicpin.com/oms_partner/ondc"
            }
          }
          var number = Math.floor(Math.random() * 899999999 + 100000000)
          console.log(number)
          temp.descriptor.name = obj.name
          temp.descriptor.images = obj.imageUrl
          temp["price"]["value"] = obj.price.values
          temp["id"] = number.toString()
          resObj.push(temp)
        }
        // console.log(resObj)
        resPayload.message.catalogs = resObj
        // console.log("resPayload",resPayload)
        res.send(resPayload)
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: true,
      message: err,
    });
  }
})

app.post("/select", async (req, res) => {
  try {
    let data = SendRabbitMq({ data: req.body })
    const p = Promise.resolve(data);
    selectedData = req.body

    p.then(value => {
      res.send(value)
    }).catch(err => {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: true,
      message: err,
    });
  }

})


app.get("/on_select", async (req, res) => {
  var id = req.params.id;
  resPayload.context.message_id = Received_msg_id
  resPayload.context.transaction_id = Received_msg_id
  console.log("id")
  console.log('id: ' + req.query.id)

  quote = {
    "provider": {},
    "fulfilments": [],
    "quote": {
      "price" :{},
      "breakup":[]
    }
  }
  provider = {
    "id": Math.floor(Math.random() * 899999999 + 100000000)
  }

  // provoder.id = Math.floor(Math.random() * 899999999 + 100000000)

  fulfillment_details = [
    {
      "id": "Fulfillment1",
      "@ondc/org/awb_no": "",
      "@ondc/org/provider_name": "Blowhorn",
      "state": {
        "descriptor": {
          "name": "Serviceable"
        }
      }
    }
  ]


  var finalObj = [   {
    "@ondc/org/title_type":"tax",
    "title":"Tax",
    "price":{
       "currency":"INR",
       "value":"0"
    }
 },
 {
    "title":"Immediate Delivery",
    "price":{
       "currency":"INR",
       "value":"60.0"
    }
 },
 {
    "title":"Convenience Fee",
    "price":{
       "currency":"INR",
       "value":"0"
    }
 }]
  var totalPrice = {
    "currency": "INR",
    "value": 0
  }

  
  var totalPricetemp = 0
  for (var key in selectedData) {
    var obj = selectedData[key];

   

    var mockData = {
      "@ondc/org/item_quantity": {
        "count": 1
      },
      "@ondc/org/title_type": "item",
      "title": "",
      "price": {

      }
    }
    mockData["@ondc/org/item_quantity"]["count"] = obj.message.cart.items[0].quantity.count

    mockData["title"] = obj.message.cart.items[0].product.descriptor.name

    mockData["price"] = obj.message.cart.items[0].product.price
    totalPricetemp = totalPricetemp+obj.message.cart.items[0].product.price.value
    console.log(">>>>>>>>>>>>>>>>", mockData)
    finalObj.push(mockData)
  }

  totalPrice.value = totalPricetemp
  
  quote.provider = provider
  quote.fulfilments = fulfillment_details
  // quote.quote = finalObj
  quote.quote.price = totalPrice
  quote.quote.breakup = finalObj
  res.send(quote);
})


app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));


























// const config = require('./config');
// const logger = require('./logger');
// const ExpressServer = require('./expressServer');

// const launchServer = async () => {
//   try {
//     this.expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
//     this.expressServer.launch();
//     logger.info('Express server running');
//   } catch (error) {
//     logger.error('Express Server failure', error.message);
//     await this.close();
//   }
// };

// launchServer().catch(e => logger.error(e));








// 'use strict';

// var path = require('path');
// var http = require('http');

// var oas3Tools = require('oas3-tools');
// var serverPort = 8080;

// // swaggerRouter configuration
// var options = {
//     routing: {
//         controllers: path.join(__dirname, './controllers')
//     },
// };

// var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
// var app = expressAppConfig.getApp();

// // Initialize the Swagger middleware
// http.createServer(app).listen(serverPort, function () {
//     console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
//     console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
// });

