const { wrtn } = require("./wrtn");

async function main() {
    const client = new wrtn();
    const connect = await client.connect();
    if(connect.success) {
        client.onMessage((message) => {
            const response = message.response;
            switch (message.type) {
                case "end":
                    console.log(response.message.content);
                    break;
                case "generateStep":
                    if(response.message) console.log(`[${Date().substring(0, 24)}] ${response.message}`);
                    break;
            }
        });
        client.sendMessage("golang에 대해서 알려줘.") ? console.log("전송에 성공했어요.") : console.log("전송에 실패했어요.");
    }
}
main();
