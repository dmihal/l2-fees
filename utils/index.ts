export const bundleItems = (data: any[], bundles: any) => {
  const _data = [...data];
  for (let i = 0; i < _data.length; i += 1) {
    const item = _data[i];
    if (item.bundle) {
      const bundleItems = [item];

      for (let j = i + 1; j < _data.length; j += 1) {
        if (_data[j].bundle === item.bundle) {
          bundleItems.push(_data[j]);
        }
      }

      if (bundleItems.length > 1) {
        const bundleMetadata = bundles[item.bundle as string];
        let result = 0;

        for (const bundleItem of bundleItems) {
          _data.splice(_data.indexOf(bundleItem), 1);
          result += bundleItem.result;
        }

        _data.push({
          metadata: bundleMetadata,
          id: item.bundle,
          result,
          children: bundleItems,
        });

        i -= 1; // To compensate for the first item removed
      }
    }
  }
  return _data;
};

export const formatUSD = (num?: number) =>
  num &&
  (num < 0.01
    ? '< $0.01'
    : num?.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }));
