// Builds the public URL of a file stored in Cloudflare R2. The storage plugin
// passes the configured prefix with any trailing slash stripped, so the
// separator between prefix and filename must be added here.
export function r2FileUrl(publicUrl: string, prefix: string, filename: string): string {
  const base = publicUrl.replace(/\/$/, '')
  const prefixed = prefix ? `${prefix.replace(/\/$/, '')}/` : ''
  return `${base}/${prefixed}${filename}`
}
