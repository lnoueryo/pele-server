import * as dotenv from 'dotenv'
import type { PlayerSetting } from './domain/entities/interfaces/player-setting.interface'
dotenv.config()
type Config = {
  playerSetting: PlayerSetting
}
const playerSetting = process.env.PLAYER_SETTING
  ? JSON.parse(process.env.PLAYER_SETTING)
  : {
      x: 0.5,
      y: 0.1,
      width: 0.05,
      height: 0.05,
      vg: 0.0009,
      speed: 0.015,
      jumpStrength: -0.027,
    }

const config: Config = {
  playerSetting,
}
type ConfigEnv = {
  httpApiOrigin: string
  websocketApiOrigin: string
}
type STAGE = 'development' | 'production'

const configEnvs: { [K in STAGE]: ConfigEnv } = {
  development: {
    httpApiOrigin: 'http://localhost:3001',
    websocketApiOrigin: 'ws://localhost:3001',
  },
  production: {
    httpApiOrigin: 'https://pele-server.jounetsism.biz',
    websocketApiOrigin: 'wss://pele-server.jounetsism.biz',
  },
}
const env = (process.env.NODE_ENV || 'development') as STAGE
const envList = ['development', 'production']
if (!envList.includes(env)) {
  throw new Error('invalid STAGE')
}
const configEnv = configEnvs[env]
const output = {
  ...config,
  ...configEnv,
  env,
}
export default output
