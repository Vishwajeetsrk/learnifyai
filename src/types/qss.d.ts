declare module "qss" {
  export function encode(obj: Record<string, any>, prefix?: string): string;
  export function decode(str: string, pfx?: string): Record<string, any>;
}
