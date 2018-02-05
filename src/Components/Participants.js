import React from 'react';
import {View, StyleSheet} from 'react-native';
import {List, ListItem, Text, Thumbnail, Icon, Body, Right, Spinner, Toast, Left} from 'native-base';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class Participants extends React.Component {
  
  constructor(){
    super();
    this.toast = null;
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentWillMount(){

    if(GLOBALS.participantList.length > 0){
      this.setState({data: GLOBALS.participantList})
    }
    else{
      this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getParticipants')
        .then(res => {
          this.setState({isLoading: false})
          if(!res.ok){
            if(this.toast !== null)
            return this.toast._root.showToast({config: {
              text: JSON.parse(res._bodyText).err,
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                 backgroundColor: GLOBALS.primaryErrColor
              }
            }})
          }
          GLOBALS.participantList = JSON.parse(res._bodyText).data
          this.setState({data: JSON.parse(res._bodyText).data})
        })
        .catch(err => {
          this.setState({isLoading: false})
          if(this.toast !== null)
          this.toast._root.showToast({config: {
            text: 'An Error Occured !',
            position: 'bottom',
            buttonText: 'Okay',
            duration: 3000,
            style: {
              backgroundColor: GLOBALS.primaryErrColor
            }
          }})
        })
    }
  }

  handlePress(participantId, participantName, _id){
    const { navigate } = this.props.navigation;
    navigate('participantDetails', {
      participantId,
      participantName,
      _id
    })
  }
  
  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <View style={styles.container}>
        {showSpinner}
          <List dataArray={this.state.data}
          renderRow={item => 
            <ListItem button avatar 
              onPress={() => this.handlePress(item.id, item.name, item._id)}>
              <Left>
                <Thumbnail style={{width: 45, height: 45}} source={require('./../participant.png')} />
              </Left>
              <Body>
                <Text>{item.name}</Text>
                <Text note>Event: {item.event}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"></Icon>
              </Right>
            </ListItem>  
            }></List>
          <Toast ref={c => {this.toast = c;}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  tabStyle: {
    backgroundColor: GLOBALS.primaryColor
  }
})