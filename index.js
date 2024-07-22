const { search } = require("./wrtn");

async function main() {
    const message = await search("대한민국 수도에 대해 알려줘");
    console.log(message.message);
}

main();