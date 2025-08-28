import { ulid } from 'ulid'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function generateSlug(title: string): string {
  const base = slugify(title).slice(0, 32)
  const suffix = ulid().slice(0, 8)
  return `${base}-${suffix}`
}


