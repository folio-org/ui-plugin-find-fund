import React from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqTagsFilter,
  AcqUnitFilter,
  SelectionFilter,
} from '@folio/stripes-acq-components';

import {
  FILTERS,
  FUND_STATUSES_OPTIONS,
} from './constants';

const buildSelectionOptions = entities => entities.map(entity => ({
  value: entity.id,
  label: entity.name,
}));

export function FundFilters({ activeFilters, onChange, ledgers, groups, fundTypes }) {
  return (
    <AccordionSet>
      <SelectionFilter
        activeFilters={activeFilters[FILTERS.LEDGER]}
        id={FILTERS.LEDGER}
        labelId="ui-finance.fund.filters.ledger"
        name={FILTERS.LEDGER}
        onChange={onChange}
        options={buildSelectionOptions(ledgers)}
      />
      <AcqCheckboxFilter
        id={FILTERS.STATUS}
        activeFilters={activeFilters[FILTERS.STATUS]}
        labelId="ui-finance.fund.filters.status"
        name={FILTERS.STATUS}
        onChange={onChange}
        options={FUND_STATUSES_OPTIONS}
      />
      <SelectionFilter
        activeFilters={activeFilters[FILTERS.TYPE]}
        id={FILTERS.TYPE}
        labelId="ui-finance.fund.filters.type"
        name={FILTERS.TYPE}
        onChange={onChange}
        options={buildSelectionOptions(fundTypes)}
      />
      <SelectionFilter
        activeFilters={activeFilters[FILTERS.GROUP]}
        id={FILTERS.GROUP}
        labelId="ui-finance.fund.filters.group"
        name={FILTERS.GROUP}
        onChange={onChange}
        options={buildSelectionOptions(groups)}
      />
      <AcqUnitFilter
        id={FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
        name={FILTERS.ACQUISITIONS_UNIT}
        onChange={onChange}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FILTERS.TAGS]}
        id={FILTERS.TAGS}
        name={FILTERS.TAGS}
        onChange={onChange}
      />
    </AccordionSet>
  );
}

FundFilters.propTypes = {
  onChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.object.isRequired,
  ledgers: PropTypes.arrayOf(PropTypes.object),
  groups: PropTypes.arrayOf(PropTypes.object),
  fundTypes: PropTypes.arrayOf(PropTypes.object),
};

FundFilters.defaultProps = {
  ledgers: [],
  groups: [],
  fundTypes: [],
};
