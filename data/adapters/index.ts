import sdk from '../sdk';

import { setup as setupEthereum } from './ethereum';
import { setup as setupArbitrum } from './arbitrum';
import { setup as setupAztec } from './aztec';
import { setup as setupHermez } from './hermez';
import { setup as setupLoopring } from './loopring';
import { setup as setupOptimism } from './optimism';
import { setup as setupZKSync } from './zksync';

const feesList = sdk.getList('fees');

feesList.addAdaptersWithSetupFunction(setupEthereum);
feesList.addAdaptersWithSetupFunction(setupArbitrum);
feesList.addAdaptersWithSetupFunction(setupAztec)
feesList.addAdaptersWithSetupFunction(setupHermez);
feesList.addAdaptersWithSetupFunction(setupLoopring)
feesList.addAdaptersWithSetupFunction(setupOptimism);
feesList.addAdaptersWithSetupFunction(setupZKSync)
