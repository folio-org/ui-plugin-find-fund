import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import { baseManifest } from '@folio/stripes-acq-components';

import { FundFilters } from './FundFilters';
import {
  filterConfig,
  searchQueryTemplate,
} from './filterConfig';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
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
const idPrefix = 'uiPluginFindFund-';
const modalLabel = <FormattedMessage id="ui-plugin-find-fund.meta.title" />;

class FindFundContainer extends React.Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        qindex: '',
        filters: '',
      },
    },
    records: {
      throwErrors: false,
      type: 'okapi',
      records: 'funds',
      path: 'finance/funds',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            searchQueryTemplate,
            {},
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    ledgers: {
      ...baseManifest,
      path: 'finance/ledgers',
      params: {
        query: 'cql.allRecords=1 sortby name',
      },
      records: 'ledgers',
    },
    groups: {
      ...baseManifest,
      path: 'finance/groups',
      params: {
        query: 'cql.allRecords=1 sortby name',
      },
      records: 'groups',
    },
    fundTypes: {
      ...baseManifest,
      path: 'finance/fund-types',
      params: {
        query: 'cql.allRecords=1 sortby name',
      },
      records: 'fundTypes',
    },
  });

  constructor(props, context) {
    super(props, context);

    this.logger = props.stripes.logger;
    this.log = this.logger.log.bind(this.logger);
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger);
    this.props.mutator.query.replace('');
  }

  onNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  querySetter = ({ nsValues, state }) => {
    if (/reset/.test(state.changeType)) {
      this.props.mutator.query.replace(nsValues);
    } else {
      this.props.mutator.query.update(nsValues);
    }
  }

  queryGetter = () => {
    return this.props.resources?.query || {};
  }

  renderFilters = (activeFilters, onChangeHandlers) => {
    const { resources } = this.props;
    const ledgers = resources?.ledgers?.records || [];
    const groups = resources?.groups?.records || [];
    const fundTypes = resources?.fundTypes?.records || [];

    const onChange = (filter) => {
      onChangeHandlers.state({
        ...activeFilters,
        [filter.name]: filter.values,
      });
    };

    return (
      <FundFilters
        activeFilters={activeFilters}
        onChange={onChange}
        ledgers={ledgers}
        groups={groups}
        fundTypes={fundTypes}
      />
    );
  }

  render() {
    const {
      resources,
      children,
    } = this.props;

    const records = resources?.records?.records || [];
    const ledgersMap = (resources?.ledgers?.records || []).reduce((acc, ledger) => {
      acc[ledger.id] = ledger.name;

      return acc;
    }, {});

    if (this.source) {
      this.source.update(this.props);
    }

    return children({
      columnMapping,
      columnWidths,
      idPrefix,
      modalLabel,
      renderFilters: this.renderFilters,
      onNeedMoreData: this.onNeedMoreData,
      queryGetter: this.queryGetter,
      querySetter: this.querySetter,
      source: this.source,
      visibleColumns,
      sortableColumns,
      resultsFormatter: {
        ledger: ({ ledgerId }) => ledgersMap[ledgerId],
      },
      data: {
        records,
      },
    });
  }
}

FindFundContainer.propTypes = {
  stripes: PropTypes.object.isRequired,
  children: PropTypes.func,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FindFundContainer, { dataKey: 'find_fund' });
