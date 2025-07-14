class Tools {
  getAssetsFile(path: string): string {
    if (!path) {
      throw new Error('Path cannot be empty')
    }
    const fullPath = `/src/assets/${path}`
    return new URL(fullPath, import.meta.url).href
  }
}

export default new Tools()
