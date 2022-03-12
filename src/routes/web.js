import express from "express";
import homepageController from "../controllers/homepageController";

let router = express.Router();

//init all web routes
let initWebRoutes = (app) => {
    router.get("/", homepageController.getHomepage);
    router.get("/webhook", homepageController.getWebhook);
    // router.get("/profile", homepageController.getFacebookUserProfile);
    // router.post("/set-up-user-fb-profile", homepageController.setUpUserFacebookProfile);
    router.post("/webhook", homepageController.postWebhook);
    // router.post("/setup", homepageController.handleSetupInfor); //persistent menu
    return app.use("/", router);
};

module.exports = initWebRoutes;
