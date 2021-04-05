import { RequestData } from './RequestData';
declare function run(handler: (request: RequestData) => void | Promise<void>): void;