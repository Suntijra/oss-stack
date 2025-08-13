import { mkdir, writeFile } from 'fs/promises';

export async function writePlaybookFile(filePath: string, contents: string): Promise<void> {
  await mkdir('playbooks', { recursive: true });
  await writeFile(filePath, contents);
}
