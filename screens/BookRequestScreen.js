import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      fellowPost:"",
      reasonToApply:"",
      IsBookRequestActive : "",
      requestedBookName: "",
      bookStatus:"",
      requestId:"",
      userDocId: '',
      docId :''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (fellowPost,reasonToApply)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "fellowPost":fellowPost,
        "reason_to_Apply":reasonToApply,
        "request_id"  : randomRequestId,
        "book_status" : "requested",
         "date"       : firebase.firestore.FieldValue.serverTimestamp()

    })

    await  this.getFellowRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsBookRequestActive: true
      })
    })
  })

    this.setState({
        fellowPost :'',
        reasonToApply : '',
        requestId: randomRequestId
    })

    return Alert.alert("Application Submitted Successfully")


  }

receivedBooks=(fellowPost)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_books').add({
      "user_id": userId,
      "fellowPost":fellowPost,
      "request_id"  : requestId,
      "bookStatus"  : "received",

  })
}




getIsFellowRequestActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsBookRequestActive:doc.data().IsBookRequestActive,
        userDocId : doc.id
      })
    })
  })
}










getFellowRequest =()=>{
  // getting the requested book
var bookRequest=  db.collection('requested_books')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().book_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestedBookName: doc.data().book_name,
          bookStatus:doc.data().book_status,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and book nam
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var fellowPost =  doc.data().fellowPost

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" "  + " applied successfully for fellowship branch" + fellowPost ,
            "notification_status" : "unread",
            "fellowPost" : fellowPost
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getFellowRequest()
  this.getIsFellowRequestActive()

}

updateFellowRequestStatus=()=>{
  //updating the book status after receiving the book
  db.collection('requested_books').doc(this.state.docId)
  .update({
    book_status : 'recieved'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsBookRequestActive: false
      })
    })
  })


}


  render(){

    if(this.state.IsBookRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Book Name</Text>
          <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Book Status </Text>

          <Text>{this.state.bookStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateFellowRequestStatus();
            this.receivedBooks(this.state.requestedBookName)
          }}>
          <Text>I recieved the book </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="FellowShip Application" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter fellowship stream applied for"}
                onChangeText={(text)=>{
                    this.setState({
                        fellowPost:text
                    })
                }}
                value={this.state.fellowPost}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you want to Apply for FellowShip"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToApply:text
                    })
                }}
                value ={this.state.reasonToApply}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.fellowPost,this.state.reasonToApply);
                }}
                >
                <Text>Apply</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
