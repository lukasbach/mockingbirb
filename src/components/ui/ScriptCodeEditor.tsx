import * as React from 'react';
import { CodeEditor, CodeEditorProps } from './CodeEditor';
import path from 'path';
import { remote } from 'electron';
import fs from 'fs';

const resourcesDir = (
  process.env.NODE_ENV === 'development'
    ? path.join(path.normalize(remote.app.getAppPath()).split(path.sep).slice(0, -1).join(path.sep), 'resources')
    : path.join(remote.app.getAppPath(), 'resources')
  // : path.join(path.dirname(remote.process.execPath), 'resources')
);

let scriptTypes = '';

try {
  scriptTypes = fs.readFileSync(path.join(resourcesDir, 'scripttypes.d.ts'), { encoding: 'utf8' });
} catch(e) {
  console.error('Could not find resources/scripttypes.d.ts. If you are in dev mode, did you run ``yarn prepare:scripttypes``?')
}

export const ScriptCodeEditor: React.FC<{
  returnType?: string;
} & CodeEditorProps> = props => {
  const returnType = props.returnType ?? 'void';

  return (
    <CodeEditor
      {...props}
      onMount={(editor, monaco) => {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false
        });
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ESNext,
          allowNonTsExtensions: true,
        });

        const libUri = `inmemory://model/global_${returnType}.d.ts`;

        monaco.editor.getModel(monaco.Uri.parse(libUri))?.dispose();

        let libSource = scriptTypes; //.replace(/contextTypes/g, 'mockingbirb');
        libSource += `\n\ndeclare module 'mockingbirb' {\n`;
        libSource += `  import { RequestData } from 'RequestData';\n`;
        libSource += `  declare function run(handler: (request: RequestData) => ${returnType} | Promise<${returnType}>): void;\n`;
        libSource += `}\n`;
        monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
        monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));

        props.onMount?.(editor, monaco);
      }}
    />
  );
};
