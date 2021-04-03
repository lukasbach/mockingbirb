import { HandlerDispatcher, MockedServerConfiguration } from './types';
import { MockServer } from './MockServer';
import { Request, Response } from 'express-serve-static-core';
// @ts-ignore
import pathMatch from 'path-match';
import { DocumentRepeaterHandlerDispatcher } from './handlers/DocumentRepeaterHandlerDispatcher';
import { CodeVm } from './CodeVm';

export class RequestHandler {
  private pathMatcher: any;
  private handlerDispatchers: HandlerDispatcher<any>[];

  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer,
    private vm: CodeVm,
  ) {
    this.pathMatcher = pathMatch({ sensitive: false, strict: false, end: false });
    this.handlerDispatchers = [
      new DocumentRepeaterHandlerDispatcher(state, server, vm),
    ]
  }

  public async handle(req: Request, res: Response) {
    console.log(req);
    const { path } = req;

    for (const route of this.state.routes) {
      const match = this.pathMatcher(route.route)(path);
      if (match !== false) {
        console.log(`Route ${route.route} matched ${path}`);

        for (const handlerId of route.handlers) {
          const handler = this.state.handlers[handlerId];
          let handled = false;

          for (const handlerDispatcher of this.handlerDispatchers) {
            if (handlerDispatcher.type === handler.type) {
              handled = true;
              await handlerDispatcher.handle(handler, req, res, match);
              break;
            }
          }

          if (!handled) {
            throw Error(`Handlertype ${handler.type} does not exist`);
          }
        }
      }
    }

    // no match
    throw Error('No route in mockingbirb matched the URL provided');
  }
}