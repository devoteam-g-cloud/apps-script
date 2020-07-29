/*
 * Manage event Registration 
 * Made with Apps Script, v8 runtime compliant
 * Run setup() function first
 */

const FORM_ID = '';
const CALENDAR_ID = 'primary';
const EVENT_TITLE = 'testing script';
const MAX_ATTENDEES = false; // false if you don't want to limit attendees or a number
const FORM_EMAIL_LABEL = 'Email' ; //If you use form email collection don't care about this parameter


/*
 * Setup function to check event is valid and create the trigger
 */
const setup = () => {
  // First we test if event is unique in calendar.
  // If not it throw an error.
  getEvent() ;
  
  let form = FormApp.openById(FORM_ID);
  ScriptApp.newTrigger('eventRegistration')
    .forForm(form)
    .onFormSubmit()
    .create();
}


/*
 * Stop triggers setup for this script
 */
const stopApp = () => {
  const allTriggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}


/*
 * Function that will run at the onForm Submit trigger
 */

const eventRegistration = (e) => {
//  Logger.log(JSON.stringify(e))
  const form = e.source ;
  const formResponse = e.response;
  if(form.collectsEmail()){
    var new_email = formResponse.getRespondentEmail();
  }else{
    var new_email = getEmail(formResponse.getItemResponses());
  }
  
  var event = getEvent() ;
  console.log('Email : ' + new_email)
  if(!event.attendees){
    event.attendees = []
  }
  event.attendees.push({email:new_email})
//  Logger.log(event)
  var newEvent = Calendar.Events.update(event, CALENDAR_ID, event.id,{sendUpdates:"all"}) ;
  
  Logger.log('stop')
  if(MAX_ATTENDEES){
    if(countAttendees(event.attendees) >= MAX_ATTENDEES){
      form.setAcceptingResponses(false);
    }
  }
}

const countAttendees = (attendees) => {
  var count = 0;
  for(var i in attendees){
    var attendee = attendees[i];
    if(attendee.responseStatus === 'declined' ){
      // We don't count the user that register and decline event after receiving invitation
      count++
    }
  }
  // We add 1 to count the new invitation sent
  return count+1;
}

/*
 * Helper function to get event by name.
 */ 
const getEvent = () => {
  const page = Calendar.Events.list(CALENDAR_ID,{q:EVENT_TITLE}) ;
  if(page.items && page.items.length > 0){
    if(page.items.length > 1){
      throw 'We found multiple events with the same title : '+ EVENT_TITLE;
    }
  }else{
    throw 'We didn\'t find an event with this title  !!!' ;  
  }
  Logger.log(page)
  return page.items[0]
}

/*
 * Helper function to retrieve email of user
 */
const getEmail = (itemResponses) => {
  for (var j = 0; j < itemResponses.length; j++) {
    var itemResponse = itemResponses[j];
    console.log(itemResponse.getItem().getTitle())
    if(itemResponse.getItem().getTitle() == FORM_EMAIL_LABEL){
      console.log('Email = '+ itemResponse.getResponse())
      return  itemResponse.getResponse()
    }
  }
  return false;
}

/*
 * Helper function to stop triggers
 */ 
const stopTrigger = () => {
  const allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}
