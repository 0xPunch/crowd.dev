import { AddActivitiesSingle } from './messageTypes'
import { Channels } from './regularTypes'

export type IntegrationResponse = {
  records: Array<object>
  nextPage: string
  limit: number
  timeUntilReset: number
}

export type parseOutput = {
  lastRecord: any
  numberOfRecords: number
  activities: Array<AddActivitiesSingle>
}

export type BaseOutput = { status: number; msg?: string }

export interface TwitterOutput extends BaseOutput {
  tweetCount: Number
  followers: Array<string>
}

export interface TwitterReachOutput extends BaseOutput {}

export interface DiscordOutput extends BaseOutput {
  channels: Channels
}

export interface SlackOutput extends BaseOutput {
  channels: Channels
  users: Object
}

export interface DevtoOutput extends BaseOutput {}

export type Thread = {
  threadId: string
  channelId: string
  placeholder: string
  channel: string
  new: boolean
}
