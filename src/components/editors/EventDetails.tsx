import * as React from 'react';
import { Box } from '../ui/Box';
import { MethodTag } from '../ui/MethodTag';
import { Heading } from '../ui/Heading';
import { useApp } from '../AppRoot';
import { useTheme } from '../ui/layout/ThemeProvider';
import { Card } from '../ui/Card';
import ago from 's-ago';
import { LabelText } from '../ui/form/LabelText';
import { InputGroup } from '../ui/form/InputGroup';
import { TextInput } from '../ui/form/TextInput';
import { Button } from '../ui/Button';
import { useMemo } from 'react';
import { Padded } from '../ui/Padded';
import { BottomBorderItem } from '../BottomBorderItem';
import { ResponseStatus } from '../ui/ResponseStatus';
import { Link } from 'react-router-dom';

const HeaderCard: React.FC<{
  headers: object,
  headerCount: number
}> = ({ headers, headerCount }) => {
  const theme = useTheme();
  return (
    <Card>
      {Object.entries(headers).map(([header, value], idx) => (
        <BottomBorderItem hasBorder={idx !== headerCount - 1}>
          <Box display="flex">
            <Box
              width="300px"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              padding={theme.contentPadding}
            >
              {header}
            </Box>
            <Box flexGrow={1}>
              <InputGroup
                borderRadius={idx === 0 ? 'tr' : idx === headerCount - 1 ? 'br' : undefined}
              >
                <TextInput
                  value={value}
                  readOnly={true}
                />
              </InputGroup>
            </Box>
          </Box>
        </BottomBorderItem>
      ))}
    </Card>
  );
}

export const EventDetails: React.FC<{
  eventId: number;
}> = props => {
  const theme = useTheme();
  const { state } = useApp();
  const event = state.events[props.eventId];
  if (!event) return null;
  const responseDocument = event.responseDocumentId ? state.documents[event.responseDocumentId] : undefined;
  const requestHeaderCount = Object.keys(event.requestHeaders).length;
  const responseHeaderCount = Object.keys(event.responseHeaders).length;

  return (
    <Box>
      <Heading level={1}>
        <Box
          display="flex"
          fontWeight="bold"
          alignItems="center"
          flexWrap="wrap"
          width="100%"
          color={theme.colors.text}
        >
          <Box marginRight="6px" display="flex">
            <MethodTag method={event.requestMethod} />
          </Box>
          <Box
            flex="1"
            textAlign="left"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {event.path}
          </Box>
        </Box>
      </Heading>

      <Box as="p">
        {ago(new Date(event.date))}
      </Box>

      <Card>
        <label>
          <LabelText>Date</LabelText>
          <InputGroup>
            <TextInput value={new Date(event.date).toLocaleString()} readOnly={true} />
          </InputGroup>
        </label>

        <label>
          <LabelText>Route</LabelText>
          <InputGroup>
            <TextInput value={event.route} readOnly={true} />
          </InputGroup>
        </label>

        <label>
          <LabelText>Exact path</LabelText>
          <InputGroup>
            <TextInput value={event.path} readOnly={true} />
          </InputGroup>
        </label>

        <label>
          <LabelText>Method</LabelText>
          <InputGroup>
            <Padded>
              <MethodTag method={event.requestMethod} />
            </Padded>
          </InputGroup>
        </label>

        <label>
          <LabelText>Response Status</LabelText>
          <InputGroup borderRadius={responseDocument ? undefined : 'bl br'}>
            <Padded>
              <Box fontWeight="bold">
                <ResponseStatus status={event.responseStatus} />
              </Box>
            </Padded>
          </InputGroup>
        </label>

        {responseDocument && (
          <>
            <BottomBorderItem hasBorder={true}>
              <LabelText>Returned Document</LabelText>
            </BottomBorderItem>
            <Link to={`/documents/${responseDocument.id}`}>
              <Button
                borderRadius={!responseDocument ? undefined : 'bl br'}
                embedded={true}
                fill={true}
                minimal={true}
              >
                {responseDocument.name}
              </Button>
            </Link>
          </>
        )}
      </Card>

      <Heading level={2}>Request</Heading>

      <Heading level={3}>Request Headers</Heading>
      <HeaderCard headers={event.requestHeaders} headerCount={requestHeaderCount} />

      <Heading level={3}>Request Body</Heading>
      <Card>
        <Padded>
          <pre>{JSON.stringify(event.requestBody, null, 2)}</pre>
        </Padded>
      </Card>

      <Heading level={2}>Response</Heading>

      {responseDocument && (
        <>
          <Heading level={3}>Response Document</Heading>
          <Box as="p">A Mock-Document handler handled this request and returned the following document:</Box>
          <Link to={`/documents/${responseDocument.id}`}>
            <Button>
              {responseDocument.name}
            </Button>
          </Link>
        </>
      )}

      <Heading level={3}>Response Headers</Heading>
      <HeaderCard headers={event.responseHeaders} headerCount={responseHeaderCount} />

      <Heading level={3}>Response Body</Heading>
      <Card>
        <Padded>
          <pre>{JSON.stringify(event.responseBody, null, 2)}</pre>
        </Padded>
      </Card>

      <Heading level={3}>Handlers</Heading>
      <Box as="p">The following handlers acted on this request.</Box>
      <Card>
        {event.handlers.map((handlerId, idx) => (
          <BottomBorderItem hasBorder={idx !== event.handlers.length - 1} key={handlerId}>
            <Padded>{state.handlers[handlerId].name}</Padded>
          </BottomBorderItem>
        ))}
      </Card>
    </Box>
  );
};
