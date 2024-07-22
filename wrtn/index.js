const axios = require("axios");
const crypto = require("node:crypto");
const EventSource = require("eventsource");
const mixpanel = require("mixpanel-browser");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
mixpanel.init("78c86210f74e622ec77ded5882a5762b"); // https://wrtn.ai/__env.b7229d14.js

/**
 * @param {string} message
 */
async function search(message) {
    return new Promise(async (resolve, reject) => {
        let wrtnId = getWrtnId(), distinctId = mixpanel.get_distinct_id(), defaultHeaders = getHeaders();
        axios.post("https://william.wow.wrtn.ai/chat/anonymous/start?platform=web&mode=chat&model=wrtn_search", { "message": message },
        {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Mixpanel-Distinct-Id": distinctId,
                "X-Wrtn-Id": wrtnId,
                ...defaultHeaders
            }
        }).then((response) => {
            if(response.data.result == "SUCCESS") {
                let text = "";
                const eventSource = new EventSource(`https://william.wow.wrtn.ai/chat/anonymous/${response.data.data}?model=wrtn_search&isChocoChip=false&platform=web&user=nobody@wrtn.io`, {
                    headers: {
                        "Accept": "text/event-stream",
                        "X-Test-Id": "",
                        "X-Wrtn-Id": wrtnId,
                        ...defaultHeaders
                    }
                });
                eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    switch(Object.keys(data)[0]) {
                        case "chunk":
                            text += data.chunk;
                            break;
                        case "end":
                            eventSource.close();
                            resolve({ "success": true, "message": text });
                            break;
                    }
                };
                eventSource.addEventListener("generate_step", (event) => {
                    console.log(`[${Date().split(" GMT")[0]}] ${JSON.parse(event.data).message}`);
                });
            }else{
                resolve({ "success": false, "message": "검색에 실패했어요." });
            }
        }).catch((error) => {
            resolve({
                "success": false,
                "message": {
                    "status": error.response.status,
                    "data": error.response.data
                }
            })
        })
    });
}

function getHeaders() {
    return {
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
}

/**
 * https://developer-cdn.wrtn.ai/sdk.js
 */
function getWrtnId() {
    let NanoID = crypto.getRandomValues(new Uint8Array(21)).reduce((c,b)=>c + (36 > (b &= 63) ? b.toString(36) : 62 > b ? (b - 26).toString(36).toUpperCase() : 62 < b ? "-" : "_"), "");
    return `W1.2.30535010064645373612600053736.${NanoID}.${Date.now()}`;
}

exports.search = search;