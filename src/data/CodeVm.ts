import { MockedServerConfiguration } from './types';
import { MockServer } from './MockServer';
import vm from 'vm';
import { RequestData } from './RequestData';

export class CodeVm {
  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer
  ) {
  }

  public async execute(code: string, request: RequestData, context?: any): Promise<any> {
    return new Promise<any>((res, rej) => {
      const codeWithoutImports = code.replace(/(import[^'"]+['"][^'"]+['"];?)/g, '');

      const ctxObject: any = context ?? {};
      const serverStateCopy = {...this.state};

      ctxObject.run = (handler: (request: RequestData, serverState: MockedServerConfiguration) => any | Promise<any>) => {
        const result = handler(request, serverStateCopy);

        if (result === undefined) {
          res(undefined);
        } else if (typeof (result as Promise<void>).then === 'function') {
          (result as Promise<any>).then(res);
        } else {
          res(result);
        }
      }

      this.server.updateState({ env: serverStateCopy.env });

      const ctx = vm.createContext(ctxObject);
      vm.runInContext(codeWithoutImports, ctx, { timeout: 5000 });
    });
  }
}