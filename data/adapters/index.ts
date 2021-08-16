import sdk from '../sdk';

import { setup as setupEthereum } from './ethereum';
import { setup as setupHermez } from './hermez';
import { setup as setupLoopring } from './loopring';
import { setup as setupZKSync } from './zksync';

const feesList = sdk.getList('fees');

feesList.addAdaptersWithSetupFunction(setupEthereum);
feesList.addAdaptersWithSetupFunction(setupHermez);
feesList.addAdaptersWithSetupFunction(setupLoopring)
feesList.addAdaptersWithSetupFunction(setupZKSync)
