import { Request, Response } from 'express-serve-static-core';
import { RouteEvent } from './types';
// @ts-ignore
import pathMatch from 'path-match';

export class RequestData {
  private _route?: string;
  private _params?: object;
  private _handlers: string[];
  private readonly _requestHeaders: object;
  private readonly _requestBody: string;
  private readonly _requestMethod: string;
  private _responseHeaders: any;
  private _responseBody?: string;
  private _responseStatus?: number;
  private _responseDocumentId?: string;
  private readonly _date: number;
  private readonly pathMatcher: any;

  public get requestHeaders() {
    return this._requestHeaders;
  }
  public get requestBody() {
    return this._requestBody;
  }
  public get params() {
    // TODO match with current route, not only with final route
    return this._params;
  }

  /** @internal */
  constructor(
    private req: Request,
    private res: Response,
  ) {
    this._date = new Date().getTime();
    this._requestHeaders = req.headers;
    this._requestBody = req.body;
    this._requestMethod = req.method;
    this._responseHeaders = {};
    this._handlers = [];
    this.pathMatcher = pathMatch({ sensitive: false, strict: false, end: false });
  }

  /** @internal */
  public setMatchedRoute(route: string) {
    this._route = route;
    this._params = this.pathMatcher(route)(this.req.path);
  }

  /** @internal */
  public addHandler(handler: string) {
    this._handlers.push(handler);
  }

  /** @internal */
  public setDocumentId(documentId: string) {
    this._responseDocumentId = documentId;
  }

  public setStatus(status: number) {
    this._responseStatus = status;
  }

  public sendTextBody(body: string) {
    this._responseBody = body;
  }

  public sendJsonBody(body: any) {
    this.setResponseHeader('content-type', 'application/json');
    this.sendTextBody(JSON.stringify(body));
  }

  public setResponseHeader(header: string, value: string) {
    this._responseHeaders[header] = value;
  }

  public isCompleted() {
    return this._responseBody !== undefined || this._responseStatus !== undefined;
  }

  /** @internal */
  public setToErrorResponseIfNoMatch() {
    if (!this._responseBody) {
      if (!this._responseStatus) {
        this.setToMockingbirbError('No route matched.');
      }
    } else {
      if (!this._responseStatus) {
        this._responseStatus = 200;
      }
    }
  }

  /** @internal */
  public setToMockingbirbError(message: string, object?: any) {
    this._responseStatus = 500;
    this.setStatus(500);
    this.sendJsonBody({
      error: true,
      message: message,
      object: JSON.stringify(object),
      cause: 'mockingbirb',
    })
  }

  /** @internal */
  public dispatch() {
    this.setToErrorResponseIfNoMatch();
    for (const [header, value] of Object.entries(this._responseHeaders)) {
      this.res.setHeader(header, value as any);
    }
    this.res.status(this._responseStatus!);
    this.res.send(this._responseBody);
  }

  /** @internal */
  public toEvent(): RouteEvent {
    return {
      date: this._date,
      handlers: this._handlers,
      requestBody: this._requestBody,
      requestHeaders: this._requestHeaders,
      requestMethod: this._requestMethod,
      responseBody: this._requestBody,
      responseHeaders: this._responseHeaders,
      responseStatus: this._responseStatus!,
      responseDocumentId: this._responseDocumentId,
      route: this._route ?? '__NONE',
      path: this.req.path
    }
  }
}