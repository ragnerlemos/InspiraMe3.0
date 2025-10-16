
import { Suspense } from 'react';
import Editor from './editor';
import Loading from './loading';
import { EditorProvider } from './contexts/editor-context';
import { EditorHeader } from '../cabecalho-app';

export default function EditorPage() {
  return (
    <EditorProvider>
        <div className="flex flex-col h-full">
            <EditorHeader />
            <div className="flex-1 flex flex-col min-h-0">
                <Suspense fallback={<Loading />}>
                    <Editor />
                </Suspense>
            </div>
        </div>
    </EditorProvider>
  );
}
