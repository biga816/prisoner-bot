import WebhookService from "./../services/webhook-service";

/**
 * Webhook Controller
 */
export default class WebhookController {
  
  /**
   * Constructor
   * @param router router
   * @constractor
   */
  constructor(router) {
    this.token = process.env.VERIFICATION_TOKEN;
    this.handleRoutes(router);
  }

  /**
   * HandleRoutes
   * @param router router
   * @constractor
   */
  handleRoutes(router) {
    const self = this;

    // Facebook Webhook
    // Used for verification
    router.get("/webhook", (req, res, next) => {
      if (req.query["hub.verify_token"] === self.token) {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
      } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
      }
    });

    router.post("/webhook", (req, res, next) => {
      let webhookService = new WebhookService(next);

      // Make sure this is a page subscription
      if (req.body.object == "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach((entry) => {
          // Iterate over each messaging event
          entry.messaging.forEach((event) => {
            // Postback
            if (event.postback) {
              webhookService.processPostback(event);
            }
            // Message
            else if (event.message) {
              webhookService.processMessage(event);
            }
          });
        });

        res.sendStatus(200);
      }
    });
  }
}
