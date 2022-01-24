import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FindRecords } from '@folio/stripes-acq-components';

import { FundsListFiltersContainer } from './FundsListFilters';
import {
  useFetchFunds,
  useFetchLedgers,
} from './hooks';

import {
  searchableIndexes,
} from './FundsSearchConfig';

const RESULT_COUNT_INCREMENT = 30;

const idPrefix = 'uiPluginFindFund-';
const modalLabel = <FormattedMessage id="ui-plugin-find-fund.modal.title" />;
const resultsPaneTitle = <FormattedMessage id="ui-finance.fund" />;

const columnWidths = {
  isChecked: '8%',
  name: '23%',
  code: '23%',
  fundStatus: '23%',
};
const visibleColumns = ['name', 'code', 'fundStatus', 'ledger'];
const sortableColumns = ['name', 'code', 'fundStatus'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.fund.list.name" />,
  code: <FormattedMessage id="ui-finance.fund.list.code" />,
  fundStatus: <FormattedMessage id="ui-finance.fund.list.status" />,
  ledger: <FormattedMessage id="ui-finance.fund.list.ledger" />,
};
const resultsFormatter = {};

export const FindFund = ({ addFunds, isMultiSelect, ...rest }) => {
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { fetchLedgers } = useFetchLedgers();
  const { fetchFunds } = useFetchFunds({
    fetchReferences: fetchLedgers,
  });

  const refreshRecords = useCallback((filters) => {
    setIsLoading(true);

    setRecords([]);
    setTotalCount(0);
    setOffset(0);
    setSearchParams(filters);

    fetchFunds({ offset: 0, searchParams: filters })
      .then(({ funds, totalRecords }) => {
        setTotalCount(totalRecords);
        setRecords(funds);
      })
      .finally(() => setIsLoading(false));
  }, [fetchFunds]);

  const onNeedMoreData = () => {
    const newOffset = offset + RESULT_COUNT_INCREMENT;

    setIsLoading(true);

    fetchFunds({ offset: newOffset, searchParams })
      .then(({ funds }) => {
        setOffset(newOffset);
        setRecords(prev => [...prev, ...funds]);
      })
      .finally(() => setIsLoading(false));
  };

  const renderFilters = useCallback((activeFilters, applyFilters) => {
    return (
      <FundsListFiltersContainer
        activeFilters={activeFilters}
        applyFilters={applyFilters}
      />
    );
  }, []);

  return (
    <FindRecords
      {...rest}
      modalLabel={modalLabel}
      resultsPaneTitle={resultsPaneTitle}
      idPrefix={idPrefix}
      columnWidths={columnWidths}
      visibleColumns={visibleColumns}
      sortableColumns={sortableColumns}
      columnMapping={columnMapping}
      resultsFormatter={resultsFormatter}
      records={records}
      totalCount={totalCount}
      refreshRecords={refreshRecords}
      onNeedMoreData={onNeedMoreData}
      searchableIndexes={searchableIndexes}
      isMultiSelect={isMultiSelect}
      isLoading={isLoading}
      selectRecords={addFunds}
      renderFilters={renderFilters}
    />
  );
};

FindFund.propTypes = {
  disabled: PropTypes.bool,
  marginBottom0: PropTypes.bool,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  isMultiSelect: PropTypes.bool,
  addFunds: PropTypes.func.isRequired,
};

FindFund.defaultProps = {
  isMultiSelect: true,
  searchLabel: <FormattedMessage id="ui-plugin-find-fund.button.add" />,
};
