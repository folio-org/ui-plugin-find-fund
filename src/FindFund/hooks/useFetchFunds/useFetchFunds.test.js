import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { PLUGIN_RESULT_COUNT_INCREMENT } from '@folio/stripes-acq-components';

import { useFetchFunds } from './useFetchFunds';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const ledger = { id: 'ledgerId', name: 'Ledger' };
const fund = { id: 'fundId', code: 'FUND', ledgerId: ledger.id };

const fetchReferencesMock = jest.fn().mockReturnValue(Promise.resolve({
  ledgersMap: {
    [ledger.id]: ledger,
  },
}));
const getMock = jest.fn().mockReturnValue({
  json: () => ({ funds: [fund], totalRecords: 1 }),
});

describe('useFetchFunds', () => {
  beforeEach(() => {
    getMock.mockClear();
    fetchReferencesMock.mockClear();

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: getMock,
      });
  });

  it('should not make a get a request to fetch funds when fetchFunds is called and without filters', async () => {
    const { result } = renderHook(() => useFetchFunds({ fetchReferences: fetchReferencesMock }));

    await result.current.fetchFunds({ searchParams: {}, offset: 15 });

    expect(getMock).not.toHaveBeenCalled();
  });

  it('should make a get a request to fetch funds when fetchFunds is called and with filters', async () => {
    const { result } = renderHook(() => useFetchFunds({ fetchReferences: fetchReferencesMock }));

    await result.current.fetchFunds({ searchParams: { status: 'Active' }, offset: 15 });

    expect(getMock).toHaveBeenCalledWith(
      'finance/funds',
      {
        searchParams: {
          limit: PLUGIN_RESULT_COUNT_INCREMENT,
          offset: 15,
          query: '(status=="Active") sortby name/sort.ascending',
        },
      },
    );
  });

  it('should return funds when fetchFunds is called and with filters', async () => {
    const { result } = renderHook(() => useFetchFunds({ fetchReferences: fetchReferencesMock }));

    const { funds } = await result.current.fetchFunds({ searchParams: { status: 'Active' }, offset: 15 });

    expect(funds).toEqual([{ ...fund, ledger: ledger.name }]);
  });
});
