import { baseManifest } from '@folio/stripes-acq-components';

export const groupsResource = {
  ...baseManifest,
  path: 'finance/groups',
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'groups',
};

export const ledgersResource = {
  ...baseManifest,
  path: 'finance/ledgers',
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'ledgers',
};

export const fundTypesResource = {
  ...baseManifest,
  path: 'finance/fund-types',
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'fundTypes',
};
