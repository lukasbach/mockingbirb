import { MockedServerConfiguration } from '../../../data/types';

export type NewServerConfig = Pick<MockedServerConfiguration, 'location' | 'name' | 'initials' | 'port'>;