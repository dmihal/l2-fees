import sdk from '../sdk';

import { setup as setupEthereum } from './ethereum';
import { setup as setupLoopring } from './loopring';
import { setup as setupZKSync } from './zksync';

const feesList = sdk.getList('fees');

feesList.addAdaptersWithSetupFunction(setupEthereum)
feesList.addAdaptersWithSetupFunction(setupLoopring)
feesList.addAdaptersWithSetupFunction(setupZKSync)
