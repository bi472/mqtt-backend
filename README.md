# mqtt-backend

## Demo link:
Get hello from [mqtt-backend](http://46.254.20.115:3000/).

## Documentation
There you can view the [API documentation](http://46.254.20.115:3000/docs).

## Table of Content:

- [About The App](#about-the-app)
- [Technologies](#technologies)
- [Setup with Docker](#setup)
- [Envoroment variables](#setup)
- [Documentation](#documentation)
- [Status](#status)
## About The App
mqtt-backend is app with authentication to communiucate with MQTT Server.
## Technologies
I used `Nest JS`, `MongoDB`, `Docker`.

## Setup
```bash
git clone https://github.com/bi472/mqtt-backend.git
cd mqtt-backend

#Create .env file
.....

docker compose up -d nestapp
```
Done!

## Enviroment Variables
```env
port = 3000

mongoURL = "mongodb://mongodb:27017"

JWT_ACCESS_SECRET = <your secret access code>
JWT_REFRESH_SECRET = <your secret refresh code>
```

## Status
[mqtt-backend] works stably
