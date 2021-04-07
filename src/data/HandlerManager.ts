import {
  MockedHandler,
  MockedHandlerDocumentRepeater, MockedHandlerLogic,
  MockedHandlerSmartDocumentRepeater,
  MockedServerConfiguration,
} from './types';
import { MockServer } from './MockServer';
import * as uuid from 'uuid';
import { defaultCodeImplementation } from './defaultCodeImplementation';

export class HandlerManager {
  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer
  ) {
  }

  public createHandler(handler: Omit<MockedHandler, 'id'>) {
    const id = uuid.v4();
    this.state.handlers[id] = {...handler, id};
    this.server.scheduleUpdate();
    return id;
  }
  public updateHandler(id: string, handler: Partial<MockedHandler>) {
    if (handler.id && id !== handler.id) {
      delete this.state.handlers[id];
    }
    this.state.handlers[handler.id ?? id] = {...this.state.handlers[id], ...handler};
    this.server.scheduleUpdate();
  }
  public deleteHandler(id: string) {
    delete this.state.handlers[id];
    for (const route of this.state.routes) {
      if (route.handlers.includes(id)) {
        route.handlers = route.handlers.filter(handlerId => handlerId !== id);
      }
    }
    this.server.scheduleUpdate();
  }
  public initializeNewHandlerFor(routeId: string | undefined, handlerType: string) {
    let handlerId;
    const routeConfig = routeId ? this.server.routes.getRoute(routeId) : undefined;
    const getName = (handlerType: string) => routeConfig ? `${handlerType} for ${routeConfig.route}` : `New ${handlerType}`;

    switch (handlerType) {
      case 'repeater':
        handlerId = this.createHandler({
          type: 'repeater',
          name: getName('Document Repeater'),
          documentId: '',
          status: 200,
        } as Omit<MockedHandlerDocumentRepeater, 'id'>);
        break;
      case 'smartrepeater':
        handlerId = this.createHandler({
          type: 'smartrepeater',
          name: getName('Smart Document Repeater'),
          documents: [],
        } as Omit<MockedHandlerSmartDocumentRepeater, 'id'>);
        break;
      case 'logic':
        handlerId = this.createHandler({
          type: 'logic',
          name: getName('Logic Handler'),
          code: defaultCodeImplementation,
          status: 200,
        } as Omit<MockedHandlerLogic, 'id'>);
        break;
      default:
        throw Error(`Unknown handler type ${handlerType}`);
    }

    if (routeConfig && routeId) {
      this.server.routes.updateRoute(routeId, {
        handlers: [...routeConfig.handlers, handlerId]
      });
    }
  }
}