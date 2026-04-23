export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key: string) => {
    if (!(key in vars)) {
      throw new Error(`fillTemplate: missing variable "${key}"`);
    }
    return vars[key] ?? "";
  });
}
