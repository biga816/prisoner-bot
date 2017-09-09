/**
 * Routing Module
 */
import WebhookController from './../controllers/webhook-controller';

export default (router, app) => {
    // route setting
    app.use('/', router);

    const routeWebhook = new WebhookController(router);

};
