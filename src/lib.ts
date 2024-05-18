import { InputSet } from "./inputSet.ts"
import { MyContext, State } from "./loader.ts"

export const ASK_STICKER_TEXT = "Отправь мне стикер или ссылку на стикерпак"
export const ASK_TITLE_TEXT = "Отправь название стикерпака"
export const STICKERSET_URL_PREFIX = "https://t.me/addstickers/"
export const COPY_ERROR_TEXT =
  "Ошибка, возможно, этот стикерпак невозможно скопировать из-за большого размера некоторых стикеров"

export async function askTitle(ctx: MyContext, setName: string) {
  ctx.session.setName = setName
  setState(ctx, "title")
  await ctx.reply(ASK_TITLE_TEXT)
}

export const setState = (ctx: MyContext, state: State) =>
  ctx.session.state = state

export async function copyStickerSet(
  ctx: MyContext,
  title: string,
  setName: string,
) {
  const set = await ctx.api.getStickerSet(setName)
  const set_title = set.title
  console.log('имя пака', set_title)
  const inputSet = new InputSet(set_title, title, set, ctx.from!.id)
  await inputSet.createInitialSet()
  await ctx.reply(inputSet.link)
  const msg = await ctx.reply(ProgressText(inputSet))
  while (inputSet.stickerIndex < inputSet.stickersTotal) {
    await inputSet.addNextSticker()
    await ctx.api.editMessageText(
      msg.chat.id,
      msg.message_id,
      ProgressText(inputSet),
    )
  }
}

function ProgressText(s: InputSet) {
  return `Прогресс ${s.stickerIndex}/${s.stickersTotal}`
}
