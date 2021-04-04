import * as React from 'react';
import { useTheme } from './layout/ThemeProvider';
import { Tag } from './layout/Tag';

export const MethodTag: React.FC<{
  method: string;
}> = props => {
  const theme = useTheme();
  const methodLower = props.method.toLowerCase();
  const color = methodLower in theme.colors.httpMethod ? (theme.colors.httpMethod as any)[methodLower] : theme.colors.httpMethod.default;

  return (
    <Tag background={color}>
      { props.method.toUpperCase() }
    </Tag>
  );
};
