import path from 'path';

import 'styles/global.scss';

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import Avatar from 'components/Avatar';
import Button, { BaseButton } from 'components/Button';
import CodeSplit from 'components/CodeSplit';
import client from 'client';
import Link from 'components/Link';
import PageLayout from 'components/PageLayout';
import MetaTags from 'components/MetaTags';
import Modal, { BaseModal } from 'components/Modal';
import NavLink from 'components/NavLink';
import ScalableRect from 'components/ScalableRect';
import Throbber from 'components/Throbber';
import WithTooltip from 'components/WithTooltip';
import * as utils from 'utils';

import { requireWeak } from 'utils/webpack';

const serverUrl = module.webpackPolyfill ? './server'
  : path.resolve(__dirname, './server');
const server = utils.isomorphy.isServerSide() ? requireWeak(serverUrl) : null;

export {
  Avatar,
  BaseButton,
  BaseModal,
  Button,
  client,
  CodeSplit,
  GlobalStateProvider,
  Link,
  NavLink,
  MetaTags,
  Modal,
  PageLayout,
  ScalableRect,
  Throbber,
  server,
  WithTooltip,
};

export * from 'utils';
