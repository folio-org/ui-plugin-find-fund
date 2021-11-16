import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  PluginFindRecord,
  PluginFindRecordModal,
} from '@folio/stripes-acq-components';

import FindFundContainer from './FindFundContainer';

export const FindFund = ({ addFunds, isMultiSelect, ...rest }) => (
  <PluginFindRecord
    {...rest}
    selectRecordsCb={addFunds}
  >
    {(modalProps) => (
      <FindFundContainer>
        {(viewProps) => (
          <PluginFindRecordModal
            {...viewProps}
            {...modalProps}
            isMultiSelect={isMultiSelect}
            getRecordLabel={({ lastName, firstName }) => `${lastName}, ${firstName}`}
          />
        )}
      </FindFundContainer>
    )}
  </PluginFindRecord>
);

FindFund.propTypes = {
  disabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  marginTop0: PropTypes.bool,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  addFunds: PropTypes.func,
  isMultiSelect: PropTypes.bool,
};

FindFund.defaultProps = {
  disabled: false,
  searchLabel: <FormattedMessage id="ui-plugin-find-fund.button.add" />,
  isMultiSelect: true,
};
