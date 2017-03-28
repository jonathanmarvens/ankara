import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { dataToJS } from 'react-redux-firebase';

import Modal from '../Modal/Modal';
import Dice from '../Pieces/Dice';

import { loadModal, hideModal } from '../../redux/action-creators/modals';
import { actionTeaHouse } from '../../routes/location';
import { endTurn } from '../../routes/move';

import { whichDialog } from '../../utils';
import { handleMerchant } from '../../utils/otherMerchants.js';
import { handleAssistant } from '../../utils/assistants.js';
import { canTalkToSmuggler, handleSmuggler, talkToSmuggler, handleSmugglerGoodClick, handleSmugglerPayClick } from '../../utils/smuggler';
import { handleMoreOptionsClick, handleGoBackClick, handleBonusFiveLiraClick, handleBonusOneGoodClick, handleBonusGood } from '../../utils/MoreOptions';

/****************** Component ********************/
class TeaHouse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gambledNumber: null,
      smuggler: {
        goodWanted: null,
        trade: null
      },
      rolled: false
    };

    this.handleChooseNumber = this.handleChooseNumber.bind(this);
    this.handleDiceRoll = this.handleDiceRoll.bind(this);
    this.handleTeaHouseEndTurn = this.handleTeaHouseEndTurn.bind(this);
    this.handleEndTurn = this.handleEndTurn.bind(this);
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

  handleChooseNumber (evt, good){
    const number = +evt.target.textContent;
    this.setState({ gambledNumber: number });
  }

  handleDiceRoll (rollSum){
    this.setState({ rolled: true })
    const gamble = this.state.gambledNumber;
    setTimeout(() => {
      this.handleTeaHouseEndTurn(gamble, rollSum)
    }, 2000)
  }

  handleTeaHouseEndTurn (gamble, rollSum){
    actionTeaHouse(this.props.gameId, this.props.playerId, gamble, rollSum)
      .then(this.handleSmuggler)
      .catch(console.error);
  }

  handleEndTurn (){
    endTurn(this.props.gameId, this.props.playerId)
      .then(() => this.props.closeModal())
      .catch(console.error);
  }

  render() {
    const onClose = this.props.payload.zoom ? this.props.closeModal : null;

    return (
      <Modal onClose={onClose}>
        <div id="location-modal-container">
          <img src={`images/locations/tea_house.jpg`} id="img-location" />
          { this.whichDialog(this.props.payload) }
        </div>
      </Modal>
    );
  }

  renderAction() {
    const gambledNumber = this.state.gambledNumber;
    const ddMenuStyle = {
      backgroundColor: 'white',
      marginLeft: 100,
      width: 100,
      fontSize: 18
    }
    const style = { margin: 12 }

    return (
      <div id="turn-dialog-full">
        <div id="text-box">
          <p>If the dice roll meets or exceeds your gamble,<br />you get the sum you name.<br />Otherwise, you walk away with only two lira.</p>
        </div>
          <div className='row'>
            <DropDownMenu value={this.state.gambledNumber} style={ddMenuStyle} onChange={this.handleChooseNumber}>
              <MenuItem value={2} primaryText="2" />
              <MenuItem value={3} primaryText="3" />
              <MenuItem value={4} primaryText="4" />
              <MenuItem value={5} primaryText="5" />
              <MenuItem value={6} primaryText="6" />
              <MenuItem value={7} primaryText="7" />
              <MenuItem value={8} primaryText="8" />
              <MenuItem value={9} primaryText="9" />
              <MenuItem value={10} primaryText="10" />
              <MenuItem value={11} primaryText="11" />
              <MenuItem value={12} primaryText="12" />
            </DropDownMenu>
            {
              gambledNumber &&
              <Dice done={this.handleDiceRoll} />
            }
          </div>
          <RaisedButton label="End my turn" style={style} primary={true} onTouchTap={this.handleEndTurn} disabled={this.state.rolled}  />
          <RaisedButton label="More Options" style={style} onTouchTap={() => this.handleMoreOptionsClick('action')} />
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

export default connect(mapStateToProps, mapDispatchToProps)(TeaHouse);
