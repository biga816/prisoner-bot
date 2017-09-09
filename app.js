// libs
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import routeConfig from './config/router';

const app = express();

/**
 * Main class
 */
class REST {
  constructor() {
    dotenv.config();
    this.configureExpress();
  }

  configureExpress() {
    const self = this;

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // route config
    routeConfig(express.Router(), app);
    
    // server start
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log("All right ! I am alive at Port " + port + ".");
    });
    
    if (!process.env.VERIFICATION_TOKEN) {
      console.log('Error: Specify token in environment');
      process.exit(1);
    }

    // Server index page
    app.get("/",  (req, res) => {
      res.send("Deployed!");
    });
  }

}

new REST();
