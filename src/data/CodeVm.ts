import { MockedServerConfiguration } from './types';
import { MockServer } from './MockServer';
import vm from 'vm';
import { Request, Response } from 'express-serve-static-core';
import { RequestData } from './RequestData';

export class CodeVm {
  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer
  ) {
  }

  public async execute(code: string, request: RequestData, context?: any): Promise<any> {
    const ctxObject: any = context ?? {};

    ctxObject.request = request;

    const ctx = vm.createContext(ctxObject);
    vm.runInContext(code, ctx, { timeout: 5000 });
    const result = ctx.result;
    console.log("Returned")
    return typeof result.then === 'function' ? await result : result;
  }
}