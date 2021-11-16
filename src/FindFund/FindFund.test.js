import React from 'react';
import { render } from '@testing-library/react';

import { FindFund } from './FindFund';

const renderFindFund = () => (render(
  <FindFund />,
));

describe('FindFund component', () => {
  it('should render find-fund plugin', async () => {
    const { getByText } = renderFindFund();

    expect(getByText('ui-plugin-find-fund.button.add')).toBeDefined();
  });
});
