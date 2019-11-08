import path from 'path';

import 'styles/global.scss';

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import AppChunk from 'containers/AppChunk';
import Avatar from 'components/Avatar';
import Button, { BaseButton } from 'components/Button';
import client from 'client';
import Link from 'components/Link';
import PageLayout from 'components/PageLayout';
import MetaTags from 'components/MetaTags';
import Modal, { BaseModal } from 'components/Modal';
import NavLink from 'components/NavLink';
import ScalableRect from 'components/ScalableRect';
import Throbber from 'components/Throbber';
import Tooltip from 'components/Tooltip';
import * as utils from 'utils';

import { requireWeak } from 'utils/webpack';

const serverUrl = module.webpackPolyfill ? './server'
  : path.resolve(__dirname, './server');
const server = utils.isomorphy.isServerSide() ? requireWeak(serverUrl) : null;

export {
  AppChunk,
  Avatar,
  BaseButton,
  BaseModal,
  Button,
  client,
  GlobalStateProvider,
  Link,
  NavLink,
  MetaTags,
  Modal,
  PageLayout,
  ScalableRect,
  Tooltip,
  Throbber,
  server,
};

export * from 'utils';
