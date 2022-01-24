import { useCallback, useRef } from 'react';

import {
  useOkapiKy,
} from '@folio/stripes/core';
import {
  batchRequest,
} from '@folio/stripes-acq-components';

export const useFetchLedgers = () => {
  const ledgersMap = useRef({});
  const ky = useOkapiKy();

  const fetchLedgers = useCallback(async (funds) => {
    let fetchedLedgers = [];
    const unfetchedLedgers = funds
      .filter(fund => !ledgersMap.current[fund.ledgerId])
      .map(fund => fund.ledgerId);

    if (unfetchedLedgers.length) {
      fetchedLedgers = await batchRequest(
        async ({ params: searchParams }) => {
          const { ledgers } = await ky.get('finance/ledgers', { searchParams }).json();

          return ledgers;
        },
        unfetchedLedgers,
      );
    }

    ledgersMap.current = fetchedLedgers.reduce((acc, ledgerItem) => {
      acc[ledgerItem.id] = ledgerItem;

      return acc;
    }, ledgersMap.current);

    return Promise.resolve({ ledgersMap: ledgersMap.current });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    fetchLedgers,
  };
};
