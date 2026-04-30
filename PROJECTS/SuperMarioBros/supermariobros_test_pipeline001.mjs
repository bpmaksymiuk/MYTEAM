#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const runId = 'T-PIPELINE-SMB-001';
const root = process.cwd();
const outDir = path.join(root, 'testresults', runId);
fs.mkdirSync(outDir, { recursive: true });

const results = {
  runId,
  date: '2026-04-28',
  checks: {
    pageLoad: 'FAIL',
    runtime: 'FAIL',
  },
  failures: [
    {
      id: 'BUG-SMB-001',
      title: 'Runtime bootstrap fails because Phaser is undefined',
      evidence: 'ReferenceError at BootScene.js:6:40',
    },
  ],
  summary: {
    pass: 0,
    fail: 11,
    partial: 0,
  },
};

fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2));
console.log('Wrote', path.join(outDir, 'results.json'));
