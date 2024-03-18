import { db } from '../../app.js';

// Create a new document with the given client ID and append the message to it
export async function createRecordAndAppendMessage(clientId, message, generatedContent, area) {
    try {
        const clientRef = db.collection('history').doc(clientId);
        const clientDoc = await clientRef.get();

        const content = {
            message: message,
            generatedContent: generatedContent,
            timestamp: new Date()
        }

        // Initialize the document with an empty area object (content as array) if it doesn't exist
        if (!clientDoc.exists) {
            await clientRef.set({
                [area]: {
                    notifyMe: false,
                    content: [content] // Ensure 'content' is always an array
                }
            });
        }

        // Get the existing area data - content is guaranteed to be an array
        const areaData = clientDoc.data()?.[area] || { notifyMe: false, content: [] };
        let responses = areaData.content;

        // Limit the size of the array
        if (responses.length >= 50) {
            responses.shift(); // Remove the oldest content
        }

        // Add the new notification at the end
        responses.push(content);

        // Append the new message to the 'content' array within the 'area' object
        areaData.content = responses;

        // Update the document 
        await clientRef.update({
            [area]: areaData
        });

        console.log("Message appended to document with ID: ", clientId);
    } catch (error) {
        console.error("Error appending message: ", error);
    }
}

// Mark the notifyMe field as true for the given client ID and area
export async function markNotifyMe(clientId, area, state) {
    try {
        const clientRef = db.collection('history').doc(clientId);
        const clientDoc = await clientRef.get();

        if (clientDoc.exists) {
            const areaData = clientDoc.data()?.[area]; // Fetch area data if it exists
            if (areaData) { // Check if the 'area' exists
                areaData.notifyMe = state;

                await clientRef.update({
                    [area]: areaData
                });
                console.log("NotifyMe marked for: ", clientId);
                return true;
            } else {
                console.log("Specified area not found within document!");
            }

        } else {
            console.log("No such document!");
        }
        return false;
    } catch (error) {
        console.error("Error marking notifyMe: ", error);
    }
}

// Read the messages from the document with the given client ID
export async function readMessages(clientId) {
    try {
        const clientRef = db.collection('history').doc(clientId);
        const clientDoc = await clientRef.get();
        console.log("Client Id: ", clientId);
        const returnData = [];
        if (clientDoc.exists) {
            for (const areaKey in clientDoc.data()) {
                const areaData = clientDoc.data()[areaKey];
                if (areaData.notifyMe) {
                    const areaMessages = {
                        area: areaKey,
                        messageObj: areaData.content.slice(0, 10) || []
                    };
                    returnData.push(areaMessages);
                }
            }

            return returnData;
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error reading messages: ", error);
    }
}

// Read the messages from the document with the given client ID and area
export async function readMessagesByArea(clientId, area, slice = false) {
    try {
        const clientRef = db.collection('history').doc(clientId);
        const clientDoc = await clientRef.get();

        if (clientDoc.exists) {
            const data = {
                notifyMe: clientDoc.data()?.[area]?.notifyMe,
                content: slice ? clientDoc.data()?.[area]?.content.slice(-3) : clientDoc.data()?.[area]?.content || []
            }
            return data;
        } else {
            console.log("No such document!");
            return {};
        }
    } catch (error) {
        console.error("Error reading messages by area: ", error);
    }
}

// Read all client IDs from the 'clients' collection
export async function getAllClientIds() {
    try {
        const clientsCollection = db.collection('history');
        const clientSnapshot = await clientsCollection.get();

        const clientIds = clientSnapshot.docs.map(doc => doc.id);

        return clientIds;
    } catch (error) {
        console.error("Error fetching client IDs:", error);
        return [];
    }
}

// Make a new document with the given client ID and registration token
export async function makeClientIdentity(clientId, nToken) {
    try {
        const clientRef = db.collection('identity').doc(clientId);
        await clientRef.set({ registrationToken: nToken, disabled: false });
        console.log("Client identity created for: ", clientId);
        return clientId;
    } catch (error) {
        console.error("Error creating client identity: ", error);
    }
}

// Enable user
export async function enableClient(clientId) {
    try {
        const clientRef = db.collection('identity').doc(clientId);
        await clientRef.update({ disabled: false });
        console.log("Client enabled: ", clientId);
        return clientId;
    } catch (error) {
        console.error("Error enabling client: ", error);
    }
}

// Mark user as disabled
export async function markClientAsDisabled(clientId) {
    try {
        const clientRef = db.collection('identity').doc(clientId);
        await clientRef.update({ disabled: true });
        console.log("Client disabled: ", clientId);
        return clientId;
    } catch (error) {
        console.error("Error marking client as disabled: ", error);
    }
}

// Read the registration token from the document with the given client ID
export async function getNotificationToken(clientId) {
    try {
        const identityRef = db.collection('identity').doc(clientId);
        const identityDoc = await identityRef.get();

        if (identityDoc.exists) {
            const identityData = identityDoc.data();

            // Check if the user is disabled
            if (identityData.disabled) {
                console.log("Client disabled, not sending notification");
                return null;
            }

            return identityData.registrationToken;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error reading token: ", error);
        return null;
    }
}

// Make a new document with given client id for notifications
export async function makeClientNotification(clientId, notification, title) {
    try {
        const clientRef = db.collection('notifications').doc(clientId);
        // Fetch the existing notifications document
        const clientDoc = await clientRef.get();

        const notificationData = {
            id: new Date().getTime(),
            notification: notification,
            read: false,
            title: title
        }

        // Get the existing responses array 
        let responses = clientDoc.data()?.responses || [];

        // Limit the size of the array
        if (responses.length >= 50) {
            responses.shift(); // Remove the oldest notificationData
        }

        // Add the new notification at the end
        responses.push(notificationData);

        // Update the document
        await clientRef.set({
            responses: responses
        }, { merge: true });


        console.log("Client notification created for: ", clientId);
        return notificationData.id;
    } catch (error) {
        console.error("Error creating client notification: ", error);
    }
}

// Read the notifications from the document with the given client ID
export async function readNotifications(clientId) {
    try {
        const clientRef = db.collection('notifications').doc(clientId);
        const clientDoc = await clientRef.get();

        if (clientDoc.exists) {
            return clientDoc.data().responses;
        } else {
            console.log("No such document!");
            return [];
        }
    } catch (error) {
        console.error("Error reading notifications: ", error);
    }
}

// Mark the notification as read
export async function markNotificationAsRead(clientId, notificationId) {
    try {
        const clientRef = db.collection('notifications').doc(clientId);
        const clientDoc = await clientRef.get();

        if (clientDoc.exists) {
            let responses = clientDoc.data().responses;

            // Find notification by ID
            const notificationIndex = responses.findIndex(
                (notification) => notification.id === notificationId
            );

            if (notificationIndex !== -1) {
                responses[notificationIndex].read = true;

                await clientRef.update({
                    responses: responses
                });
                return notificationId;
            } else {
                console.error("Notification with ID not found");
            }
        } else {
            console.log("No such document!");
        }
        return null;
    } catch (error) {
        console.error("Error marking notification as read: ", error);
    }
}
