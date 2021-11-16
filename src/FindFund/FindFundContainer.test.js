import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import FindFundContainer from './FindFundContainer';

const mockFetchMore = jest.fn();

jest.mock('@folio/stripes-smart-components/lib/SearchAndSort/ConnectedSource/StripesConnectedSource', () => {
  return jest.fn().mockImplementation(() => {
    return { fetchMore: mockFetchMore, update: jest.fn() };
  });
});

// eslint-disable-next-line react/prop-types
const children = jest.fn(({ onNeedMoreData, querySetter, renderFilters }) => {
  return (
    <>
      <div>
        {renderFilters({}, () => {})}
      </div>
      <button
        type="button"
        onClick={onNeedMoreData}
      >
        OnNeedMoreData
      </button>
      <button
        type="button"
        onClick={() => querySetter({ state: {} })}
      >
        UpdateQuery
      </button>
    </>
  );
});

const ledger = { id: 'ledgerId', name: 'One-time' };
const fund = { id: 'fundId', status: 'Active', name: 'Canada Univer', code: 'CDU', ledgerId: ledger.id };

const mockResources = {
  records: {
    records: [fund],
  },
  ledgers: {
    records: [ledger],
  },
  groups: { records: [] },
  fundTypes: { records: [] },
};

const renderFindFundContainer = (mutator, resources = mockResources) => (
  <FindFundContainer
    mutator={mutator}
    resources={resources}
  >
    {children}
  </FindFundContainer>
);

describe('FindFundContainer component', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      records: {
        GET: jest.fn(),
      },
      ledgers: {
        GET: jest.fn(),
      },
      groups: {
        GET: jest.fn(),
      },
      fundTypes: {
        GET: jest.fn(),
      },
      query: {
        update: jest.fn(),
        replace: jest.fn(),
      },
      initializedFilterConfig: {
        replace: jest.fn(),
      },
    };
  });

  it('should not fetch funds when plugin is open by default', async () => {
    await act(async () => {
      render(renderFindFundContainer(mutator));
    });

    expect(mutator.query.replace).toHaveBeenCalled();
    expect(mutator.records.GET).not.toHaveBeenCalled();
  });

  it('should fetch more data', async () => {
    render(renderFindFundContainer(mutator));

    await waitFor(() => {
      user.click(screen.getByText('OnNeedMoreData'));
    });

    expect(mockFetchMore).toHaveBeenCalledTimes(1);
  });

  it('should update data', async () => {
    render(renderFindFundContainer(mutator));

    await waitFor(() => {
      user.click(screen.getByText('UpdateQuery'));
    });

    expect(mutator.query.update).toHaveBeenCalled();
  });

  it('should return queryGetter', async () => {
    render(renderFindFundContainer(mutator));

    await waitFor(() => {
      return expect(children.mock.calls[0][0].queryGetter()).toEqual({});
    });
  });

  it('should format ledger name', async () => {
    render(renderFindFundContainer(mutator));

    await waitFor(() => {
      return expect(children.mock.calls[0][0].resultsFormatter.ledger(fund))
        .toEqual(ledger.name);
    });
  });

  it('should render filters', () => {
    render(renderFindFundContainer(mutator));

    expect(screen.getByText('ui-finance.fund.filters.ledger')).toBeDefined();
    expect(screen.getByText('ui-finance.fund.filters.status')).toBeDefined();
    expect(screen.getByText('ui-finance.fund.filters.type')).toBeDefined();
    expect(screen.getByText('ui-finance.fund.filters.group')).toBeDefined();
    expect(screen.getByText('stripes-acq-components.filter.tags')).toBeDefined();
  });
});
