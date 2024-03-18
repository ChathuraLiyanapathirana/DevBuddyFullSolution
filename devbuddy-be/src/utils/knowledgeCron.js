import { CronJob } from 'cron';
import admin from 'firebase-admin';
import { getAllClientIds, getNotificationToken, makeClientNotification, readMessages } from './dbHelper.js';
import systemHandler from '../handlers/systemHandler.js';


export const knowledgeCron = () => {
    // cron scheduler // Every day at midnight
    const job = new CronJob('0 */1 * * * *', async () => {
        try {
            const clients = await getAllClientIds();

            clients.forEach(async (client) => {
                const notificationToken = await getNotificationToken(client);
                if (notificationToken) {
                    const messageContents = await readMessages(client);
                    console.log("messageContents", messageContents);

                    if (messageContents?.length > 0) {
                        messageContents?.forEach(async (messageContent) => {
                            const messagesObjects = messageContent.messageObj;
                            let formattedMessages = "";
                            messagesObjects.forEach((messageObj) => {
                                formattedMessages += messageObj.message + ", ";
                            });
                            console.log("formattedMessages", formattedMessages);

                            const response = await systemHandler(formattedMessages);
                            console.log(`Response: ${response}`);

                            // Make a record of the message in the database
                            const notificationId = await makeClientNotification(client, response, messageContent.area);

                            const message = {
                                notification: {
                                    title: JSON.parse(response)?.title,
                                    body: JSON.parse(response)?.content,
                                },
                                data: {
                                    notificationId: notificationId.toString(),
                                },
                                token: notificationToken
                            };
                            try {
                                await admin.messaging().send(message);
                                console.log(`Notification sent to ${client}`);
                            } catch (error) {
                                console.error(`Error sending notification to ${client}:`, error);
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.error("knowledgeCron Error: ", error);
        }
    });
    job.start();

}