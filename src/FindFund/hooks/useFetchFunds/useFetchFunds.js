import { useCallback } from 'react';

import {
  useOkapiKy,
} from '@folio/stripes/core';
import {
  buildArrayFieldQuery,
  FUNDS_API,
  getFiltersCount,
  makeQueryBuilder,
  PLUGIN_RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import {
  getKeywordQuery,
} from '../../FundsSearchConfig';
import {
  FUND_FILTERS,
} from '../../constants';

const buildFundsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return `(${getKeywordQuery(query)})`;
  },
  'sortby name/sort.ascending',
  {
    [FUND_FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FUND_FILTERS.ACQUISITIONS_UNIT]),
    [FUND_FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FUND_FILTERS.TAGS]),
  },
);

export const useFetchFunds = ({
  fetchReferences,
}) => {
  const ky = useOkapiKy();

  const fetchFunds = useCallback(async ({
    searchParams = {},
    offset = 0,
    limit = PLUGIN_RESULT_COUNT_INCREMENT,
  }) => {
    const fundsQuery = buildFundsQuery(searchParams);
    const filtersCount = getFiltersCount(searchParams);

    if (!filtersCount) {
      return { funds: [], totalRecords: 0 };
    }

    const builtSearchParams = {
      query: fundsQuery,
      limit,
      offset,
    };

    const { funds, totalRecords } = await ky
      .get(FUNDS_API, { searchParams: { ...builtSearchParams } })
      .json();

    const { ledgersMap } = await fetchReferences(funds);
    const fundsResult = funds.map(fund => ({
      ...fund,
      ledger: ledgersMap[fund.ledgerId]?.name,
    }));

    return {
      funds: fundsResult,
      totalRecords,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchReferences]);

  return { fetchFunds };
};
