/*
 * Copyright 2022-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import appRoot from 'app-root-path';
import {createRequire} from 'node:module';
import {join} from 'node:path';

const require = createRequire(import.meta.url);
const requireDir = require('require-dir');
// get all the remote implementations in this dir
const remote = Object.values(requireDir('./'));

// gets local manifests from an optional config file
const getLocalManifest = fileName => {
  try {
    const path = join(
      appRoot.toString(), fileName);
    return require(path);
  } catch(e) {
    if(e?.code === 'MODULE_NOT_FOUND') {
      return [];
    }
    throw e;
  }
};

const localConfig = getLocalManifest('localConfig.cjs');

// get localConfig and look for an implementations property
const local = localConfig?.implementations || [];

// concat all the implementation manifests together
const all = remote.concat(local);

// if local implementations are defined only return local implementations
export const implementerFiles = local.length ?
  // unless testAllImplementers...in which case, include them all
  (localConfig?.settings?.testAllImplementers === true ? all : local) :
  all;
