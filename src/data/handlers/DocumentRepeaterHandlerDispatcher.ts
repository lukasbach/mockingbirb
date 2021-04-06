import { HandlerDispatcher, MockedHandlerDocumentRepeater, MockedServerConfiguration, RouteEvent } from '../types';
import { Request, Response } from 'express-serve-static-core';
import { CodeVm } from '../CodeVm';
import { MockServer } from '../MockServer';
import { RequestData } from '../RequestData';

export class DocumentRepeaterHandlerDispatcher implements HandlerDispatcher<MockedHandlerDocumentRepeater>{
  public type = 'repeater';

  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer,
    private vm: CodeVm,
  ) {
  }

  public async handle(handler: MockedHandlerDocumentRepeater, request: RequestData, params: object) {
    const { content, contentType } = this.state.documents[handler.documentId];
    request.setDocumentId(handler.documentId);
    request.setResponseHeader('content-type', contentType);
    request.setStatus(200);
    request.sendTextBody(content);
  }
}