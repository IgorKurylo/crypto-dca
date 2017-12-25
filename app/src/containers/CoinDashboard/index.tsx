import React, { Component } from 'react';
import styles from './index.css';
import { withApollo, compose } from 'react-apollo';
import { connect } from 'react-redux';
import Page from '../../components/Page';
import { Coin, withCoins, deleteCoin } from '../../services/coins';
import CoinTable from '../../containers/CoinTable';
import AddCoinSection from '../../components/AddCoinSection';
import { CoinDashboardState, actions as coinDashboardActions } from '../../services/coin-dashboard/state';

const { CoinDashboard: coinDashboardClass } = styles;

interface CoinDashboardProps {
  coins: Coin[];
  sidebarOpen: boolean;
  addDialogActive: boolean;
  addCoin: Function;
  createCoin: Function;
  closeDialog: Function;
}

// Redux selectors
const mapStateToProps = ({
  coinDashboard: {
    sidebarOpen,
    addDialogActive
  }
}: {
  coinDashboard: CoinDashboardState
}) => ({
  sidebarOpen,
  addDialogActive
});
const mapDispatchToProps = (
  dispatch: Function
  // merged graphQL and own props
) => {
  const {
    coinDashboard: {
      addCoin, saveNewCoin, closeDialog
    }
  } = coinDashboardActions;

  return {
    createCoin: (coin: Coin) => dispatch(saveNewCoin(coin)),
    addCoin: () => dispatch(addCoin()),
    closeDialog: () => dispatch(closeDialog())
  };
};

class CoinDashboard extends Component<CoinDashboardProps, {}> {
  constructor(props: CoinDashboardProps) {
    super(props);
    this.state = {
      sidebarOpen: false
    };

    this.renderBody = this.renderBody.bind(this);
    this.renderSidebar = this.renderSidebar.bind(this);
    this.hideSidebar = this.hideSidebar.bind(this);
  }

  hideSidebar() {
    this.setState({ sidebarOpen: false });
  }

  renderBody() {
    const {
      coins,
      addCoin,
      createCoin,
      closeDialog,
      addDialogActive: active
    } = this.props;
    return (
      <div>
        <CoinTable
          coins={coins}
          remove={deleteCoin}
          toggleSidebar={() => { }}
        />
        <AddCoinSection
          add={addCoin}
          save={createCoin}
          active={active}
          close={closeDialog}
        />
      </div>
    );
  }

  renderSidebar() {
    return <div>sidebar</div>;
  }

  render() {
    const { sidebarOpen } = this.props;
    return (
      <Page
        className={coinDashboardClass}
        body={this.renderBody()}
        sidebarOpen={sidebarOpen}
        sidebar={this.renderSidebar()}
      />
    );
  }
}

export default compose(
  withApollo,
  withCoins,
  connect(mapStateToProps, mapDispatchToProps)
)(CoinDashboard);
