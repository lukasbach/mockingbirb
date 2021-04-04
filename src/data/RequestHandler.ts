import { HandlerDispatcher, MockedServerConfiguration, RouteEvent } from './types';
import { MockServer } from './MockServer';
import { Request, Response } from 'express-serve-static-core';
// @ts-ignore
import pathMatch from 'path-match';
import { DocumentRepeaterHandlerDispatcher } from './handlers/DocumentRepeaterHandlerDispatcher';
import { CodeVm } from './CodeVm';
import { RequestData } from './RequestData';

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
    const { path, method } = req;
    const requestData = new RequestData(req, res);

    const routesSorted = this.state.routes.sort((a, b) => b.route.length - a.route.length);

    for (const route of routesSorted) {
      requestData.setMatchedRoute(route.route);
      const match = this.pathMatcher(route.route)(path);
      if (match !== false && (route.method.toLowerCase() === 'all' || route.method.toLowerCase() === method.toLowerCase())) {
        console.log(`Route ${route.route} matched ${path}`);

        for (const handlerId of route.handlers) {
          const handler = this.state.handlers[handlerId];

          for (const handlerDispatcher of this.handlerDispatchers) {
            if (requestData.isCompleted()) {
              console.log(`Skipping handlers because headers were sent.`);
              break;
            }

            if (handlerDispatcher.type === handler.type) {
              let shouldRun = true;
              if (handler.if) {
                shouldRun = await this.vm.execute(handler.if, requestData, { params: match });
              }

              if (shouldRun) {
                requestData.addHandler(handler.id);
                await handlerDispatcher.handle(handler, requestData, match);
              }

              break;
            }
          }
        }

        break;
      }
    }

    console.log(requestData)
    requestData.dispatch();
    const event = requestData.toEvent();
    this.server.recordEvent(event);
  }
}