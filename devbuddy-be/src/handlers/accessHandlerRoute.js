import { Router } from "express";

import { enableClient, makeClientIdentity, markClientAsDisabled } from "../utils/dbHelper.js";

const router = Router();

router.post("/access", async (req, res) => {
    console.error("access init");
    const nToken = req.body.nToken;
    const clientId = req.body.clientId;

    if (!nToken || !clientId) {
        res.status(400).send("Please provide request params in the request body.");
        return;
    }

    try {
        const identity = await makeClientIdentity(clientId, nToken);

        if (identity) {
            await enableClient(clientId);
            
            res.status(200).json({
                data: {
                    id: identity
                }
            });
        } else {
            res.status(500).json({ error: "Something went wrong!" });
        }

    } catch (error) {
        console.error("Access/ Error: ", error);
        res.status(500).json({ error: response.error });
    }

});

router.post("/logout", async (req, res) => {
    try {
        const clientId = req.body.clientId;

        if (!clientId) {
            res.status(400).send("Please provide required params in the request body.");
            return;
        }

        const affectedId = await markClientAsDisabled(clientId);

        if (affectedId) {
            res.status(200).json({
                data: {
                    logout: affectedId
                }
            });
        } else {
            res.status(500).json({ error: "Something went wrong!" });
        }

    } catch (error) {
        console.error("Logout/ Error: ", error);
        res.status(500).json({ error: error });
    }

});

export default router;