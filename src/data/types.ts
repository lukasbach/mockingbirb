import { Request, Response } from 'express-serve-static-core';
import { RequestData } from './RequestData';

type TypedObject<K extends string, V> = { [key in K]: V };

export interface MockedServerConfiguration {
  id: string;
  location: string;
  name: string;
  initials: string;
  color: string;
  port: number;
  env: object;
  isRunning: boolean;
  routes: MockedRouteConfiguration[];
  documents: TypedObject<string, MockDocument>;
  handlers: TypedObject<string, MockedHandler>;
  events: RouteEvent[];
}

export interface MockedRouteConfiguration {
  id: string;
  route: string;
  method: string;
  handlers: string[];
}

export interface RouteEvent {
  route: string;
  handlers: string[];
  requestHeaders: object;
  requestBody: string;
  requestMethod: string;
  responseHeaders: object;
  responseBody: string;
  responseStatus: number;
  responseDocumentId?: string;
  date: number;
  path: string;
}

export interface MockDocument {
  id: string;
  name: string;
  content: string;
  contentType: string;
}

export interface MockedHandler {
  id: string;
  name: string;
  public?: boolean;
  always?: boolean;
  type: string;
  if?: string;
}

export interface MockedHandlerDocumentRepeater extends MockedHandler {
  type: 'repeater';
  documentId: string;
  status: number;
}

export interface MockedHandlerSmartDocumentRepeater extends MockedHandler {
  type: 'smartrepeater';
  documents: Array<{
    documentId: string;
    if?: string;
    chance: number;
    status: number;
  }>
}

export interface MockedHandlerLogic extends MockedHandler {
  type: 'logic';
  code: string;
}

export interface HandlerDispatcher<H extends MockedHandler> {
  type: string;
  handle: (handler: H, request: RequestData, params: object) => Promise<void>;
}