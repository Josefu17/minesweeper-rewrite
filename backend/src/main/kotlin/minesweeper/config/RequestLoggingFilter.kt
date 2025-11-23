package minesweeper.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.filter.CommonsRequestLoggingFilter

@Configuration
class RequestLoggingConfig {

    @Bean
    @Suppress("UsePropertyAccessSyntax")
    fun requestLoggingFilter(): CommonsRequestLoggingFilter =
        CommonsRequestLoggingFilter().apply {
            setIncludeClientInfo(true)
            setIncludeQueryString(true)
            setIncludePayload(true)
            setMaxPayloadLength(64_000)
            setIncludeHeaders(false)
        }
}
