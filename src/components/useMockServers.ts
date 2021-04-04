import { useEffect, useRef, useState } from 'react';
import { MockedServerConfiguration, ServerListItem } from '../data/types';
import { defaultMockServerState, MockServer } from '../data/MockServer';
import { remote } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { Deserializer } from '../data/serialization/Deserializer';
import { Serializer } from '../data/serialization/Serializer';

const appDataPath = path.join(remote.app.getPath('appData'), 'mockingbirb');
const serversFile = path.join(appDataPath, 'birbfile');

export const useMockServers = () => {
  const [state, setState] = useState<MockedServerConfiguration>();
  const [serverList, setServerList] = useState<ServerListItem[]>();
  const servers = useRef<{ [serverId: string]: MockServer }>({});

  const updateServersFile = async (servers: string[]) => {
    await fs.writeJson(serversFile, servers);
  };

  const createServer = async () => {
    const result = await remote.dialog.showOpenDialog({
      buttonLabel: 'Create',
      properties: ['createDirectory', 'openDirectory'],
      title: 'Choose a folder',
    });
    if (result.canceled || !result.filePaths[0]) return;
    await new Serializer({...defaultMockServerState, location: result.filePaths[0]}).serialize();
    await updateServersFile([...(serverList ?? []).map(server => server.location), result.filePaths[0]]);
    await reloadServers();
  };

  const selectServer = (id: string) => {
    if (state) {
      servers.current[state.id].setUpdateHandler(() => {});
    }
    const server = servers.current[id];
    setState(server.getState());
    server.setUpdateHandler(setState);
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
    } else {
      await createServer();
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
    server: state?.id ? servers.current[state?.id] : undefined,
    createServer,
  }
}