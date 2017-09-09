// libs
import axios from 'axios';
import request from 'request';

/**
 * Webhook Service
 */
export default class WebhookService {

  /**
   * Constructor
   * @param next next
   * @constractor
   */
  constructor(next) {
    this.talkApiKey = process.env.TALK_API_KEY;
    this.taklApiUrl = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue';  
    this.next = next;
  }

  /**
   * ProcessPostback
   * @param event event
   */
  processPostback(event) {
    const self = this;

    var senderId = event.sender.id;
    var payload = event.postback.payload;
  
    if (payload === "Greeting") {
      // Get user's first name from the User Profile API
      // and include it in the greeting
      request({
        url: "https://graph.facebook.com/v2.6/" + senderId,
        qs: {
          access_token: process.env.PAGE_ACCESS_TOKEN,
          fields: "first_name"
        },
        method: "GET"
      }, (error, response, body) => {
        var greeting = "";
        if (error) {
          console.log("Error getting user's name: " +  error);
        } else {
          var bodyObj = JSON.parse(body);
          name = bodyObj.first_name;
          greeting = "Hi " + name + ". ";
        }
        var message = greeting + "私の名前はPrisoner Trainig Botです。宜しくお願いします。";
        self.sendMessage(senderId, {text: message});
      });
    }
  }

  /**
   * ProcessMessage
   * @param event event
   */
  processMessage(event) {
    const self = this;

    var message = event.message.text;
    var senderId = event.sender.id;
  
    console.log("Received message from senderId: " + senderId);
    console.log("Message is: " + JSON.stringify(message));
  
    var params = {
      utt: message,
      t: 20
    };
  
    axios.post(self.taklApiUrl + '?APIKEY=' + self.talkApiKey, params)
      .then(response => self.sendMessage(senderId, {text: response.data.utt}))
      .catch(error => self.sendMessage(senderId, {text: 'An error occurred.'}));
  }

  /**
   * Sends message to user
   * @param recipientId recipientId
   * @param message message
   */
  sendMessage(recipientId, message) {
    request({
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
      method: "POST",
      json: {
        recipient: {id: recipientId},
        message: message,
      }
    }, (error, response, body) => {
      if (error) {
        console.log("Error sending message: " + response.error);
      }
    });
  }

}
