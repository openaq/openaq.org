import { execSync } from "child_process";

import { execSync } from "child_process";
import path from "path";

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    
    try {
      const gitRoot = execSync('git rev-parse --show-toplevel')
        .toString()
        .trim();
      
      const relativePath = path.relative(gitRoot, filepath);
      
      const result = execSync(
        `git log -1 --follow --pretty="format:%cI" -- "${relativePath}"`,
        { encoding: 'utf8' }
      );
      
      if (result) {
        file.data.astro.frontmatter.lastModified = result.trim();
      }
    } catch (error) {
      console.warn(`Could not get git date for ${filepath}:`, error.message);
      file.data.astro.frontmatter.lastModified = new Date().toISOString();
    }
  };
}