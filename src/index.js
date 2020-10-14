import path from 'path';

import 'styles/global.scss';

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import CodeSplit from 'components/CodeSplit';
import client from 'client';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import Link from 'components/Link';
import PageLayout from 'components/PageLayout';
import MetaTags from 'components/MetaTags';
import Modal, { BaseModal } from 'components/Modal';
import NavLink from 'components/NavLink';
import ScalableRect from 'components/ScalableRect';
import Throbber from 'components/Throbber';
import WithTooltip from 'components/WithTooltip';
import YouTubeVideo from 'components/YouTubeVideo';
import * as utils from 'utils';

import { requireWeak } from 'utils/webpack';

const serverUrl = module.webpackPolyfill ? './server'
  : path.resolve(__dirname, './server');
const server = utils.isomorphy.IS_SERVER_SIDE ? requireWeak(serverUrl) : null;

export {
  BaseModal,
  Button,
  Checkbox,
  client,
  CodeSplit,
  Dropdown,
  GlobalStateProvider,
  Input,
  Link,
  NavLink,
  MetaTags,
  Modal,
  PageLayout,
  ScalableRect,
  Throbber,
  server,
  WithTooltip,
  YouTubeVideo,
};

export * from 'utils';
