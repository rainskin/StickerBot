import {
  ASK_STICKER_TEXT,
  askTitle,
  COPY_ERROR_TEXT,
  copyStickerSet,
  STICKERSET_URL_PREFIX,
} from "./lib.ts"
import * as O from "./observers.ts"

O.start.handler = async (ctx) => {
  ctx.session.state = undefined
  await ctx.reply(ASK_STICKER_TEXT)
}

O.sticker.handler = async (ctx) => {
  const name = ctx.msg.sticker.set_name!
  await askTitle(ctx, name)
}

O.text.handler = async (ctx) => {
  const text = ctx.msg.text
  if (!text.startsWith(STICKERSET_URL_PREFIX)) {
    await ctx.reply(ASK_STICKER_TEXT)
    return
  }
  const name = ctx.msg.text.replace(STICKERSET_URL_PREFIX, "")
  await askTitle(ctx, name)
}

O.title.handler = async (ctx) => {
  try {
    await copyStickerSet(ctx, ctx.msg.text, ctx.session.setName!)
  } catch (e) {
    ctx.session.state = undefined
    await ctx.reply(COPY_ERROR_TEXT)
    console.log(e)
  }
}
