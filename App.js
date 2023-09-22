import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { StyleSheet, Text, View, BackHandler, Alert, Button, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialogInput from 'react-native-dialog-input';
import {SafeAreaView} from 'react-native-safe-area-context';
//import {AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync,} from 'expo-ads-admob';
import * as Font from 'expo-font';
import * as WebBrowser from 'expo-web-browser';
//import { MobileAds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

//MobileAds.initialize('ca-app-pub-2273073266916535/8525192435');


export default class App extends React.Component {

  
  state = {
    value:0,
    myNumber:"0", 
    curTime: "Current Time",
    packs: 0,
    loaded: false,
    clockBool: "false",
    isDialogVisible:false,
    isDialogVisible2:false,
    isDialogVisible3:false,
    isDialogVisible4:false,
    isDialogVisible5:false,
    level: 0,
    purPacks: 0,
    battlePacks:0,
    targetOpen: "TIME TO OPEN",
    fontsLoaded:false,
    activePack:false,
  }

    async loadFonts() { 
        await Font.loadAsync({
          heirloom: require("./assets/fonts/heirloom2.ttf"),
        });
        this.setState({ fontsLoaded: true });
      
    
  }

  irlHeirloom = ()=>{
    const affs = [ "https://amzn.to/3Sadt75", "https://amzn.to/3L1mc94",
     "https://amzn.to/3cYz2IN", "https://amzn.to/3Qw1GOT", "https://amzn.to/3L72A3l", 
     "https://amzn.to/3L344vu", "https://amzn.to/3d4OmDG", "https://amzn.to/3qtA1Ue",
      "https://amzn.to/3xcuO7h", "https://amzn.to/3xgQUFx", "https://amzn.to/3d1lJHk",
    "https://amzn.to/3L5z1iw", "https://amzn.to/3L5lfMZ", "https://amzn.to/3L5lfMZ" ]; //oct,wraith,blood,mirage,valk,crypto,bang,rev,gib,ramp,path,life,watt
    WebBrowser.openBrowserAsync(affs[Math.floor(Math.random() * 13)]);
  }

savePacks = async() =>{
  try{
    await AsyncStorage.setItem("Packs", this.state.packs);
  } catch(err){
    alert(err);
  }}

  openedFun = async() =>{
    if(this.state.activePack == true){
      await this.setState({packs: (parseInt(this.state.packs) +1).toString(), activePack: false,targetOpen:"TIME TO OPEN"});
      this.savePacks();
      try{
        //await AdMobInterstitial.showAdAsync();
      }
      catch{
        console.log('ad not ready');
      }
      
    }
  }
  cancelFun = () =>{
    if(this.state.activePack == true){
      this.setState({activePack:false, targetOpen:"TIME TO OPEN"});
    }
  }

//sets type of clock 24/12
setClock = async(num)=>{
  this.setState({clockBool:num})
  try{
    await AsyncStorage.setItem("Clock", this.state.clockBool);
    this.setState({isDialogVisible: true});
    console.log(this.state.clockBool);
  } catch(err){
    alert(err);
  }}

getPacks = async()=>{
  try{
    let ps = await AsyncStorage.getItem("Packs");
    if(ps !== null){
      this.setState({packs: ps});
    }
    else{
      Alert.alert(
      "Clock Selection",
      "Which clock format do you want to use?",
      [
        {text: "12 Hour Clock",onPress: () => { this.setClock("true"); },},
        {text: "24 Hour Clock",onPress: () => { this.setClock("false"); }},]);
    }
  } catch(err){
    Alert.alert(
      "Clock Selection",
      "Which clock format do you want to use?",
      [
        {text: "12 Hour Clock",onPress: () => { this.setClock("true"); },},
        {text: "24 Hour Clock",onPress: () => { this.setClock("false"); }},]);
  }}


getClock = async()=>{
  try{
    let ps = await AsyncStorage.getItem("Clock");

    if(ps !== null){
      this.setState({clockBool: ps});
    }
    else{
      this.setState({clockBool:false});
    }
  } catch(err){
    alert(err);
  }}

   componentDidMount(){
     setInterval( function(){
      if(this.state.loaded == true){
        let hour = new Date().getHours();
        if(this.state.clockBool == "true"){
            hour = hour % 12;
            hour = hour ? hour : 12;
        }
        let mins = new Date().getMinutes();
        mins = String("0" + mins).slice(-2);
        let sec = new Date().getSeconds();
        sec = String("0" + sec).slice(-2);
        this.setState({
          curTime: hour+ ":" + mins+":" +sec
        })
      }
      else{
        this.loadFonts();
        this.setState({loaded: true});
        this.getPacks();
        this.getClock();
      }
    }.bind(this), 1000);
} 


setFun = async() =>{
  await AsyncStorage.removeItem("Clock");
  await AsyncStorage.removeItem("Packs");
  this.setState({loaded:false});
}

newPackTime = async() =>{
  console.log(this.state.fontsLoaded)
  if(this.state.activePack == false){
    this.setState({activePack:true});
    let hour = new Date().getHours();
    let min = new Date().getMinutes();
    let sec = new Date().getSeconds();
    let addMin = Math.floor(Math.random() * 1);
    let addSec = Math.floor(Math.random() * 60);
    let addHour = 0;

    if(addSec < 30 && addMin < 1){
      addSec = 30;
    }
    sec = sec+addSec;
    if(sec > 59){
      sec = sec%60;
      addMin +=1;
    }
    min += addMin;
    if(min>59){
      min = min%60;
      addHour = 1;
    }
    hour += addHour;
    if(hour >24){
      hour = hour%25;
    }
    if(this.state.clockBool == "true"){
      hour = hour % 12;
      hour = hour ? hour : 12;
      }
    sec = String("0" + sec).slice(-2);
    min = String("0" + min).slice(-2);
    this.setState({targetOpen: hour + ":" + min + ":" + sec});
    //await AdMobInterstitial.setAdUnitID('ca-app-pub-2273073266916535/4585656812');
    //await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});

  }
}

sendInput = async (txt)=>{
  if(!isNaN(txt)){
    if(parseInt(txt) >-1){
      this.setState({purPacks:parseInt(txt)});
      await AsyncStorage.setItem("Packs", (this.state.purPacks+this.state.level+this.state.battlePacks).toString());
      this.setState({isDialogVisible4:false, packs: (this.state.purPacks+this.state.level+this.state.battlePacks)});
    }}}


    getSum = (num) =>{
      let p1 = 0; //1 per
      let p2 = 0; //.5 per
      let p3 = 0; //.2 per
      let sum = 0;
      for(let i=num; i>0; i--){
        if(p1 <20){
          p1 += 1;
        }
        else if(p2 < 279){
          p2 +=1;
        }
        else if(p3 < 199){
          p3 +=1;
        }
      }
        sum += p1-2;
        sum += parseInt((p2*0.5), 10);
        sum += parseInt((p3*0.2), 10);
        if(sum > -1){
          return sum;
        }
        else{
          return 0;
        }
    }

  firstDiag = (txt)=>{
    if(!isNaN(txt)){
      if(parseInt(txt) >0 && parseInt(txt)<501){
        let x = this.getSum(parseInt(txt));
        this.setState({level:x, isDialogVisible:false, isDialogVisible2:true});
      }}}
  secondDiag = (txt)=>{
    if(!isNaN(txt)){
      if(parseInt(txt) >-1){
        this.setState({battlePacks:(parseInt(txt)*22), isDialogVisible2:false, isDialogVisible3:true});
      }}}

    thirdDiag = (txt)=>{
      if(!isNaN(txt)){
        if(parseInt(txt) >-1){
          this.setState({battlePacks: (this.state.battlePacks + (parseInt(txt)*15)), isDialogVisible3:false, isDialogVisible4:true});
    }}}

    createTwoButtonAlert = () =>
    Alert.alert(
      "Delete data?",
      "Are you sure that you want to delete your data?",
      [
        {
          text: "No        ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes, delete my data", onPress: () => this.setFun() }
      ]
    );

  render() {
    if(this.state.fontsLoaded == false){ 
      return (<LinearGradient
        colors={['#3C0000', '#700000', '#610000', '#3C0000']}
        style={{flex: 1, width:'100%'}}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} >
        </LinearGradient>
        );
    }
    else{

    return (
      <LinearGradient
        colors={['#3C0000', '#700000', '#610000', '#3C0000']}
        style={{flex: 1, width:'100%'}}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }} >

     <View style={styles.container}>

     <StatusBar style="light" />
     <View style={{alignItems:'center',position:'absolute', bottom:0, width:'100%'}}> 

  </View>
     
     <DialogInput isDialogVisible={this.state.isDialogVisible}
            title={"Account Level"}
            message={"Enter your current account level"}
            hintInput ={"1-500"}
            submitInput={ (inputText) => {this.firstDiag(inputText)} }
            closeDialog={ () => {console.log("no thanks haha")}}
           >
</DialogInput>

      <DialogInput isDialogVisible={this.state.isDialogVisible2}
            title={"Purchased Battle Passes"}
            message={"Enter the amount of PREMIUM battle passes that you have completed"}
            hintInput ={"e.g., 1.5, 3, etc"}
            submitInput={ (inputText) => {this.secondDiag(inputText)} }
            closeDialog={ () => {console.log("no thanks haha")}}
           >
</DialogInput>

<DialogInput isDialogVisible={this.state.isDialogVisible3}
            title={"Free Battle Passes"}
            message={"Enter the amount of FREE battle passes that you have completed"}
            hintInput ={"e.g., 0.5, 1, etc"}
            submitInput={ (inputText) => {this.thirdDiag(inputText)} }
            closeDialog={ () => {console.log("no thanks haha")}}
           >
</DialogInput>

     <DialogInput isDialogVisible={this.state.isDialogVisible4}
            title={"Purchased Packs"}
            message={"Enter the amount of packs you have purchased with apex coins"}
            hintInput ={"e.g., 0, 10, etc"}
            submitInput={ (inputText) => {this.sendInput(inputText)} }
            closeDialog={ () => {console.log("no thanks haha")}}
           >
</DialogInput>


      <View style={{flexDirection:'row',backgroundColor:'black', alignItems:'center'}}> 
      <View>
      <View style={{margin:20}}></View>
       <Text style={{fontFamily:'heirloom',fontSize:60, color:'#CD0000'}}> {this.state.packs} </Text> 
      </View>
      <View style={{flexDirection:'column'}}> 
      <View style={{margin:20}}></View>
          <Text style={{fontFamily:'heirloom', fontSize:30, color:'white'}}>Total</Text>
          <View style={{borderBottomColor: 'white',borderBottomWidth: 1,width:'100%'}} />
          <Text style={{fontFamily:'heirloom', fontSize:30, color:'white', marginBottom:5}}>Packs</Text>
      </View>

      <TouchableOpacity style = {{position:'absolute', right:0, marginRight:20}} onPress= {this.createTwoButtonAlert} >
      <Image source={require("./assets/trash.png")} style ={{height:35,width:35}} />
      </TouchableOpacity>
     
      </View>

          <View style={{borderBottomColor: 'white',borderBottomWidth: 1,width:'100%'}} />
          
          
          <ScrollView>
<View style={{ justifyContent:'center'}}>

<View style = {{marginTop:20}}></View>
          <View style={styles.outerSgmt}> 
          <View style = {{ width: '90%', flexDirection:'row',borderColor: 'white',borderWidth: 1,borderRadius: 10, height:90, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity style={styles.btns} onPress={this.newPackTime}>
            <Text style={{fontFamily:'heirloom', fontSize:30}}>New pack</Text>
          </TouchableOpacity>
          </View>
          </View>
          <View style= {{marginBottom:20}}></View>

  
    <View style={styles.outerSgmt}> 
        <View style = {{ width: '90%',borderColor: 'white',borderWidth: 1,borderRadius: 10, height:90, justifyContent:'center'}}>
        <Text style={styles.clocks}>{this.state.targetOpen}</Text>
        </View>
    </View>

      <View style={styles.outerSgmt}> 
        <View style = {{ width: '90%',borderColor: 'white',borderWidth: 1,borderRadius: 10, height:90, justifyContent:'center', marginTop:20}}>
        <Text style={styles.clocks}>{this.state.curTime}</Text>
        </View>
    </View>

    <View style={{alignItems:'center', marginTop:20}}> 
        <View style={{width:'90%', flexDirection:'row', borderWidth:1, borderColor:'white',borderRadius: 10,}}> 
          <TouchableOpacity style={styles.btns} onPress= {this.cancelFun} > 
          <Text style={{fontFamily:'heirloom', fontSize:25}}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btns} onPress= {this.openedFun} > 
          <Text style={{fontFamily:'heirloom', fontSize:25}}>Opened</Text>
          </TouchableOpacity>
          </View>
          </View>


          <View style={{alignItems:'center', marginTop:20}}> 
        <View style={{width:'90%', flexDirection:'row', borderWidth:1, borderColor:'white',borderRadius: 10,}}> 
          <TouchableOpacity style={styles.btns} onPress= {this.irlHeirloom} > 
          <Text style={{fontFamily:'heirloom', fontSize:25}}>IRL Heirloom</Text>
          </TouchableOpacity>
          </View>
          </View>

        </View>
        </ScrollView>


      </View>
     </LinearGradient>
    );
    } //return
    } //render
    }//export app

const styles = StyleSheet.create({
  container: {
    flex:1,
    height: '100%'
  },
  outerSgmt:{
    alignItems:'center', justifyContent:'center'
  },
  clocks: {
    fontSize: 50, 
    color: 'white', 
    textAlign: 'center',
    fontFamily: "heirloom"
    },

  container2: {
    flex: 1,
    backgroundColor: '#ddd',
    height: '90%',
    width: '33%',
    fontSize: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container3: {
    flex: .673,
    backgroundColor: '#ddd',
    height: '90%',
    fontSize: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container4: {
    flex: .327,
    backgroundColor: '#ddd',
    height: '90%',
    fontSize: 50,
    width: '67%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textCont:{ 
    fontSize: 40,
     fontWeight: 'bold',
      color: 'gray',
      fontFamily: "heirloom",
  },
  textInput:{
    width: '100%',
    color: 'white',
    backgroundColor:'black',
    fontSize: 20,
    fontFamily: "heirloom",
  },
  btns:{
    flex:1, backgroundColor:'white', height:50, margin:20, borderRadius:10, alignItems:'center', justifyContent:'center'
  }
 
}); 
 