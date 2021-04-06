import { useEffect, useRef, useState } from 'react';
import { MockedServerConfiguration, ServerListItem } from '../data/types';
import { defaultMockServerState, MockServer } from '../data/MockServer';
import { remote } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { Deserializer } from '../data/serialization/Deserializer';
import { Serializer } from '../data/serialization/Serializer';
import { NewServerConfig } from './pages/createServer/NewServerConfig';
import * as uuid from 'uuid';
import { View } from './AppRoot';

const appDataPath = path.join(remote.app.getPath('appData'), 'mockingbirb');
const serversFile = path.join(appDataPath, 'birbfile');

export const useMockServers = (setView: (view?: View) => void) => {
  const [state, setState] = useState<MockedServerConfiguration>();
  const [serverList, setServerList] = useState<ServerListItem[]>();
  const servers = useRef<{ [serverId: string]: MockServer }>({});

  const updateServersFile = async (servers: string[]) => {
    await fs.writeJson(serversFile, servers);
  };

  const selectServer = (id: string) => {
    if (state) {
      servers.current[state.id].setUpdateHandler(() => {});
    }
    const server = servers.current[id];
    setState(server.getState());
    server.setUpdateHandler(setState);
    setView(undefined);
  };

  const createServer = async (config: NewServerConfig) => {
    const id = uuid.v4();
    await new Serializer({...defaultMockServerState, ...config, id}).serialize();
    await updateServersFile([...(serverList ?? []).map(server => server.location), config.location]);
    await reloadServers();
    selectServer(id);
  };

  const addServer = async (location: string) => {
    await updateServersFile([...(serverList ?? []).map(server => server.location), location]);
    await reloadServers();
    setTimeout(() => {
      if (serverList) {
        setServerList(serverList => {
          if (serverList) {
            selectServer(serverList[serverList.length - 1].id);
          }
          return serverList;
          // Super ugly way to get current reference to serverList
        })
      }
    });
  };

  const removeServer = async (id: string) => {
    await updateServersFile((serverList ?? []).filter(server => server.id !== id).map(server => server.location));
    await reloadServers();
    setTimeout(() => {
      if (serverList) {
        selectServer(serverList[0].id);
      }
    });
  };

  const deleteServer = async (id: string) => {
    const server = serverList?.find(server => server.id === id);

    if (server) {
      await removeServer(id);
      await fs.remove(server.location);
    }
  };

  const reloadServers = async () => {
    const list: ServerListItem[] = [];
    const serverLocations: string[] = await fs.readJson(serversFile);

    for (const serverLocation of serverLocations) {
      const server = await new Deserializer(serverLocation).deserialize();
      servers.current[server.id] = new MockServer(server, () => {});
      list.push({
        id: server.id,
        name: server.name,
        initials: server.initials,
        color: server.color,
        location: server.location,
        running: false,
      });
    }

    setServerList(list);

    if (serverLocations.length > 0) {
      selectServer(list[0].id);
    }
  };

  useEffect(() => {
    (async () => {
      await fs.ensureDir(appDataPath);

      if (!fs.existsSync(serversFile)) {
        await fs.writeJson(serversFile, []);
      }
      await reloadServers();
    })();
  }, []);

  return {
    state,
    setState,
    serverList: serverList ?? [],
    selectServer,
    removeServer,
    deleteServer,
    server: state?.id ? servers.current[state?.id] : undefined,
    createServer,
    addServer,
  }
}