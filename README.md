# ai-search
wrtn.ai의 ai 검색 기능

## 사용 예시

<details open><summary><h3>코드</h3></summary>
    
```js
const { wrtn } = require("./wrtn");

(async () => {
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
})();
```
</details>

<details open><summary><h3>출력</h3></summary>

```markdown
전송에 성공했어요.
[Fri Aug 30 2024 18:33:41] 요청 확인 중
[Fri Aug 30 2024 18:33:43] 검색 중
[Fri Aug 30 2024 18:33:43] 읽는 중
[Fri Aug 30 2024 18:33:44] 마무리
Golang, 또는 Go 언어는 구글에서 개발한 프로그래밍 언어로, 간결하고 효율적인 코드를 작성할 수 있도록 설계되었습니다. 2007년에 개발이 시작되어 2012년 1.0 버전이 출시되었으며, 현재는 1.21 버전까지 발
전했습니다. Go는 C++, Java, Python의 장점을 결합한 정적 타입 언어로, 특히 동시성 프로그래밍을 지원하는 것이 큰 특징입니다.

## Golang의 주요 특징
- **간결함**: Go는 문법이 간단하고 명확하여 배우기 쉽습니다. [[1]](http://golang.site/go/basics)
- **정적 타입**: 변수의 타입을 명시적으로 선언해야 하며, 이는 코드의 안정성을 높입니다.
- **동시성 지원**: Go는 goroutine과 채널을 통해 동시성을 쉽게 구현할 수 있습니다. 이는 멀티코어 프로세서의 성능을 극대화하는 데 유리합니다.
- **빠른 컴파일 속도**: Go는 빠른 컴파일 속도를 자랑하여 개발자들이 신속하게 코드를 테스트하고 배포할 수 있습니다.

## Golang의 사용 사례
- **서버 사이드 개발**: Go는 웹 서버 및 API 서버 개발에 많이 사용됩니다. [[4]](https://d2.naver.com/helloworld/8588537)
- **클라우드 서비스**: 많은 클라우드 서비스와 도구들이 Go로 작성되어 있습니다.
- **데이터 처리**: Go는 대량의 데이터를 처리하는 데 적합한 성능을 제공합니다.

## Golang의 장점
- **강력한 표준 라이브러리**: Go는 다양한 내장 라이브러리를 제공하여 개발자가 쉽게 기능을 구현할 수 있도록 돕습니다.
- **커뮤니티와 생태계**: 활발한 커뮤니티와 다양한 패키지들이 있어 개발자들이 필요로 하는 도구를 쉽게 찾을 수 있습니다. [[3]](https://blog.goorm.io/hominlee/)
- **에러 처리**: Go는 "Don't panic"이라는 컨벤션을 따르며, 에러를 값으로 취급하여 보다 안전한 에러 처리를 가능하게 합니다. [[4]](https://d2.naver.com/helloworld/8588537)

## Golang의 단점
- **제한된 제네릭 지원**: Go는 제네릭 프로그래밍을 지원하지만, 다른 언어에 비해 그 기능이 제한적입니다.
- **패키지 관리**: 초기에는 패키지 관리가 불편했으나, 현재는 Go Modules를 통해 개선되었습니다.

## Golang과 관련된 주제: 동시성 프로그래밍
Golang의 가장 큰 장점 중 하나는 동시성 프로그래밍을 쉽게 구현할 수 있다는 점입니다. Go는 goroutine과 채널을 통해 여러 작업을 동시에 처리할 수 있도록 설계되었습니다.

- **Goroutine**: Go에서 경량 스레드로, 수천 개의 goroutine을 동시에 실행할 수 있습니다.
- **채널**: goroutine 간의 통신을 위한 메커니즘으로, 데이터 전송을 안전하게 처리할 수 있습니다.

이러한 동시성 기능은 웹 서버, 데이터 처리, 네트워크 프로그래밍 등 다양한 분야에서 Go의 성능을 극대화하는 데 기여합니다.

Golang은 간결하고 효율적인 프로그래밍을 가능하게 하며, 특히 동시성 프로그래밍에서 강력한 성능을 발휘합니다. Go 언어의 특징과 장점을 이해하면, 다양한 개발 환경에서 효과적으로 활용할 수 있습니다. Go 를 배우고 활용하는 것은 현대 소프트웨어 개발에서 큰 도움이 될 것입니다.
```
</details>
