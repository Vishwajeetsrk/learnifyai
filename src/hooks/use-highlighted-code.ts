export function useHighlightedCode(code: string, _lang?: string): string[] {
  if (!code) return [];
  return code.split("\n");
}
