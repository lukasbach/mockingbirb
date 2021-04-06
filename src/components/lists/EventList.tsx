import * as React from 'react';
import { Box } from '../ui/Box';
import { useApp } from '../AppRoot';
import { Card } from '../ui/Card';
import { InputGroup } from '../ui/form/InputGroup';
import { TextInput } from '../ui/form/TextInput';
import { MethodTag } from '../ui/MethodTag';
import { useTheme } from '../ui/layout/ThemeProvider';
import { Button } from '../ui/Button';
import { useMemo, useState } from 'react';
import { LabelText } from '../ui/form/LabelText';
import ago from 's-ago';
import { BottomBorderItem } from '../BottomBorderItem';
import { Tooltip } from '../ui/overlay/Tooltip';

export const EventList: React.FC<{
  filter?: {
    handler?: string;
    route?: string;
  };
  wide?: boolean;
}> = props => {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const theme = useTheme();

  const events = useMemo(() => {
    return state.events
      .filter(e => {
        if (props.filter) {
          if (props.filter.handler && !e.handlers.includes(props.filter.handler)) {
            return false;
          }

          if (props.filter.route && e.route !== props.filter.route) {
            return false;
          }
        }

        if (search.length > 0) {
          if (!`${e.route} ${e.responseStatus} ${e.requestMethod}`.toLowerCase().includes(search.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .reverse();
  }, [props.filter, state.events, state.events.length, search]);

  return (
    <Box>
      <Card>
        <InputGroup>
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeValue={setSearch}
          />
        </InputGroup>

        {events.map((event, idx) => {
          const isLast = idx === Object.keys(events).length - 1;
          let item = (
            <BottomBorderItem
              hasBorder={!isLast}
              key={event.date}
            >
              <Button minimal={true} embedded={true} fill={true} borderRadius={isLast ? 'bl br' : undefined}>
                <Box
                  display="flex"
                  fontWeight="bold"
                  alignItems="center"
                  flexWrap="wrap"
                  width="100%"
                >
                  <Box marginRight="6px">
                    <MethodTag method={event.requestMethod} />
                  </Box>
                  <Box
                    flex="1"
                    textAlign="left"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    color={theme.colors.muted}
                  >
                    {event.path}
                  </Box>
                  {props.wide && (
                    <Box marginLeft="10px" color={theme.colors.muted} fontWeight="normal">
                      { ago(new Date(event.date)) }
                    </Box>
                  )}
                  <Box marginLeft="10px" color={event.responseStatus === 200 ? theme.colors.green : theme.colors.red}>
                    { event.responseStatus }
                  </Box>
                </Box>
              </Button>
            </BottomBorderItem>
          );

          if (props.wide) {
            return item;
          } else {
            return (
              <Tooltip
                key={event.date + '_tooltip'}
                fill={true}
                content={(
                  <>
                    <Box fontWeight="bold">{ago(new Date(event.date))}</Box>
                    <Box color={theme.colors.muted}>{new Date(event.date).toLocaleString()}</Box>
                  </>
                )}
                positions={['left', 'right']}
              >
                {item}
              </Tooltip>
            )
          }
        })}

        {events.length === 0 && (
          <Box>
            <LabelText>
              {state.events.length === 0 ? 'No events stored' : 'Search does not match any events'}
            </LabelText>
          </Box>
        )}
      </Card>
    </Box>
  );
};
