package com.buss.url_shortener;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"clerk.issuer=https://clerk.example.test",
		"clerk.jwks-url=https://clerk.example.test/.well-known/jwks.json"
})
class UrlShortenerApplicationTests {

	@Test
	void contextLoads() {
	}

}
