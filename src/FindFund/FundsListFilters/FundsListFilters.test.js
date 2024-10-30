import { render } from '@folio/jest-config-stripes/testing-library/react';

import FundsListFilters from './FundsListFilters';

jest.mock('@folio/stripes-acq-components/lib/hooks/useAcquisitionUnits', () => ({
  useAcquisitionUnits: jest.fn(() => ({ acquisitionsUnits: [] })),
}));
jest.mock('@folio/stripes-acq-components/lib/hooks/useTags', () => ({
  useTags: jest.fn(() => ({ tags: [] })),
  useTagsConfigs: jest.fn(() => ({ configs: [] })),
}));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderFundsListFilters = (props = defaultProps) => (render(
  <FundsListFilters
    {...props}
  />,
));

describe('FundsListFilters component', () => {
  it('should display fund list filters', () => {
    const { getByText } = renderFundsListFilters();

    expect(getByText('ui-finance.fund.filters.ledger')).toBeDefined();
    expect(getByText('stripes-acq-components.filter.acqUnit')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.status')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.type')).toBeDefined();
    expect(getByText('ui-finance.fund.filters.group')).toBeDefined();
  });
});
