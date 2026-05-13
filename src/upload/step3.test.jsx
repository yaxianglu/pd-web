import fs from 'fs';
import path from 'path';

describe('Step3 regression', () => {
  test('does not include the step-4 record prefetch helper', () => {
    const filePath = path.join(__dirname, 'step3.jsx');
    const source = fs.readFileSync(filePath, 'utf8');

    expect(source).not.toContain("import { ensureSmileTestRecord } from './ensureSmileTestRecord';");
    expect(source).not.toContain('ensureTestRecordReady');
  });
});
