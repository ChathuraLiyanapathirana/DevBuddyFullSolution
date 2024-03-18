import { Router } from "express";

import { createRecordAndAppendMessage, readMessagesByArea } from "../utils/dbHelper.js";
import { formatPrompt } from "../utils/helper.js";
import { CLIENT_REQUEST_PROMPT } from "../constants/prompts.js";
import { getOpenAICompletion } from "../utils/openaiHelper.js";

const router = Router();


router.post("/gpt-call", async (req, res) => {
    try {
        console.error("gpt-call init");
        const prompt = req.body.prompt;
        const area = req.body.area;
        const clientId = req.body.clientId;

        if (!prompt || !area || !clientId) {
            res.status(400).send("Please provide required params in the request body.");
            return;
        }

        try {
            // Format the prompt
            const previousContext = await readMessagesByArea(clientId, area, true);
            let prevResp = "";
            console.log("previousContext", previousContext);
            console.log("previousContext", previousContext?.content);
            if (previousContext?.content?.length > 0) {
                previousContext?.content?.forEach((cont) => {
                    prevResp += cont.generatedContent + ", ";
                });
            }

            const formattedPrompt = formatPrompt(CLIENT_REQUEST_PROMPT, { content: prompt, area: area, generatedContent: prevResp });

            // Call OpenAI
            const response = await getOpenAICompletion(formattedPrompt);

            console.log("openai Response: ", JSON.stringify(response));

            const generatedContent = response.choices[0].message.content;

            if (generatedContent) {
                // Make a record of the message in the database
                await createRecordAndAppendMessage(clientId, prompt, generatedContent, area);

                res.status(200).json({
                    data: {
                        content: generatedContent,
                    }
                });
            } else {
                res.status(500).json({ error: "No proper response from OpenAI" });
            }

        } catch (error) {
            console.error("openai Error: ", error);
            res.status(500).json({ error: response.error });
        }
    } catch (error) {
        console.error("gpt-call error" + error);
        res.status(500).send(error);
    }
});

router.post("/chat-history", async (req, res) => {
    try {
        const clientId = req.body.clientId;
        const area = req.body.area;

        if (!clientId || !area) {
            res.status(400).send("Please provide required params in the request body.");
            return;
        }

        try {
            // Read the messages from the document with the given client ID and area
            const messageContents = await readMessagesByArea(clientId, area);

            res.status(200).json({
                data: {
                    content: messageContents,
                }
            });

        } catch (error) {
            console.error("chat-history Error: ", error);
            res.status(500).json({ error: error });
        }
    } catch (error) {
        console.error("chat-history error" + error);
        res.status(500).send(error);
    }
}
);

export default router;