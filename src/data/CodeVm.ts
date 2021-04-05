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

      ctxObject.run = (handler: (request: RequestData) => any | Promise<any>) => {
        const result = handler(request);

        if (result === undefined) {
          res(undefined);
        } else if (typeof (result as Promise<void>).then === 'function') {
          (result as Promise<any>).then(res);
        } else {
          res(result);
        }
      }

      const ctx = vm.createContext(ctxObject);
      vm.runInContext(codeWithoutImports, ctx, { timeout: 5000 });
    });
  }
}