import * as dotenv from 'dotenv'
import type { PlayerSetting } from './domain/entities/interfaces/player-setting.interface'
import { BoxSetting } from './domain/entities/box.entity'
import { ComputerSetting } from './domain/entities/computer.entiry'
dotenv.config()
type Config = {
  playerSetting: PlayerSetting
  boxSetting: BoxSetting
  computerSetting: ComputerSetting[]
}
const playerSetting = process.env.PLAYER_SETTING
  ? JSON.parse(process.env.PLAYER_SETTING)
  : {
      x: 0.5,
      y: 0.1,
      width: 0.05,
      height: 0.05,
      vg: 2,
      speed: 1.1,
      jumpStrength: -1.1,
    }
const boxSetting = process.env.BOX_SETTING
  ? JSON.parse(process.env.BOX_SETTING)
  : {
      moveYProbability: 0.1,
      yMoveScale: 0.15,
      startPosition: 0.75,
      speedSalt: 0.75,
      minSpeed: 0.3,
      maxSpeed: 0.6,
    }
const computerSetting: ComputerSetting[] = [
  {
    id: 'VKCEUhKF8J',
    name: '1st CPU',
    mode: 'nearest',
    color: `rgb(0,0,255)`,
  },
  {
    id: '0f1E7KLL3u',
    name: '2nd CPU',
    mode: 'fastest',
    color: `rgb(255,0,0)`,
  },
  {
    id: 'nnltC0odY7',
    name: '3rd CPU',
    mode: 'slowest',
    color: `rgb(0,255,0)`,
  },
  {
    id: 'dM7L1x5Yr8',
    name: '4th CPU',
    mode: 'highest',
    color: `rgb(255,255,0)`,
  },
]
const config: Config = {
  playerSetting,
  boxSetting,
  computerSetting,
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
