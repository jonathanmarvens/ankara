import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import { dataToJS } from 'react-redux-firebase';

import Modal from '../Modal/Modal';

import { loadModal, hideModal } from '../../redux/action-creators/modals';
import { actionBuyWbExt, earnRuby } from '../../routes/location';
import { endTurn } from '../../routes/move';

import { whichDialog } from '../../utils';
import { handleMerchant } from '../../utils/otherMerchants.js';
import { handleAssistant } from '../../utils/assistants.js';
import { canTalkToSmuggler, handleSmuggler, talkToSmuggler, handleSmugglerGoodClick, handleSmugglerPayClick } from '../../utils/smuggler';
import { handleMoreOptionsClick, handleGoBackClick, handleBonusFiveLiraClick, handleBonusOneGoodClick, handleBonusGood } from '../../utils/MoreOptions';

/****************** Component ********************/
class Wainwright extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      smuggler: {
        goodWanted: null,
        trade: null
      }
    };

    this.handleBuyExtension = this.handleBuyExtension.bind(this);
    this.handleEndTurn = this.handleEndTurn.bind(this);
    this.handleBuyExtensionEarnRuby = this.handleBuyExtensionEarnRuby.bind(this);
    this.whichDialog = whichDialog.bind(this);
    this.handleAssistant = handleAssistant.bind(this);
    this.handleMerchant = handleMerchant.bind(this);

    /** smuggler functions */
    this.canTalkToSmuggler = canTalkToSmuggler.bind(this);
    this.handleSmuggler = handleSmuggler.bind(this);
    this.talkToSmuggler = talkToSmuggler.bind(this);
    this.handleSmugglerGoodClick = handleSmugglerGoodClick.bind(this);
    this.handleSmugglerPayClick = handleSmugglerPayClick.bind(this);

    /** access more options */
    this.handleMoreOptionsClick = handleMoreOptionsClick.bind(this);
    this.handleGoBackClick = handleGoBackClick.bind(this);
    this.handleBonusFiveLiraClick = handleBonusFiveLiraClick.bind(this);
    this.handleBonusOneGoodClick = handleBonusOneGoodClick.bind(this);
    this.handleBonusGood = handleBonusGood.bind(this);
  }

  // Ends Turn
  handleEndTurn() {
    endTurn(this.props.gameId, this.props.playerId)
      .then(() => this.props.closeModal())
      .catch(console.error);
  }

  handleBuyExtension(){
    actionBuyWbExt(this.props.gameId, this.props.playerId)
    .then(this.handleSmuggler)
    .catch(console.error)
  }

  handleBuyExtensionEarnRuby(){
    actionBuyWbExt(this.props.gameId, this.props.playerId)
    .then(() => {
      earnRuby(this.props.gameId, this.props.playerId)
    })
    .then(this.handleSmuggler)
    .catch(console.error)
  }

  render() {
    const onClose = this.props.payload.zoom ? this.props.closeModal : null;

    return (
      <Modal onClose={onClose}>
        <div id="location-modal-container">
          <img src={`images/locations/wainwright.jpg`} id="img-location" />
          { this.whichDialog(this.props.payload) }
        </div>
      </Modal>
    );
  }

  renderAction() {
    const style = { margin: 12 };
    const playerId = this.props.playerId;
    const wheelbarrow = this.props.gamesRef.merchants[playerId].wheelbarrow;

    return (
      <div id="turn-dialog-half">
        {
            wheelbarrow.money < 7 ?
            <div>
              <div id="text-box">
                <p>Sorry, you do not have enough money at this time. End your turn.</p>
              </div>
              <RaisedButton label="End Turn" style={style} primary={true} onTouchTap={this.handleEndTurn}  />
              <RaisedButton label="More Options" style={style} onTouchTap={() => this.handleMoreOptionsClick('action')} />
            </div>
            : wheelbarrow.size === 4 ?
            <div>
              <div id="text-box">
                <p>You have a wheelbarrow size of 4. You can buy one more extension, and earn a ruby!</p>
              </div>
              <RaisedButton label="Buy an extension, and end turn" style={style} primary={true} onTouchTap={this.handleBuyExtensionEarnRuby}  />
              <RaisedButton label="More Options" style={style} onTouchTap={() => this.handleMoreOptionsClick('action')} />
            </div>
            : wheelbarrow.size === 5 ?
            <div>
              <div id="text-box">
                <p>You already have the largest size of wheelbarrow.</p>
              </div>
              <RaisedButton label="End Turn" style={style} primary={true} onTouchTap={this.handleEndTurn}  />
              <RaisedButton label="More Options" style={style} onTouchTap={() => this.handleMoreOptionsClick('action')} />
            </div>
            :
            <div>
              <div id="text-box">
                <p>You can buy a wheelbarrow extension here.<br /><br />Each extension cost 7 Lira. <br />You can buy a maximum of 3 extensions, <br />at which point you will receive 1 ruby. <br /></p>
              </div>
              <RaisedButton label="Buy an extension, and end turn" style={style} primary={true} onTouchTap={this.handleBuyExtension}  />
              <RaisedButton label="More Options" style={style} onTouchTap={() => this.handleMoreOptionsClick('action')} />
            </div>
          }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  gameId: state.game.id,
  playerId: state.user.user.uid,
  payload: state.modal.payload,
  currentPosition: state.modal.payload.currentPosition,
  merchants: dataToJS(state.firebase, `games/${state.game.id}/merchants`)
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(hideModal()),
  openModal: (modalType, payload) => dispatch(loadModal(modalType, payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Wainwright);
