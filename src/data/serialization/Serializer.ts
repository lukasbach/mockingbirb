import { MockedServerConfiguration } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DocumentContentTypeMapper } from '../DocumentContentTypeMapper';

export class Serializer {
  constructor(private state: MockedServerConfiguration) {
  }

  public async serialize() {
    await fs.remove(this.state.location);

    await fs.ensureDir(this.state.location);
    await fs.ensureDir(path.join(this.state.location, 'routes'));
    await fs.ensureDir(path.join(this.state.location, 'documents'));
    await fs.ensureDir(path.join(this.state.location, 'handlers'));

    await this.writeJson('mockingbirb.json', {
      id: this.state.id,
      name: this.state.name,
      port: this.state.port,
      color: this.state.color,
      initials: this.state.initials,
    });
    await this.writeJson('env.json', this.state.env);
    await this.writeJson('events.json', this.state.events);
    await fs.writeFile(
      path.join(this.state.location, '.gitignore'),
      'events.json',
      { encoding: 'utf8' },
    );

    for (const route of this.state.routes) {
      await this.writeJson(`routes/${route.id}.json`, route);
    }

    for (const handler of Object.values(this.state.handlers)) {
      await this.writeJson(`handlers/${handler.id}.json`, handler);
    }

    let docMeta: any = {};
    for (const document of Object.values(this.state.documents)) {
      const filename = `${document.id}.${DocumentContentTypeMapper.Instance.getExtensionFromMime(document.contentType) ?? 'txt'}`;
      await fs.writeFile(
        path.join(this.state.location, `documents/${filename}`),
        document.content,
        { encoding: 'utf8' },
      );
      docMeta[document.id] = { contentType: document.contentType, name: document.name, filename };
    }

    await this.writeJson(
      'documents/__meta.json',
      docMeta,
    );
  }

  private async writeJson(location: string, json: any) {
    await fs.writeFile(
      path.join(this.state.location, location),
      JSON.stringify(json, null, 2),
      { encoding: 'utf8' },
    );
  }
}