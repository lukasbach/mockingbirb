import { MockDocument, MockedServerConfiguration } from './types';
import { MockServer } from './MockServer';
import * as uuid from 'uuid';
import { trackEvent } from '../analytics';

export class DocumentManager {
  constructor(
    private state: MockedServerConfiguration,
    private server: MockServer
  ) {
  }

  public createDocument(document: Omit<MockDocument, 'id'>) {
    const id = uuid.v4();
    this.state.documents[id] = {...document, id};
    this.server.scheduleUpdate();
    trackEvent('documents_create');
    return id;
  }
  public updateDocument(id: string, document: Partial<MockDocument>) {
    if (document.id && id !== document.id) {
      delete this.state.documents[id];
    }
    this.state.documents[document.id ?? id] = {...this.state.documents[id], ...document};
    this.server.scheduleUpdate();
    trackEvent('documents_update');
  }
  public deleteDocument(id: string) {
    delete this.state.documents[id];
    this.server.scheduleUpdate();
    trackEvent('documents_delete');
  }


}