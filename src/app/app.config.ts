import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { } from 'mqtt'


export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: '172.20.60.200',
  port: 1883,
  // path: '/mqtt',
  // username: 'user',
  // password: 'user1234',
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), 
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS))]
};
