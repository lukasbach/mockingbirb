import { MockedServerConfiguration } from './types';
import { MockServer } from './MockServer';
import vm from 'vm';
import { Request, Response } from 'express-serve-static-core';

export class CodeVm {
  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer
  ) {
  }

  public async execute(code: string, req?: Request, res?: Response, context?: any): Promise<any> {
    const ctxObject: any = context ?? {};

    if (req) {
      ctxObject.req = req;
    }
    if (res) {
      ctxObject.res = res;
    }

    const ctx = vm.createContext(ctxObject);
    vm.runInContext(code, ctx, { timeout: 5000 });
    const result = ctx.result;
    console.log("Returned")
    return typeof result.then === 'function' ? await result : result;
  }
}