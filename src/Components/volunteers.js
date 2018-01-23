import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import {List, ListItem, Text, Body, Right, Icon, Spinner, Toast } from 'native-base';
const config = require('./../config');
let GLOBALS = require('./../globals');

export default class Volunteers extends React.Component {

  constructor(){
    super();
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentWillMount(){

    if(GLOBALS.volunteerList.length > 0){
      this.setState({data: GLOBALS.volunteerList})
      this.props.isLoading(false)
    }
    else{
      this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getVolunteers')
        .then(res => {
          this.setState({isLoading: false})
          if(!res.ok)
            return Toast.show({
              text: JSON.parse(res._bodyText).err,
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                 backgroundColor: GLOBALS.primaryErrColor
              }
            })
          GLOBALS.volunteerList = JSON.parse(res._bodyText).data
          this.setState({data: JSON.parse(res._bodyText).data})
          this.props.isLoading(false)
        })
        .catch(err => {
          this.setState({isLoading: false})
          Toast.show({
            text: 'An Error Occured !',
            position: 'bottom',
            buttonText: 'Okay',
            duration: 3000,
            style: {
              backgroundColor: GLOBALS.primaryErrColor
            }
          })
        })
    }
  }

  categorizeList(name){
    let dividerLabel = name[0];


  }

  handlePress(volunteerId, volunteerName, passesSold){
    const { navigate } = this.props.navigation;
    navigate('volunteerDetails', {
      volunteerId,
      volunteerName,
      passesSold
    })
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <View style={styles.container}>
        {showSpinner}
        <List dataArray={this.state.data}
          renderRow={item => 
            <ListItem button onPress={() => this.handlePress(item._id, item.name, item.passesSold)}>
              <Body>
              <Text>{item.name}</Text>
              <Text note>Passes Sold: {item.passesSold}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"></Icon>
              </Right>
            </ListItem>  
          }></List>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})