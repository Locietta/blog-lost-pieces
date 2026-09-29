/// Node-side helpers shared by the site config and route loaders

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export const pageSize = 6

const postsDir = path.resolve(import.meta.dirname, '../pages/posts')

function readPosts() {
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      file,
      frontmatter: matter(fs.readFileSync(path.join(postsDir, file), 'utf-8')).data,
    }))
}

/// Posts with `draft: true` are hidden from post lists, and left out of production builds.
export function draftPosts(): string[] {
  return readPosts()
    .filter((post) => post.frontmatter.draft)
    .map((post) => `posts/${post.file}`)
}

export function listedPostCount(): number {
  return readPosts().filter((post) => !post.frontmatter.draft).length
}
