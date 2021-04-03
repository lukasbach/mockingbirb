export class DocumentContentTypeMapper {
  public static readonly Instance = new DocumentContentTypeMapper();

  public readonly types: Array<[string, string]> = [
    ['application/json', 'json'],
    ['text/javascript', 'js'],
    ['text/css', 'css'],
    ['text/html', 'html'],
    ['text/plain', 'txt'],
    ['text/javascript', 'js'],
  ];

  public getMimeFromExtension(extension: string) {
    return this.types.find(type => type[1] === extension)?.[0];
  }

  public getExtensionFromMime(mime: string) {
    return this.types.find(type => type[0] === mime)?.[1];
  }

  public getMimes() {
    return this.types.map(type => type[0]);
  }

  public getExtensions() {
    return this.types.map(type => type[1]);
  }
}