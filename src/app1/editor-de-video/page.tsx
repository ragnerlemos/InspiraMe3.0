
import { Suspense } from 'react';
import Editor from './editor';
import Loading from './loading';

export default function EditorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Editor />
    </Suspense>
  );
}
