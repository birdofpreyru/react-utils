import 'client/init'; // eslint-disable-line import/no-unassigned-import

import client from 'client';
import Scene from './Scene';

global.SCENE_INIT_PROMISE = client(Scene);
