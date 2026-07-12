import { bootstrapApplication } from '@angular/platform-browser'
import { provideClientHydration } from '@angular/platform-browser'
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'

const clientConfig: ApplicationConfig = {
  providers: [provideClientHydration()],
}

const config = mergeApplicationConfig(appConfig, clientConfig)

bootstrapApplication(AppComponent, config).catch((err) => console.error(err))
