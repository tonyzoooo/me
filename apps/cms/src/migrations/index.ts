import * as migration_20261022_224727_baseline from './20261022_224727_baseline'

export const migrations = [
  {
    up: migration_20261022_224727_baseline.up,
    down: migration_20261022_224727_baseline.down,
    name: '20261022_224727_baseline',
  },
]
