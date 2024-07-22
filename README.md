# ai-search
wrtn.ai의 ai 검색 기능

## 사용 예시

```js
const { search } = require("./wrtn");

(async () => {
    const message = await search("대한민국 수도에 대해 알려줘"); // {result: ..., message: ...}
    console.log(message.message);
})();
```
