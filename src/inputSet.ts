import { InputFile, InputSticker, Sticker, StickerSet } from "tg"
import { bot } from "./loader.ts"

const MAX_INITIAL_STICKERS = 50

function Hash() {
  return new Date().getTime() % 1000
}

export class InputSet {
  name: string;
  link: string;
  title: string;
  type: "animated" | "video" | "static";
  private stickers: Sticker[];
  stickerIndex = 0;

  constructor(set_title: string, title: string, set: StickerSet, private userId: number) {
    this.name = `${transliterate(title)}_${Hash()}_by_${bot.botInfo.username}`;
    this.title = title + " @anime4_arts";
    this.link = "https://t.me/addstickers/" + this.name;
    this.type = set.is_animated ? "animated" : set.is_video ? "video" : "static";

    // Проверка на "chpic.su" в названии и обновление списка стикеров
    if (set_title.includes("chpic.su")) {
      this.stickers = set.stickers.slice(0, -4);
      console.log("Filtered Stickers (chpic.su):", this.stickers.length);
    } else {
      this.stickers = set.stickers;
      console.log("Original Stickers:", this.stickers.length);
    }
  }

  get stickersTotal() {
    return this.stickers.length;
  }

  async getInitialStickers(): Promise<InputSticker[]> {
    if (this.type == "static") {
      const stickers = this.stickers.slice(0, MAX_INITIAL_STICKERS);
      this.stickerIndex = stickers.length;
      return stickers.map(makeStaticInputSticker);
    }
    this.stickerIndex = 1;
    return [await makeInputSticker(this.stickers[0])];
  }

  async createInitialSet() {
    await bot.api.createNewStickerSet(
      this.userId,
      this.name,
      this.title,
      await this.getInitialStickers(),
      this.type,
    );
  }

  async addNextSticker() {
    if (this.stickerIndex < this.stickers.length) {
      const s = this.stickers[this.stickerIndex];
      this.stickerIndex += 1;
      let inputSticker;
      console.log('aaa')
      if (this.type == "static") inputSticker = makeStaticInputSticker(s);
      else inputSticker = await makeInputSticker(s);
      await bot.api.addStickerToSet(this.userId, this.name, inputSticker);
    }
  }
}

async function makeInputSticker(s: Sticker): Promise<InputSticker> {
  const f = await bot.api.getFile(s.file_id);
  const url = `https://api.telegram.org/file/bot${bot.token}/${f.file_path}`;
  const inputFile = new InputFile({ url });
  return { sticker: inputFile, emoji_list: [s.emoji!] };
}

function makeStaticInputSticker(s: Sticker) {
  return { sticker: s.file_id, emoji_list: [s.emoji!] };
}

const transliterationMap: Record<string, string> = {
  "а": "a",
  "б": "b",
  "в": "v",
  "г": "g",
  "д": "d",
  "е": "e",
  "ё": "yo",
  "ж": "zh",
  "з": "z",
  "и": "i",
  "й": "i",
  "к": "k",
  "л": "l",
  "м": "m",
  "н": "n",
  "о": "o",
  "п": "p",
  "р": "r",
  "с": "s",
  "т": "t",
  "у": "u",
  "ф": "f",
  "х": "h",
  "ц": "ts",
  "ч": "ch",
  "ш": "sh",
  "щ": "sch",
  "ъ": "'",
  "ы": "i",
  "ь": "'",
  "э": "e",
  "ю": "yu",
  "я": "ya",
}

function transliterate(text: string) {
  const letters = text.toLowerCase().split("").map((char) =>
    transliterationMap[char] || char
  );
  return letters.join("").replace(/\W/g, "");
}
