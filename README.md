### On backend 
    * 1. npm install
    * 2. make .env file like example.env
        OPENAI_API_KEY=API_KEY
        MAX_TOKENS=400
        TEMPERATURE=0.2
        MODEL=gpt-3.5-turbo
        SYSTEM_PROMPT_WORD_COUNT=200
        FIREBASE_SERVICE_ACCOUNT=./firebase/sa.json
        SERVER_PORT=3001
    * 3. get the firebase server client json from firebase console and 
        replace the path /firebase/sa.json

### On mobile app
    *** 1. npm install
    *** 2. get the google json from firebase console and replace it on the android/app path
    *** 3. IOS not configured properly do it your own
