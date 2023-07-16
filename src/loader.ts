import env from "env"
import { BaseContext, BaseSession, Bot, Observer } from "my_grammy"

type Command = "start"
type State = "title"
type MySession = BaseSession & { setName?: string }
type MyContext = BaseContext<MySession>
type MyObserver = Observer<MyContext, Command, State>

const TOKEN = env.str("TOKEN")
const bot = new Bot(TOKEN, {})
const observer: MyObserver = new Observer(bot)

export { bot, observer }
export type { MyContext, MyObserver, State }
