import { generateQueryTemplate } from '@folio/stripes-acq-components';

import { FILTERS } from './constants';

export const filterConfig = [
  {
    name: FILTERS.LEDGER,
    cql: FILTERS.LEDGER,
    values: [],
  },
  {
    name: FILTERS.STATUS,
    cql: FILTERS.STATUS,
    values: [],
  },
  {
    name: FILTERS.TYPE,
    cql: FILTERS.TYPE,
    values: [],
  },
  {
    name: FILTERS.GROUP,
    cql: 'groupFundFY.groupId',
    values: [],
  },
  {
    name: FILTERS.ACQUISITIONS_UNIT,
    cql: FILTERS.ACQUISITIONS_UNIT,
    values: [],
    operator: '=',
  },
  {
    name: FILTERS.TAGS,
    cql: 'tags.tagList',
    values: [],
    operator: '=',
  },
];

export const searchQueryTemplate = generateQueryTemplate([
  'name',
  'code',
  'externalAccountNo',
  'description',
]);
