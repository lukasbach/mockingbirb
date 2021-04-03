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

export const defaultMockServerState: MockedServerConfiguration = {
  id: uuid.v4(),
  name: 'New Mock',
  port: 5050,
  isRunning: false,
  handlers: {
    defaultHandler: {
      id: 'defaultHandler',
      name: 'Default Handler',
      type: 'repeater',
      documentId: 'defaultDocument',
      status: 200
    } as MockedHandlerDocumentRepeater
  },
  documents: {
    defaultDocument: {
      id: 'defaultDocument',
      name: 'Default Document',
      content: 'Hello!'
    },
    defaultDocument2: {
      id: 'defaultDocument2',
      name: 'Default Document 2',
      content: 'Hello!'
    },
  },
  routes: [
    {
      id: "route1",
      route: '/hello/*',
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

  constructor(
    private state: MockedServerConfiguration,
    private onChange: (state: MockedServerConfiguration) => void,
  ) {
    this.state.isRunning = false;
  }

  public static createEmpty(onChange: (state: MockedServerConfiguration) => void) {
    return new MockServer(defaultMockServerState, onChange);
  }

  public start() {
    if (this.server) {
      // TODO close server
    }

    this.server = express();

    this.server.all('*', (req, res, next) => {

    });

    this.server.listen(this.state.port, () => {
      this.state.isRunning = true;
      this.scheduleUpdate();
    });
  }

  public createRoute(routeConfig: Omit<MockedRouteConfiguration, 'id'>) {
    const id = uuid.v4();
    this.state.routes.push({...routeConfig, id});
    this.scheduleUpdate();
    return id;
  }
  public updateRoute(id: string, routeConfig: Partial<MockedRouteConfiguration>) {
    this.state.routes = this.state.routes.map(r => r.id === id ? {...r, ...routeConfig} : r);
    this.scheduleUpdate();
  }
  public deleteRoute(id: string) {
    this.state.routes = this.state.routes.splice(this.state.routes.findIndex(r => r.id === id), 1);
    this.scheduleUpdate();
  }
  public getRoute(id: string) {
    return this.state.routes.find(r => r.id === id)!;
  }

  public createDocument(document: Omit<MockDocument, 'id'>) {
    const id = uuid.v4();
    this.state.documents[id] = {...document, id};
    this.scheduleUpdate();
    return id;
  }
  public updateDocument(id: string, document: Partial<MockDocument>) {
    if (document.id && id !== document.id) {
      delete this.state.documents[id];
    }
    this.state.documents[document.id ?? id] = {...this.state.documents[id], ...document};
    this.scheduleUpdate();
  }
  public deleteDocument(id: string) {
    delete this.state.documents[id];
    this.scheduleUpdate();
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
    const routeConfig = this.getRoute(routeId);

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

    this.updateRoute(routeId, {
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

  private scheduleUpdate() {
    // TODO settimeout
    console.log(this.state)
    this.onChange({...this.state});
  }
}