/* eslint-disable import/no-absolute-path */
import config from 'config';
import {
  initWorker as initPGWorker, Worker, TaskOptions,
} from '/home/geekuillaume/tmp/worker';
import sendActivateAccountEmail from '../tasks/sendActivateAccountEmail';
import sendInvitationEmail from '../tasks/sendInvitationEmail';

let worker: Worker;

const tasks = {
  sendActivateAccountEmail,
  sendInvitationEmail,
};

export const initWorker = async () => {
  worker = await initPGWorker(config.get('db'), {
    taskList: tasks,
  });
  worker.start();
  return worker;
};

type TasksNames = keyof typeof tasks;
type Parameters<T> = T extends (arg1: infer T) => any ? T : never;
type TaskParams<T extends TasksNames> = Parameters<typeof tasks[T]>;

type test = TaskParams<'sendActivateAccountEmail'>;

export async function addJob<T extends TasksNames>(id: T, payload: TaskParams<T>, options?: TaskOptions) {
  return worker.addJob(id, payload, options);
}
