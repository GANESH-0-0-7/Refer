package com.referai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableCaching
@EnableAsync
@ComponentScan(basePackages = "com.referai")
public class ReferaiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReferaiApplication.class, args);
    }
}
