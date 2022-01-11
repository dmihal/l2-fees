import sdk from '../sdk';

import { setup as setupEthereum } from './ethereum';
import { setup as setupAztec } from './aztec';
import { setup as setupBoba } from './boba';
import { setup as setupLoopring } from './loopring';
import { setup as setupOptimism } from './optimism';
import { setup as setupZKSync } from './zksync';

const feesList = sdk.getList('l2-fees');

feesList.addAdaptersWithSetupFunction(setupEthereum);
feesList.addAdaptersWithSetupFunction(setupArbitrum);
feesList.addAdaptersWithSetupFunction(setupAztec);
feesList.addAdaptersWithSetupFunction(setupBoba);
feesList.addAdaptersWithSetupFunction(setupHermez);
feesList.addAdaptersWithSetupFunction(setupLoopring);
feesList.addAdaptersWithSetupFunction(setupOptimism);
feesList.addAdaptersWithSetupFunction(setupZKSync);
