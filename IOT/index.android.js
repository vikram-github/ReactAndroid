/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  StyleSheet,
  View,
  ToastAndroid,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';
import Button from 'react-native-button';
import renderIf from './renderif';
import LinearGradient from 'react-native-linear-gradient';
import RNFetchBlob from 'react-native-fetch-blob';
import RestClient from 'react-native-rest-client';
import ProgressBarClassic from 'react-native-progress-bar-classic';
import {Select, Option} from "react-native-chooser";
//https://www.npmjs.com/package/react-native-modal-wrapper
//https://www.npmjs.com/package/react-native-menu
//https://www.npmjs.com/package/react-native-fetch-blob -> Refer this for downloading Blob
//https://www.npmjs.com/package/react-native-rest-client

var restBaseURL="http://72.163.208.40:8080/PrimeBridge/vi/BridgeService";

export default class RestAPI extends RestClient {
    // Initialize with your base URL 
   constructor (authToken) {
    super(restBaseURL, {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
              'userName':'root',
    'password':'Public123',
    'primeIP':'10.105.41.226',
    'macAddress':'fa:ab:ee:ee:cc:ff',
    'xcoordinate':123,
    'ycoordinate':123
      },
    });
  }
  login (username, password) {
    return this.POST('/auth', { username, password })
           .then(response => response.csrfToken);
  }
  postLocationData () {
    return this.POST('/prime/update/lightData', {})
      .then(response => {
        ToastAndroid.show('response', ToastAndroid.SHORT);
    });
  }
  checkDummyURL(){
      return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

const restAPI = new RestAPI();

class IOT extends Component {
  constructor(props) {
    super(props);

    this.state = {
      building: '',
      floor: '',
      showSelection: false,
      torchMode: 'off',
      barcode:'ab:bb:cc:dd:ee:ee',
      cameraType: 'back',
      showBarcode:false,
      showGoogleMap:false,
      showbuildingMap:false,
      showPrimeLogin:true,
      xcor:null,
      ycor:null,
      corx:'',
      primeIP:'10.105.41.226',
      primeUserName:'root',
      primePassword:'Public123',
      array:[],
      cordinate:{"xcor":78,"ycor":78,"name" :"Cisco"},
      count: 0,
      progress:0,
      primeBridgeIP:'',
      macAddressOfMobile:''
    };
    this.barcodeReceived = this.barcodeReceived.bind(this);
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }
    
   _getOptionListFloor() {
    return this.refs['OPTIONLISTFLOOR'];
  }


  _building(province) {

  this.setState({
      ...this.state,
      building: province
    });
  }
    
  _floor(province) {

  this.setState({
      ...this.state,
      floor: province
    });
  }
    
  _handlePress() {
    if(this.state.building == '' || this.state.floor == ''){
        ToastAndroid.show('Select Building and Floor', ToastAndroid.SHORT);
        return;
    }
    this.state.showSelection=false;
    this.state.showBarcode=true;
    this.forceUpdate();
  }
    
  barcodeReceived(e) {
    console.log('Barcode: ' + e.data);
    ToastAndroid.show('Barcode:' + e.data, ToastAndroid.SHORT);      
    this.state.barcode=e.data + "";
    this.handleShowBuildingMap();
  }
    
  onSelectBuilding(data) {
      this.setState({
      ...this.state,
      building: data
    });
  }
  onSelectFloor(data) {
      this.setState({
      ...this.state,
      floor: data
    });
  }
    
  _handlePressGoogleLocation(){
    this.state.showSelection=false;
    this.state.showBarcode=false;
    this.state.showGoogleMap=false; 
    this.state.showbuildingMap=false;
    this.state.showPrimeLogin=true;
    this.forceUpdate();
  }
    
  readDataFromCMX(){
      
  }
  
  handleBackButton(){
      ToastAndroid.show('Posted Data', ToastAndroid.SHORT);
      
      var url = 'https://bglgrp0229-pod:8023';
      url = 'http://'+this.state.primeBridgeIP+':8080';
      //url = 'http://72.163.208.40:8080';
     fetch(url + '/PrimeBridge/vi/BridgeService/prime/update/lightData', {  
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'userName':this.state.primeUserName,
            'password':this.state.primePassword,
            'primeIP':this.state.primeIP,
            'macAddress':this.state.barcode,
            'xcoordinate':Math.floor(parseInt(this.state.cordinate.xcor)/10),
            'ycoordinate':Math.floor(parseInt(this.state.cordinate.ycor)/10)
        }
     }).catch(function (err) {
         ToastAndroid.show(JSON.stringify(err), ToastAndroid.SHORT);
     });
/*
'userName':this.state.primeUserName,
            'password':this.state.primePassword,
            'primeIP':this.state.primeIP,
            'macAddress':this.state.barcode,
            'xcoordinate':this.state.xcor,
            'ycoordinate':this.state.ycor
            */
        this.state.showSelection=true;
        this.state.showBarcode=false;
        this.state.showbuildingMap=false;
        this.state.showGoogleMap=false;
        this.state.showPrimeLogin=false;
        this.forceUpdate();    
  }
    
  handleCMX(){
      ToastAndroid.show('Fetching Data from CMX', ToastAndroid.SHORT);
      
      var url = 'http://173.39.88.139/api/location/v2/clients/';
      var self = this;
     fetch(url, {  
         method: 'GET',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Basic YWRtaW46VGVsMTIzNDU=",
            'password':'Tel12345',
        }
     }).then(response => response.json()).then(function(response){
        self.showBuildingMap(response);         
     })
     .catch(function (err) {
         ToastAndroid.show("Error ---> " + JSON.stringify(err), ToastAndroid.SHORT);
     });
      
}
    
  showProgressBar(){
      
  }
    
  showBuildingMap(response){
     // Hardcoded for now.. But need to dynamically calculate the same
     var wifiMacAddress = "80:58:f8:36:84:7f";
     
      ToastAndroid.show(JSON.stringify(response.length)+" Json",ToastAndroid.SHORT);
      if(response.length > 1){
        var result = response;
        for(var res in result){
            ToastAndroid.show(res, ToastAndroid.SHORT); 
            if(res.macAddress === wifiMacAddress){
                ToastAndroid.show("Wifi Address Matched", ToastAndroid.SHORT); 
                var mapCo = res.mapCoordinate;
                var x = mapCo.x * 10;
                var y = mapCo.y * 10;
                this.state.cordinate = {"xcor":x,"ycor":y,"name" :"Cisco"};
            } else {
                ToastAndroid.show(res.macAddress, ToastAndroid.SHORT);
            }
        }
      } else {
          ToastAndroid.show("Json Length == 0", ToastAndroid.SHORT);     
      }
     this.state.showSelection=false;
     this.state.showBarcode=false;
     this.state.showGoogleMap=false; 
     this.state.showPrimeLogin=false;
     this.state.showbuildingMap=true;
     this.forceUpdate();
  }
    
  handleShowBuildingBypass(){
    this.state.showSelection=false;
    this.state.showBarcode=false;
    this.state.showGoogleMap=false; 
    this.state.showPrimeLogin=false;
    this.state.showbuildingMap=true;
    this.forceUpdate();
  }

  handleShowBuildingMap(){
    this.handleShowBuildingBypass();
  }
    
  handlePrimeLogin(){
    ToastAndroid.show('Login in progres..', ToastAndroid.SHORT);   
    fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.state.showSelection=true;
        this.state.showBarcode=false;
        this.state.showGoogleMap=false; 
        this.state.showbuildingMap=false;
        this.state.showPrimeLogin=false;
        this.forceUpdate();
      })
      .catch((error) => {
        ToastAndroid.show('Login Failed', ToastAndroid.LONG);  
      });
    
  }

  handleTouchPress(evt) {
    var count = 0
    console.log("Coordinates",`x coord = ${evt.nativeEvent.locationX}`);
    console.log("Coordinates",`y coord = ${evt.nativeEvent.locationY}`);
    var cordinates = {"xcor":evt.nativeEvent.locationX,"ycor":evt.nativeEvent.locationY,"name" :"Cisco"}
    this.setState({
      ...this.state,
      cordinate:cordinates
     })
    this.forceUpdate();
  }  

  render() {
    return (
    <Image
        source={require('./images/iot.jpg')}
        style={styles.imageContainer}>
    <View style={styles.container}>
{renderIf(!this.state.showbuildingMap,
    <View>
      <View style={{ flex: 1, alignItems: 'center', padding: 0}}>
       <Text style={styles.welcome}>
          Device Location Mapping
        </Text>
         {renderIf(this.state.showPrimeLogin,
           <View>
            <Text style={styles.welcomePrime}>
                Enter Prime Details
            </Text>
            <TextInput
            style={{height: 40, width:260}}
            placeholder="Prime IP/Host"
            onChangeText={(text) => this.setState({primeIP:text})}
            />
            <TextInput
            style={{height: 40}}
            placeholder="Prime User Name"
            onChangeText={(text) => this.setState({primeUserName:text})}
            />
            <TextInput
            style={{height: 40}}
            placeholder="Prime Password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({primePassword:text})}
            />
            <TextInput
            style={{height: 40, width:260}}
            placeholder="Prime Bridge IP"
            onChangeText={(text) => this.setState({primeBridgeIP:text})}
            />
            <Button
            containerStyle={{padding:10, height:45,marginTop:10, marginBottom:10, overflow:'hidden', borderRadius:4, backgroundColor: '#ADD8E6'}}
            style={{ fontSize: 20, color: 'black'}}
            styleDisabled={{color: 'red'}}
            onPress={() => this.handlePrimeLogin()}>
            Login
          </Button>
            </View>
          )}
        {renderIf(this.state.showSelection,
        <Select
            onSelect = {this.onSelectBuilding.bind(this)}
            defaultText  = "Select Building"
            style = {{borderWidth : 1, borderColor : "green"}}
            textStyle = {{}}
            backdropStyle  = {{backgroundColor : "#d3d5d6"}}
            optionListStyle = {{backgroundColor : "#F5FCFF"}}
          >
          <Option value = "BGL-15">BGL-15</Option>
        </Select>
         )}
         {renderIf(this.state.showSelection,
         <Select
            onSelect = {this.onSelectFloor.bind(this)}
            defaultText  = "Select Floor"
            style = {{marginTop : 10, borderWidth : 1, borderColor : "green"}}
            textStyle = {{}}
            backdropStyle  = {{backgroundColor : "#d3d5d6"}}
            optionListStyle = {{backgroundColor : "#F5FCFF"}}
          >
          <Option value = "4th Floor">4th Floor</Option>
        </Select>
          )}
        
        
          {renderIf(this.state.showSelection,
          <View>
            <Text style={{marginTop:10, color: '#333333'}}>Prime IP/Host: {this.state.primeIP}</Text>
            <Text style={{marginTop:10, color: '#333333'}}>Selected Building: {this.state.building}</Text>
            <Text style={{marginTop:10, color: '#333333'}}>Selected Floor: {this.state.floor}</Text>
          </View>
           )}
          {renderIf((!this.state.showSelection && !this.state.showPrimeLogin),
          <View>
          <Text style={{marginTop:10}}>Barcode: {this.state.barcode}</Text>
          <Button
            containerStyle={{padding:10, height:45,marginTop:10, marginBottom:10, overflow:'hidden', borderRadius:4, backgroundColor: '#ADD8E6'}}
            style={{ fontSize: 20, color: 'black'}}
            styleDisabled={{color: 'red'}}
            onPress={() => this.handleShowBuildingBypass()}>
            Launch Building Map
          </Button>
          </View>
          )}
          {renderIf(this.state.showSelection,      
          <Button
            containerStyle={{padding:10, height:45,marginTop:10, overflow:'hidden', borderRadius:4, backgroundColor: '#ADD8E6'}}
            style={{ fontSize: 20, color: 'black'}}
            styleDisabled={{color: 'red'}}
            onPress={() => this._handlePress()}>
            Scan Devices
          </Button>
           )}
          {renderIf(this.state.showSelection,
          <Button
            containerStyle={{padding:10, marginTop:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ADD8E6'}}
            style={{ fontSize: 20, color: 'black'}}
            styleDisabled={{color: 'red'}}
            onPress={() => this._handlePressGoogleLocation()}>
            Configure Prime
          </Button>
            )}         
      </View>
      {renderIf(this.state.showBarcode,
        <BarcodeScanner
            onBarCodeRead={this.barcodeReceived}
            style={{ flex: 1, width:450 }}
            torchMode={this.state.torchMode}
            cameraType={this.state.cameraType}
        />     
       )}
       {renderIf(this.state.showBarcode,      
          <Button
            containerStyle={{padding:10, height:45,marginTop:10, marginBottom:10, overflow:'hidden', borderRadius:4, backgroundColor: '#ADD8E6'}}
            style={{ fontSize: 20, color: 'black'}}
            styleDisabled={{color: 'red'}}
            onPress={() => this.handleBackButton()}>
            Back
          </Button>
           )}
        {renderIf(this.state.showGoogleMap,
                 
        )}
       {renderIf(this.state.showGoogleMap,      
          <Button
            containerStyle={{padding:10, height:45,marginTop:10, marginBottom:10, overflow:'hidden', borderRadius:4, backgroundColor: '#ADD8E6'}}
            style={{ fontSize: 20, color: 'black'}}
            styleDisabled={{color: 'red'}}
            onPress={() => this.handleBackButton()}>
            Back
          </Button>
        )}
      </View>
      )}
        {renderIf(this.state.showbuildingMap, 
        <View>
        <Text style={styles.welcomeBuildingMap}>
          Device Location Mapping
        </Text>
        <Text Text style={styles.buildingMapView}>You are viewing {this.state.building}, {this.state.floor}</Text>          
            <ScrollView>              
                <ScrollView horizontal={true} vertical={true} directionalLockEnabled={false}>
                    <TouchableOpacity onPress={(evt) => this.handleTouchPress(evt)}>
                        <Image style={{width: 350, height: 222}} source={require('./images/bgl-14-5.png')} />
                    {renderIf(this.state.cordinate.xcor && this.state.cordinate.ycor,
                    <View style=        {{position:"absolute",flex:1,left:this.state.cordinate.xcor,top:this.state.cordinate.ycor,right:this.state.cordinate.xcor,bottom:this.state.cordinate.ycor}}>
                        <Image source={require('./images/pin.png')} style={{resizeMode:'cover',width:35,height:35}}>
                        </Image>
                    </View>
                    )}
                    </TouchableOpacity>                                   
                </ScrollView>
            </ScrollView>        
        <Button
            containerStyle={{padding:10, height:45,marginTop:10, marginBottom:10, overflow:'hidden', borderRadius:4, backgroundColor: '#ADD8E6'}}
            style={{ fontSize: 20, color: 'black'}}
            styleDisabled={{color: 'red'}}
            onPress={() => this.handleBackButton()}>
            Update
        </Button>
        </View>
        )}
      </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    alignSelf: 'stretch',
  },
  welcomeBuildingMap: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
    alignSelf: 'stretch', 
    textDecorationLine: 'underline',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    alignSelf: 'stretch', 
    textDecorationLine: 'underline',
  },
  buildingMapView: {
    fontSize: 15,
    textAlign: 'center',    
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,  
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  welcomePrime: {
    fontSize: 15,
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    alignSelf: 'stretch',    
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
   imageContainer: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
AppRegistry.registerComponent('IOT', () => IOT);
