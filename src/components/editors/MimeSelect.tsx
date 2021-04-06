import * as React from 'react';
import { SearchSelect } from '../ui/form/SearchSelect';
import { DocumentContentTypeMapper } from '../../data/DocumentContentTypeMapper';

export const MimeSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = props => {
  return (
    <SearchSelect
      options={DocumentContentTypeMapper.Instance.types.map(type => ({ value: type[0], title: `${type[0]} (*.${type[1]})` }))}
      value={props.value}
      onChange={props.onChange}
      onCreate={props.onChange}
      fill={true}
    />
  );
};
