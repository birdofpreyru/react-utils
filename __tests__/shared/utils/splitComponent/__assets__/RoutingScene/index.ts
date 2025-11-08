import { launchClient } from 'client';
import { RoutingScene1 } from './RoutingScene';

global.SCENE_INIT_PROMISE = launchClient(RoutingScene1);
