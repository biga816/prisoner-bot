// libs
import axios from 'axios';

import CONST from "./../utils/const";

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
    this.accessToken = process.env.PAGE_ACCESS_TOKEN;
    this.next = next;
  }

  /**
   * ProcessPostback
   * @param event event
   */
  processPostback(event) {
    const self = this;

    let senderId = event.sender.id;
    let payload = event.postback.payload;
  
    if (payload === "Greeting") {
      // Get user's first name from the User Profile API
      // and include it in the greeting
      let params = {
        access_token: this.accessToken,
        fields: 'first_name'
      };
      let greeting = '私の名前はPrisoner Trainig Botです。宜しくお願いします。';

      axios.get(`${CONST.API.FACEBOOK}/${senderId}`, {params: params})
      .then((response) => {
        // let bodyObj = JSON.parse(body);
        let name = response.data.first_name;
        let message = "Hi " + name + ". " + greeting;
        self.sendMessage(senderId, {text: message});
      })
      .catch(error => {
        console.log("Error getting user's name: " +  error);
        self.sendMessage(senderId, {text: greeting});
      });
    }
  }

  /**
   * ProcessMessage
   * @param event event
   */
  processMessage(event) {
    const self = this;

    if (!event.message.is_echo) {
      let message = event.message.text;
      let senderId = event.sender.id;
    
      console.log("Received message from senderId: " + senderId);
      console.log("Message is: " + JSON.stringify(message));
    
      let params = {
        utt: message,
        t: 20
      };
    
      axios.post(`${CONST.API.TALK_API}?APIKEY=${self.talkApiKey}`, params)
        .then(response => self.sendMessage(senderId, {text: response.data.utt}))
        .catch(error => self.sendMessage(senderId, {text: 'An error occurred.'}));
    }
  }

  /**
   * Sends message to user
   * @param recipientId recipientId
   * @param message message
   */
  sendMessage(recipientId, message) {
    let params = {
      recipient: {id: recipientId},
      message: message,
    };

    axios.post(`${CONST.API.FACEBOOK_MESSAGE}?access_token=${this.accessToken}`, params)
    .catch(error => console.log("Error sending message: " + error));
  }

}
