import { Router } from "express";

import { markNotificationAsRead, markNotifyMe, readNotifications } from "../utils/dbHelper.js";

const router = Router();

router.post("/history", async (req, res) => {
    try {
        const clientId = req.body.clientId;

        if (!clientId) {
            res.status(400).send("Please provide required params in the request body.");
            return;
        }

        const notifications = await readNotifications(clientId);

        if (notifications) {
            res.status(200).json({
                data: {
                    notifications: notifications
                }
            });
        } else {
            res.status(500).json({ error: "Something went wrong!" });
        }

    } catch (error) {
        console.error("Notification/ Error: ", error);
        res.status(500).json({ error: error });
    }

});

router.post("/mark-as-read", async (req, res) => {
    try {
        const clientId = req.body.clientId;
        const notificationId = req.body.id;

        if (!clientId || !notificationId) {
            res.status(400).send("Please provide required params in the request body.");
            return;
        }

        const affectedId = await markNotificationAsRead(clientId, notificationId);

        if (affectedId) {
            res.status(200).json({
                data: {
                    read: affectedId
                }
            });
        } else {
            res.status(500).json({ error: "Something went wrong!" });
        }

    } catch (error) {
        console.error("Notification/ Error: ", error);
        res.status(500).json({ error: error });
    }

});

router.post("/enable", async (req, res) => {
    console.log("enable init");
    try {
        const clientId = req.body.clientId;
        const area = req.body.area;
        const state = req.body.state;

        if (!clientId || !area) {
            console.log("Please provide required params in the request body.");
            res.status(400).send("Please provide required params in the request body.");
            return;
        }

        const enableNotifyMe = await markNotifyMe(clientId, area, state);

        if (enableNotifyMe) {
            res.status(200).json({
                data: {
                    enabled: enableNotifyMe
                }
            });
        } else {
            console.error("Something went wrong!");
            res.status(500).json({ error: "Something went wrong!" });
        }

    } catch (error) {
        console.error("Notification/ Error: ", error);
        res.status(500).json({ error: error });
    }

});

export default router;