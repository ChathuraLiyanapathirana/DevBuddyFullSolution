import express, { json } from "express";
import firebaseAdmin from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import 'dotenv/config';

import clientHandler from "./src/handlers/clientHandlerRoute.js";
import accessHandler from "./src/handlers/accessHandlerRoute.js";
import notificationHandler from "./src/handlers/notificationHandlerRoute.js";
import { createRecordAndAppendMessage, getAllClientIds, readMessages } from "./src/utils/dbHelper.js";
import { knowledgeCron } from "./src/utils/knowledgeCron.js";
import systemHandler from "./src/handlers/systemHandler.js";
import { getOpenAICompletion } from "./src/utils/openaiHelper.js";

// Express props
const app = express();
app.use(json());


// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Initialize Firebase
const firebaseApp = initializeApp({
    credential: firebaseAdmin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT),
});

// Initialize Firestore
const db = getFirestore();

// Cron Job
knowledgeCron();

// Custom Routes
app.use("/client", clientHandler);
app.use("/auth", accessHandler);
app.use("/notification", notificationHandler);
app.use("/test", async (req, res) => {
    const prompt = `Generate a new content based on the following questions "Why should i need to use JavaScript", "Sri lankan economy", "how to improve sri lankan economy using javascript".
    Adhere to following rules while generating the new content.
    1. Generated content should be authentic and unique
    2. Generated content should not repeat anything covered on the given content
    3. Generated content should be based on the given content and it should be shuffling the given content
    4. Generated content should revolved around one area of a certain topic
    5. Generated content should provide interesting examples
    6. Generated content should provoke conversational content
    7. Generate a suitable short topic for the generated content
    8. Provide in json format and short topic should be in the title of the json object
    9. other contents should be in the content of the json object`
    const ress = await getOpenAICompletion(prompt);

    console.log(JSON.parse(ress?.choices[0]?.message?.content)?.title);
    res.status(200).send("Server is running");
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
});

export { db, firebaseApp }