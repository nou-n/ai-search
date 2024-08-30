const axios = require("axios");
const crypto = require("node:crypto");
const mixpanel = require("mixpanel-browser");
const WebSocket = require("ws");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

exports.wrtn = class wrtn {
    constructor() {
        mixpanel.init("78c86210f74e622ec77ded5882a5762b");
        this.distinct_id = mixpanel.get_distinct_id();
        this.wrtn_id = `W1.2.30535010064645373612600053736.${crypto.getRandomValues(new Uint8Array(21)).reduce((c,b)=>c + (36 > (b &= 63) ? b.toString(36) : 62 > b ? (b - 26).toString(36).toUpperCase() : 62 < b ? "-" : "_"), "")}.${Date.now()}`;
        this.headers = {
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "ko-KR,ko;q=0.9",
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "Origin": "https://wrtn.ai",
            "Pragma": "no-cache",
            "Priority": "u=1, i",
            "Referer": "https://wrtn.ai/",
            "Sec-Ch-Ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": "\"Windows\"",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Wrtn-Locale": "ko-KR",
        }
        this.client;
        this.chat_id;
        this.sent = false;
    }

    #getUUID() {
        let timestamp = Date.now();
        return "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
            let t = (timestamp + 16 * Math.random()) % 16 | 0;
            return timestamp = Math.floor(timestamp / 16),
            ("x" === e ? t : 3 & t | 8).toString(16)
        }));
    }

    async #getModels() {
        const models = await axios.get("https://william.wow.wrtn.ai/models?platform=web", {
            headers: {
                ...this.headers,
                "Accept": "application/json, text/plain, */*",
                "Mixpanel-Distinct-Id": this.distinct_id
            }
        });
        if(models.data.result != "SUCCESS") throw new Error("모델 리스트를 가져오지 못했어요.");
        return models.data.data;
    }

    async #getChatId() {
        const models = await this.#getModels(this.distinct_id);
        let model_id;
        for(let model of models) {
            if(model.name == "wrtn_search") {
                model_id = model._id;
                break;
            }
        }
        if(!model_id) throw new Error("모델 아이디를 가져오지 못했어요.")
        const open = await axios.post("https://william.wow.wrtn.ai/guest-chat", {
            unitId: model_id,
            type: "model"
        }, {
            headers: {
                ...this.headers,
                "Accept": "application/json, text/plain, */*",
                "Mixpanel-Distinct-Id": this.distinct_id,
                "X-Wrtn-Id": this.wrtn_id
            }
        });
        if(open.data.result != "SUCCESS") throw new Error("게스트 채팅을 열지 못했어요.");
        return {
            "success": true,
            "message": {
                "chat_id": open.data.data._id
            }
        }
    }

    async #enterGuestChat() {
        return new Promise((resolve, reject) => {
            this.client.send("42/v1/guest-chat," + JSON.stringify([
                "enterChat",
                {
                    "chatId": this.chat_id,
                    "clientHeaders":{
                        "x-wrtn-id": this.wrtn_id
                    }
                }
            ]));
            this.client.addEventListener("message", (event) => {
                let data = event.data;
                if(data.startsWith("42/v1/guest-chat,")) {
                    data = JSON.parse(data.substring(17));
                    const type = data[0];
                    if(type == "connectChat"){
                        resolve({ "success": true });
                    }else{
                        reject("게스트 채팅 연결에 실패했어요.");
                    }
                }
            }, { once : true });
        });
    }

    async connect() {
        return new Promise((resolve, reject) => {
            if(this.client && this.client.readyState == WebSocket.OPEN) resolve({ "success": false, "message": "이미 연결되어 있어요." });
            this.client = new WebSocket("wss://william.wow.wrtn.ai/socket.io/?EIO=4&transport=websocket");
            this.client.addEventListener("message", (event) => {
                let data = event.data;
                if(data == "2") this.client.send("3");
            });
            this.client.onopen = async () => {
                this.client.send("40/v1/guest-chat,{}");
                const chat = await this.#getChatId();
                this.chat_id = chat.message.chat_id;
                const enter = await this.#enterGuestChat();
                resolve(enter);
            }
        });
    }


    sendMessage(message) {
        if(this.client.readyState == WebSocket.OPEN && !this.sent) {
            this.sent = true;
            this.client.send("42/v1/guest-chat," + JSON.stringify([
                "startChat",
                {
                    "message":message,
                    "model":"wrtn_search",
                    "mode":"chat",
                    "reroll":false,
                    "commandChipType":"",
                    "isChocoChip":false,
                    "images":[],
                    "referenceIds":[],
                    "assignmentId":"",
                    "content":message,
                    "chatId":this.chat_id,
                    "email":"",
                    "platform":"web",
                    "williamRequestId": this.#getUUID(),
                    "clientHeaders": {
                        "x-wrtn-id":this.wrtn_id,
                        "wrtn-locale":"ko-KR",
                        "x-test-id":"",
                        "wrtn-test-ab-model":{"wrtn_search":"B","chit_chat":"A"}
                    }
                }
            ]));
            return { "success": true };
        }
        return { "success": false };
    }

    onMessage(callback) {
        this.client.addEventListener("message", (event) => {
            let data = event.data;
            if(data.startsWith("42/v1/guest-chat,")) {
                data = JSON.parse(data.substring(17));
                const type = data[0];
                if(type == "end") this.sent = false;
                callback({
                    type,
                    response: data[1]
                });
            }
        });
    }
}
