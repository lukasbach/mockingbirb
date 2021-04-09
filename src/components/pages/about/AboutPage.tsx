import * as React from 'react';
import { AppContainer } from '../../ui/layout/AppContainer';
import { AppHeader } from '../../header/AppHeader';
import { ServerList } from '../../serverlist/ServerList';
import { Heading } from '../../ui/Heading';
import { Card } from '../../ui/Card';
import { Box } from '../../ui/Box';
import { useTheme } from '../../ui/layout/ThemeProvider';
import packageJson from '../../../../package.json';
import { Padded } from '../../ui/Padded';
import { remote } from 'electron';
import { BorderRadiusShorthand, getBorderRadii } from '../../ui/borderRadiusShorthand';
import { BottomBorderItem } from '../../BottomBorderItem';
import { Button } from '../../ui/Button';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Campaign } from '@lukasbach/campaigns-react';

const AdButton: React.FC<{
  href: string;
  first?: boolean;
  last?: boolean;
  icon?: IconProp;
}> = props => (
  <BottomBorderItem hasBorder={!props.last}>
    <Button
      borderRadius={((props.first ? 'tl tr' : '') + (props.last ? 'bl br' : '')) as any}
      embedded={true}
      minimal={true}
      fill={true}
      onClick={() => remote.shell.openExternal(props.href)}
      icon={props.icon}
      alignLeft={true}
    >
      {props.children}
    </Button>
  </BottomBorderItem>
);

export const AboutPage: React.FC<{}> = props => {
  const theme = useTheme();

  return (
    <AppContainer
      title={(
        <AppHeader headerText="About Mockingbirb" />
      )}
      left={<ServerList />}
    >
      <Heading level={1}>
        About Mockingbirb
      </Heading>

      <Card>
        <Box display="flex">
          <Box width="200px" backgroundColor={theme.colors.background3} borderTopLeftRadius={theme.radius}>
            <Padded>
              Mockingbirb Version
            </Padded>
          </Box>
          <Box flexGrow={1}>
            <Padded>
              { packageJson.version }
            </Padded>
          </Box>
        </Box>

        <Box display="flex">
          <Box width="200px" backgroundColor={theme.colors.background3} borderBottomLeftRadius={theme.radius}>
            <Padded>
              Developed by
            </Padded>
          </Box>
          <Box flexGrow={1}>
            <Padded>
              Lukas Bach
              (<Box
                as="a"
                cursor="pointer"
                color={theme.colors.primary}
                textDecoration="underline"
                hover={{ color: theme.colors.text }}
                elProps={{
                  onClick: () => remote.shell.openExternal('https://lukasbach.com')
                }}
              >
                lukasbach.com
              </Box>)
            </Padded>
          </Box>
        </Box>
      </Card>

      <Heading level={1}>
        Related Links
      </Heading>

      <Card>
        <AdButton href="https://github.com/lukasbach/mockingbirb" icon={['fab', 'github']} first={true}>Github Repository</AdButton>
        <AdButton href="https://github.com/lukasbach/mockingbirb/issues" icon="bug" last={true}>Bug Tracker</AdButton>
      </Card>

      <Heading level={1}>
        Other Projects
      </Heading>

      <Card>
        <Campaign render={(_, all) => (
          <>
            {all.sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1)).map((campaign, idx) => (
              <AdButton key={campaign.key} href={campaign.url} icon="link" first={idx === 0} last={idx === all.length - 1}>
                {campaign.product}: {campaign.short}
              </AdButton>
            ))}
          </>
        )} dontRenderIfLoading={true} changeInterval={999999} />
      </Card>
    </AppContainer>
  );
};

