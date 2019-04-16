/* eslint-disable import/no-absolute-path */
import config from 'config';
import {
  run, TaskOptions, Runner,
} from 'graphile-worker';
import { Pool } from 'pg';
import sendActivateAccountEmail from '../tasks/sendActivateAccountEmail';
import sendInvitationEmail from '../tasks/sendInvitationEmail';

let worker: Runner;

const tasks = {
  sendActivateAccountEmail,
  sendInvitationEmail,
};

export const initWorker = async () => {
  worker = await run({
    pgPool: new Pool(config.get('db')),
    taskList: tasks,
  });
  return worker;
};

type TasksNames = keyof typeof tasks;
type Parameters<T> = T extends (arg1: infer T) => any ? T : never;
type TaskParams<T extends TasksNames> = Parameters<typeof tasks[T]>;

export async function addJob<T extends TasksNames>(id: T, payload: TaskParams<T>, options?: TaskOptions) {
  return worker.addJob(id, payload, options);
}
