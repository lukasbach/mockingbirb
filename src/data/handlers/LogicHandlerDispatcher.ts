import {
  HandlerDispatcher,
  MockedHandlerDocumentRepeater,
  MockedHandlerLogic,
  MockedServerConfiguration,
} from '../types';
import { CodeVm } from '../CodeVm';
import { MockServer } from '../MockServer';
import { RequestData } from '../RequestData';

export class LogicHandlerDispatcher implements HandlerDispatcher<MockedHandlerLogic>{
  public type = 'logic';

  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer,
    private vm: CodeVm,
  ) {
  }

  public async handle(handler: MockedHandlerLogic, request: RequestData, params: object) {
    await this.vm.execute(handler.code, request, { params });
  }
}