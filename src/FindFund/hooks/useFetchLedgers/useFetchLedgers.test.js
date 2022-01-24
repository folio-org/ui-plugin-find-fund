import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import {
  useOkapiKy,
} from '@folio/stripes/core';

import { useFetchLedgers } from './useFetchLedgers';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const ledger = { id: 'ledgerId', name: 'Ledger' };
const fund = { id: 'fundId', code: 'FUND', ledgerId: ledger.id };

const getMock = jest.fn().mockReturnValue({
  json: () => ({ ledgers: [ledger] }),
});

describe('useFetchLedgers', () => {
  beforeEach(() => {
    getMock.mockClear();

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: getMock,
      });
  });

  it('should make a get a request to fetch new (not fetched previosly) ledgers when fetchLedgers is called', async () => {
    const { result } = renderHook(() => useFetchLedgers());

    await result.current.fetchLedgers([fund]);

    expect(getMock).toHaveBeenCalled();
  });

  it('should return a fetched ledgers map when fetchLedgers is called', async () => {
    const { result } = renderHook(() => useFetchLedgers());

    const { ledgersMap } = await result.current.fetchLedgers([fund]);

    expect(ledgersMap).toEqual({ [ledger.id]: ledger });
  });

  it('should not make a get a request to fetch ledgers when fetchLedgers is called and ledgers are already loaded', async () => {
    const { result } = renderHook(() => useFetchLedgers());

    await result.current.fetchLedgers([fund]);
    await result.current.fetchLedgers([fund]);

    expect(getMock).toHaveBeenCalledTimes(1);
  });
});
