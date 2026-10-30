import * as fs from 'fs/promises'
import * as path from 'path'

export class AtomicFileStorage<T> {
  private filePath: string
  private isWriting = false
  private queue: (() => Promise<void>)[] = []

  constructor(filePath: string) {
    this.filePath = filePath
  }

  async read(fallbackDefault: T): Promise<T> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8')
      return JSON.parse(data) as T
    } catch (err: unknown) {
      const error = err as NodeJS.ErrnoException
      if (error.code === 'ENOENT') {
        await this.write(fallbackDefault)
        return fallbackDefault
      }
      // If corrupted, fallback safely
      return fallbackDefault
    }
  }

  async write(data: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const dir = path.dirname(this.filePath)
          await fs.mkdir(dir, { recursive: true })

          const tempPath = `${this.filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}`
          const jsonContent = JSON.stringify(data, null, 2)

          await fs.writeFile(tempPath, jsonContent, 'utf-8')
          await fs.rename(tempPath, this.filePath)
          resolve()
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue(): Promise<void> {
    if (this.isWriting || this.queue.length === 0) {
      return
    }

    this.isWriting = true
    const nextTask = this.queue.shift()

    if (nextTask) {
      try {
        await nextTask()
      } finally {
        this.isWriting = false
        this.processQueue()
      }
    } else {
      this.isWriting = false
    }
  }
}
