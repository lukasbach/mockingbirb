import { HandlerDispatcher, MockedHandlerDocumentRepeater, MockedServerConfiguration } from '../types';
import { Request, Response } from 'express-serve-static-core';
import { CodeVm } from '../CodeVm';
import { MockServer } from '../MockServer';

export class DocumentRepeaterHandlerDispatcher implements HandlerDispatcher<MockedHandlerDocumentRepeater>{
  public type = 'repeater';

  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer,
    private vm: CodeVm,
  ) {
  }

  public async handle(handler: MockedHandlerDocumentRepeater, req: Request, res: Response, params: object) {
    if (handler.if) {
      const shouldRun = await this.vm.execute(handler.if, req, res, { params });
      if (!shouldRun) {
        console.log("Skipped");
        return;
      }
    }

    const { content, contentType } = this.state.documents[handler.documentId];
    res.setHeader('content-type', contentType);
    res
      .status(200)
      .send(content);
  }
}