type gptCallType = {
  clientId: string;
  area: string;
  prompt: string;
};

type chatHistoryType = {
  clientId: string;
  area: string;
};

type clientIdType = {
  clientId: string;
};

type gptCallResponseType = {
  data: {
    content: string;
  };
};

type getAccessType = {
  nToken: string;
  clientId: string;
};

type readNotificationType = {
  clientId: string;
  id: string;
};

type enableNotificationType = {
  clientId: string;
  area: string;
  state: boolean;
};

// http://localhost:3000/client/gpt-call - POST
export const gptCall = async (
  data: gptCallType,
): Promise<gptCallResponseType> => {
  const response = await fetch('http://10.0.2.2:3001/client/gpt-call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const setAccess = async (data: getAccessType) => {
  const response = await fetch('http://10.0.2.2:3001/auth/access', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('response', response);
  return response.json();
};

export const serverSignOut = async (data: clientIdType) => {
  const response = await fetch('http://10.0.2.2:3001/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('response', response);
  return response.json();
};

export const chatHistory = async (data: chatHistoryType) => {
  const response = await fetch('http://10.0.2.2:3001/client/chat-history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('chat re', response);
  return response.json();
};

export const notificationHistory = async (data: clientIdType) => {
  const response = await fetch('http://10.0.2.2:3001/notification/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('response', response);
  return response.json();
};

export const readNotification = async (data: readNotificationType) => {
  const response = await fetch(
    'http://10.0.2.2:3001/notification/mark-as-read',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
  console.log('response', response);
  return response.json();
};

export const enableNotification = async (data: enableNotificationType) => {
  console.log('data', data);
  const response = await fetch('http://10.0.2.2:3001/notification/enable', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log('response', response);
  return response.json();
};
