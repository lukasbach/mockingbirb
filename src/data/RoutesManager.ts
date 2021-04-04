import { MockedRouteConfiguration, MockedServerConfiguration } from './types';
import { MockServer } from './MockServer';
import * as uuid from 'uuid';

export class RoutesManager {
  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer
  ) {
  }


  public createRoute(routeConfig: Omit<MockedRouteConfiguration, 'id'>) {
    const id = uuid.v4();
    this.state.routes.push({...routeConfig, id});
    this.server.scheduleUpdate();
    return id;
  }
  public updateRoute(id: string, routeConfig: Partial<MockedRouteConfiguration>) {
    this.state.routes = this.state.routes.map(r => r.id === id ? {...r, ...routeConfig} : r);
    this.server.scheduleUpdate();
  }
  public deleteRoute(id: string) {
    this.state.routes.splice(this.state.routes.findIndex(r => r.id === id), 1);
    this.server.scheduleUpdate();
  }
  public getRoute(id: string) {
    return this.state.routes.find(r => r.id === id)!;
  }
}