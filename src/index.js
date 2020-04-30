import path from 'path';

import 'styles/global.scss';

import { GlobalStateProvider } from '@dr.pogodin/react-global-state';

import Button, { BaseButton } from 'components/Button';
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
import * as utils from 'utils';

import { requireWeak } from 'utils/webpack';

const serverUrl = module.webpackPolyfill ? './server'
  : path.resolve(__dirname, './server');
const server = utils.isomorphy.isServerSide() ? requireWeak(serverUrl) : null;

export {
  BaseButton,
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
};

export * from 'utils';
