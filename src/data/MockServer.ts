import {
  MockDocument,
  MockedHandler,
  MockedHandlerDocumentRepeater, MockedHandlerLogic, MockedHandlerSmartDocumentRepeater,
  MockedRouteConfiguration,
  MockedServerConfiguration,
  RouteEvent,
} from './types';
import * as uuid from 'uuid';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { RoutesManager } from './RoutesManager';
import { DocumentManager } from './DocumentManager';
import { RequestHandler } from './RequestHandler';
import { CodeVm } from './CodeVm';
import { Serializer } from './serialization/Serializer';
import { Server } from 'http';

export const defaultMockServerState: MockedServerConfiguration = {
  id: uuid.v4(),
  name: 'New Mock',
  port: 5080,
  color: 'red',
  initials: 'NM',
  isRunning: false,
  location: 'C:/test',
  handlers: {
    defaultHandler: {
      id: 'defaultHandler',
      name: 'Default Handler',
      type: 'repeater',
      documentId: 'defaultDocument',
      status: 200,
      // if: 'result = params.id === "test";'
    } as MockedHandlerDocumentRepeater
  },
  documents: {
    defaultDocument: {
      id: 'defaultDocument',
      name: 'Default Document',
      content: 'Hello!',
      contentType: 'application/json',
    },
    defaultDocument2: {
      id: 'defaultDocument2',
      name: 'Default Document 2',
      content: 'Hello!',
      contentType: 'application/xml',
    },
  },
  routes: [
    {
      id: "route1",
      route: '/hello/:id/:code/*',
      handlers: ['defaultHandler'],
      method: 'POST'
    },
    {
      id: "route2",
      route: '/something/*',
      handlers: ['defaultHandler'],
      method: 'POST'
    },
  ],
  env: {},
  events: []
};

export class MockServer {
  private server?: Express;
  private httpServer?: Server;
  private requestHandler: RequestHandler;
  private readonly vm: CodeVm;
  public routes: RoutesManager;
  public documents: DocumentManager;
  private serializeTimeout: any = undefined;

  constructor(
    private state: MockedServerConfiguration,
    private onChange: (state: MockedServerConfiguration) => void,
  ) {
    this.state.isRunning = false;
    this.vm = new CodeVm(state, this);
    this.routes = new RoutesManager(state, this);
    this.documents = new DocumentManager(state, this);
    this.requestHandler = new RequestHandler(state, this, this.vm);
  }

  public static createEmpty(onChange: (state: MockedServerConfiguration) => void) {
    return new MockServer(defaultMockServerState, onChange);
  }

  public getState() {
    return this.state;
  }

  public setUpdateHandler(handler: (state: MockedServerConfiguration) => void) {
    return this.onChange = handler;
  }

  public start() {
    console.log("Starting server")
    if (this.httpServer) {
      this.stop();
    }

    this.server = express();
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.text());

    this.server.all('*', async (req, res, next) => {
      try {
        await this.requestHandler.handle(req, res);
      } catch(e) {
        console.error(e);
        if (!res.headersSent) {
          res.status(500).json({
            error: true,
            message: e.message,
            object: JSON.stringify(e),
            cause: 'mockingbirb',
          });
        }
      }
    });

    this.httpServer = this.server.listen(this.state.port, () => {
      this.state.isRunning = true;
      this.scheduleUpdate();
    });

    window.addEventListener("beforeunload", () => {
      console.log("Closing server");
      this.stop();
    })
  }

  public stop() {
    if (this.httpServer) {
      this.httpServer.close();
      this.state.isRunning = false;
      this.scheduleUpdate();
    }
  }

  public createHandler(handler: Omit<MockedHandler, 'id'>) {
    const id = uuid.v4();
    this.state.handlers[id] = {...handler, id};
    this.scheduleUpdate();
    return id;
  }
  public updateHandler(id: string, handler: Partial<MockedHandler>) {
    if (handler.id && id !== handler.id) {
      delete this.state.handlers[id];
    }
    this.state.handlers[handler.id ?? id] = {...this.state.handlers[id], ...handler};
    this.scheduleUpdate();
  }
  public deleteHandler(id: string) {
    delete this.state.handlers[id];
    this.scheduleUpdate();
  }
  public initializeNewHandlerFor(routeId: string, handlerType: string) {
    let handlerId;
    const routeConfig = this.routes.getRoute(routeId);

    switch (handlerType) {
      case 'repeater':
        handlerId = this.createHandler({
          type: 'repeater',
          name: `Document Repeater for ${routeConfig.route}`,
          documentId: '',
          status: 200,
        } as Omit<MockedHandlerDocumentRepeater, 'id'>);
        break;
      case 'smartrepeater':
        handlerId = this.createHandler({
          type: 'smartrepeater',
          name: `Smart Document Repeater for ${routeConfig.route}`,
          documents: [],
        } as Omit<MockedHandlerSmartDocumentRepeater, 'id'>);
        break;
      case 'logic':
        handlerId = this.createHandler({
          type: 'logic',
          name: `Logic Handler for ${routeConfig.route}`,
          code: '',
          status: 200,
        } as Omit<MockedHandlerLogic, 'id'>);
        break;
      default:
        throw Error(`Unknown handler type ${handlerType}`);
    }

    this.routes.updateRoute(routeId, {
      handlers: [...routeConfig.handlers, handlerId]
    });
  }

  public recordEvent(event: RouteEvent) {
    this.state.events.push(event);
    this.scheduleUpdate();
  }
  public clearEvents() {
    this.state.events = [];
    this.scheduleUpdate();
  }

  public scheduleUpdate() {
    // TODO settimeout
    console.log(this.state)
    this.onChange({...this.state});

    if (this.serializeTimeout !== undefined) {
      clearTimeout(this.serializeTimeout);
    }

    this.serializeTimeout = setTimeout(() => {
      try {
        new Serializer(this.state).serialize();
      } catch (e) {
        console.error(e);
      }
    }, 10000);
  }
}