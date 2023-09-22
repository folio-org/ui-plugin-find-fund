import { noop } from 'lodash';

import { render, act } from '@folio/jest-config-stripes/testing-library/react';
import {
  FindRecords,
  PLUGIN_RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import {
  useFetchFunds,
  useFetchLedgers,
} from './hooks';
import { FindFund } from './FindFund';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    FindRecords: jest.fn(() => <span>FindRecords</span>),
  };
});
jest.mock('./hooks', () => ({
  useFetchFunds: jest.fn(),
  useFetchLedgers: jest.fn(),
}));

const renderFindFund = () => (render(
  <FindFund addFunds={noop} />,
));

describe('FindFund component', () => {
  beforeEach(() => {
    FindRecords.mockClear();

    useFetchFunds.mockClear().mockReturnValue({ fetchFunds: noop });
    useFetchLedgers.mockClear().mockReturnValue({ fetchLedgers: noop });
  });

  it('should render FindRecords component', async () => {
    const { getByText } = renderFindFund();

    expect(getByText('FindRecords')).toBeDefined();
  });

  it('should call fetchFunds when refreshRecords is called', async () => {
    const fetchFundsMock = jest.fn().mockReturnValue(Promise.resolve({ funds: [], totalRecords: 0 }));
    const filters = { status: 'Active' };

    useFetchFunds.mockClear().mockReturnValue({ fetchFunds: fetchFundsMock });
    renderFindFund();

    await act(async () => FindRecords.mock.calls[0][0].refreshRecords(filters));

    expect(fetchFundsMock).toHaveBeenCalledWith({
      limit: PLUGIN_RESULT_COUNT_INCREMENT,
      offset: 0,
      searchParams: filters,
    });
  });

  it('should call fetchFunds when onNeedMoreData is called', async () => {
    const fetchFundsMock = jest.fn().mockReturnValue(Promise.resolve({ funds: [], totalRecords: 0 }));

    useFetchFunds.mockClear().mockReturnValue({ fetchFunds: fetchFundsMock });
    renderFindFund();

    await act(async () => FindRecords.mock.calls[0][0].onNeedMoreData({
      limit: PLUGIN_RESULT_COUNT_INCREMENT,
      offset: PLUGIN_RESULT_COUNT_INCREMENT,
    }));

    expect(fetchFundsMock).toHaveBeenCalledWith({
      limit: PLUGIN_RESULT_COUNT_INCREMENT,
      offset: PLUGIN_RESULT_COUNT_INCREMENT,
      searchParams: {},
    });
  });
});
