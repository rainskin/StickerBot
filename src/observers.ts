import { observer as o } from "./loader.ts"

// Pay attention to order
const start = o.command("start")
const sticker = o.sticker()
const title = o.text().state("title")
const text = o.text()

export { start, sticker, text, title }
