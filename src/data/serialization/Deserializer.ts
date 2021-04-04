import { MockedHandler, MockedServerConfiguration } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DocumentContentTypeMapper } from '../DocumentContentTypeMapper';

export class Deserializer {
  constructor(
    private location: string
  ) {
  }

  public async deserialize(): Promise<MockedServerConfiguration> {
    let state: Partial<MockedServerConfiguration> = await this.readJson('mockingbirb.json');
    state.location = this.location;

    state.events = await this.readJson('events.json');
    state.env = await this.readJson('env.json');

    state.routes = [];
    state.handlers = {};
    state.documents = {};

    for (const routeFile of await fs.readdir(path.join(this.location, 'routes'))) {
      state.routes.push(await this.readJson(path.join('routes', routeFile)));
    }

    for (const handlerFile of await fs.readdir(path.join(this.location, 'handlers'))) {
      const handler: MockedHandler = await this.readJson(path.join('handlers', handlerFile));
      state.handlers[handler.id] = handler;
    }

    const documentMeta = await this.readJson('documents/__meta.json');

    for (const [documentId, document] of Object.entries(documentMeta)) {
      const documentAny = document as any;
      state.documents[documentId] = {
        name: documentAny.name,
        contentType: documentAny.contentType,
        id: documentId,
        content: await this.readText(path.join('documents', documentAny.filename)),
      }
    }

    return state as MockedServerConfiguration;
  }

  private async readJson(location: string) {
    return JSON.parse(await this.readText(location));
  }

  private async readText(location: string) {
    return await fs.readFile(path.join(this.location, location), { encoding: 'utf8' });
  }
}