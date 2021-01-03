var Sheet_ID = "15mSf09XUiFloem3V764MUET3wk-hf0KG2VYbB0QJgas"; //past sheet id here
var GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/" + Sheet_ID + "/edit";
var config_env = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B1:B4").getValues();
var owner = config_env[0][0]
var token = config_env[1][0]
var url = "https://api.telegram.org/bot" + token;
var webAppUrl = config_env[2][0]
var timezone =  config_env[3][0]
var parse_mode = "HTML";

/* Telegram API */
function setWebhook() {
  var response = UrlFetchApp.fetch(url+ "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}

function deleteWebhook() {
  var response = UrlFetchApp.fetch(url+ "/deleteWebhook");
  Logger.log(response.getContentText());
}

function sendText(id, text, reply_id = '', keyboard = '') {
  var new_url = url + "/sendMessage"
  var response = UrlFetchApp.fetch(new_url,{
    "method": "POST",
    "headers":{
      "Content-Type": "application/json"
    },
    "payload":  JSON.stringify({
      chat_id:id,
      text:text,
      parse_mode: parse_mode,
      reply_to_message_id: reply_id,
      reply_markup: keyboard
              })
    })
  var text_id = JSON.parse(response);
  return text_id.result.message_id;
}

function sendVideo(id,video,text,reply_id =''){
  var encoded = encodeURI(text);
  var encoded_vid = encodeURI(video);
  var response = UrlFetchApp.fetch(url+ "/sendVideo?chat_id=" + id + "&video=" + encoded_vid + 
                                   "&caption=" + encoded +
                                   "&parse_mode=" + parse_mode+
                                   "&reply_to_message_id=" + reply_id );
  var text_id = JSON.parse(response);
  return text_id.result.message_id;
}

function sendAudio(id,audio,text ='',reply_id =''){
  var encoded = encodeURI(text);
  var encoded_audio = encodeURI(audio);
  var response = UrlFetchApp.fetch(url+ "/sendAudio?chat_id=" + id + "&audio=" + encoded_audio + 
                                   "&caption=" + encoded +
                                   "&parse_mode=" + parse_mode+
                                   "&reply_to_message_id=" + reply_id );
   var text_id = JSON.parse(response);
  return text_id.result.message_id;
}

function sendVoice(id,voice,text ='',reply_id =''){
  var encoded = encodeURI(text);
  var encoded_audio = encodeURI(voice);
  var response = UrlFetchApp.fetch(url+ "/sendVoice?chat_id=" + id + "&voice=" + encoded_audio + 
                                   "&caption=" + encoded +
                                   "&parse_mode=" + parse_mode+
                                   "&reply_to_message_id=" + reply_id );
  var text_id = JSON.parse(response);
  return text_id.result.message_id;
}

function editMessageText(id,message_id,text){
  var encoded = encodeURI(text);
  var response = UrlFetchApp.fetch(url+ "/editMessageText?chat_id=" + id + "&message_id=" + message_id + 
                                 "&text=" + encoded +
                                 "&parse_mode=" + parse_mode);
  
}

function answerInlineQuery(inline_query_id, results, offset) {
  var next_offset = +offset + 10;
  var new_url = url + "/answerInlineQuery"
  var response = UrlFetchApp.fetch(new_url,{
    "method": "POST",
    "headers":{
      "Content-Type": "application/json"
    },
    "payload":  JSON.stringify({
      inline_query_id: inline_query_id,
      results:results,
      next_offset: next_offset
              })
    })
  var text_id = JSON.parse(response);
}

function answerCallbackQuery (callback_query_id,text, show_alert = 'false'){
  var encoded = encodeURI(text);
  var response = UrlFetchApp.fetch(url+ "/answerCallbackQuery?callback_query_id=" + callback_query_id + 
                                   "&text=" + encoded + 
                                   "&show_alert=" + show_alert);
}

function restrictChatMember(id,user_id,permissions,until_date){
    var encoded_perms = encodeURI(permissions)
    var encoded = encodeURI(until_date);
    var response = UrlFetchApp.fetch(url+ "/restrictChatMember?chat_id=" + id + 
                                   "&user_id=" + user_id + 
                                   "&permissions=" + encoded_perms+
                                    "&until_date=" + encoded);
}

function kickChatMember(id,user_id){
    var response = UrlFetchApp.fetch(url+ "/kickChatMember?chat_id=" + id + 
                                   "&user_id=" + user_id + 
                                    "&until_date=0");
}

function unbanChatMember(id,user_id){
    var response = UrlFetchApp.fetch(url+ "/unbanChatMember?chat_id=" + id + 
                                   "&user_id=" + user_id + 
                                    "&only_if_banned=true");
}

//function editMessageInline(inline_id,text,keyboard =''){
//  var encoded = encodeURI(text);
//  var encoded_key = encodeURI(keyboard)
//  var response = UrlFetchApp.fetch(url+ "/editMessageText?inline_message_id" + inline_id +  
//                                 "&text=" + encoded +
//                                 "&parse_mode=" + parse_mode +
//                                 "&reply_markup=" + encoded_key);
//}

/* Keyboards */

var ReplyKeyboard = JSON.stringify(
  {keyboard:
   [["\/id","\/help"],
    ["\/chatlog 0","\/chatlog 1"],
   ],
    resize_keyboard:false,
    one_time_keyboard:false,
    selective:false
    }
)

/*Authorization / boolean checks */
function isAuthorized(id) {
  var user_list = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('users_list');
  var user_list_last = user_list.getLastRow();
  var user_ids = user_list.getRange("C2:C" + user_list_last).getValues();
  if (+id == owner){
    return true
  }
  else {
    for (var i = 0; i < user_ids.length; i++) {
        if (+id == user_ids[i][0]){
          return true
        }
    }
    return false
  }
}

function isSuperUser(id) {
  var super_list = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('users_list');
  var super_list_last = super_list.getLastRow();
  var user_lists = super_list.getRange("C2:D" + super_list_last).getValues();
  if (+id == owner){
    return true
  }
  else{
    for (var i = 0; i < user_lists.length; i++) {
      if (+id == user_lists[i][0]   && user_lists[i][1]){
        return true
      }
    }
    return false
  }
}

function isEmpty(object){
  for (var i in object){
    return false
  }
  return true
}

/*Get Updates*/
function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
    if (contents.message){
      messageHandler(contents);
    }
    else if (contents.inline_query){
      inlineHandler(contents);
    }
    else if (contents.callback_query){
      callbackHandler(contents);
    }
}

function messageHandler(contents){
  var message = contents.message;
  var chat_id = message.chat.id;
  var user_id = message.from.id;
  var text = message.text;
  var command = text.slice(1).split(" ")[0];
  if (+user_id == owner){
    if (/^\//.test(text)){
    Owner_Commands(command,message);
    }
  }
  else if (isSuperUser(chat_id) || isSuperUser(user_id)){
    if (/^\//.test(text)){
    Super_Commands(command,message);
    }
  }
  else if (isAuthorized(chat_id) || isAuthorized(user_id)){
    if (/^\//.test(text)){
    Commands(command,message);
    }
  }
  else{
    if (/^\//.test(text)){
      if(command == 'id'){
      identify(message)
      }
    }
  }
  /** Chat logging portion **/
  if (ChatLogStatus()){
    var chats_log = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('chats_logs');
    var new_row = chats_log.getLastRow() + 1;
    chats_log.getRange(new_row,1).setValue(message.date)
    chats_log.getRange(new_row,2).setValue(Utilities.formatDate(new Date(message.date*1000), timezone, "dd/MM/yyyy HH:mm:ss"))
    chats_log.getRange(new_row,3).setValue(chat_id)
    chats_log.getRange(new_row,4).setValue(message.message_id)
    chats_log.getRange(new_row,5).setValue(user_id)
    chats_log.getRange(new_row,6).setValue(message.from.first_name)
    chats_log.getRange(new_row,7).setValue(message.from.username)
    chats_log.getRange(new_row,8).setValue(text)
    chats_log.getRange(new_row,9).setValue(message.reply_to_message.message_id)
  }
  /** **/
}

function inlineHandler(contents){
  var inline_query = contents.inline_query
  var query_id = inline_query.id
  var user_id = inline_query.from.id
  var query = inline_query.query
  var offset = inline_query.offset
  if (isAuthorized(+user_id)){
  /** Chat logging portion **/
  if (inlineStatus()){
    var chats_log = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('inline_logs');
    var new_row = chats_log.getLastRow() + 1;
    chats_log.getRange(new_row,1).setValue(query_id)
    chats_log.getRange(new_row,2).setValue(user_id)
    chats_log.getRange(new_row,3).setValue(inline_query.from.first_name)
    chats_log.getRange(new_row,4).setValue(inline_query.from.username)
    chats_log.getRange(new_row,5).setValue(query)
    chats_log.getRange(new_row,6).setValue(offset)
  }
  /**/
  }
}

function callbackHandler(contents){
  var callback_query = contents.callback_query
  var query_id = callback_query.id
  var user_id = callback_query.from.id
  var message = callback_query.message
  var inline_message_id = callback_query.inline_message_id
  var chat_instance = callback_query.chat_instance
  var data = callback_query.data
  if (isAuthorized(+user_id)){
    if (message){
      
    }
//    else if (inline_message_id){
//      
//    }
    /** Chat logging portion **/
    if (callbackStatus()){
      var chats_log = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('callback_logs');
      var new_row = chats_log.getLastRow() + 2;
      chats_log.getRange(new_row,1).setValue(message.date)
      chats_log.getRange(new_row,2).setValue(Utilities.formatDate(new Date(message.date*1000), timezone, "dd/MM/yyyy HH:mm:ss"))
      chats_log.getRange(new_row,4).setValue(query_id)
      chats_log.getRange(new_row,4).setValue(message.chat.id)
      chats_log.getRange(new_row,5).setValue(message.message_id)
      chats_log.getRange(new_row,6).setValue(user_id)
      chats_log.getRange(new_row,7).setValue(callback_query.from.first_name)
      chats_log.getRange(new_row,8).setValue(callback_query.from.username)
      chats_log.getRange(new_row,9).setValue(data)
      chats_log.getRange(new_row,10).setValue(message.text)
    }
    /** **/
  }
}

/* Command lists */
function Owner_Commands (command,message){
  switch (command) {
    case "promote":{
    promote(message);
    break;
    }
    case "demote":{
    demote(message);
    break;
    }
    case "chatlog":{
    chatlog(message);
    break;
    }
    case "inline":{
    inline(message);
    break;
    }
    case "callback":{
    callback(message);
    break;
    }
    default:{
    Super_Commands(command,message);
    break;
    }
  }
}

function Super_Commands (command,message){
  switch (command) {
    case "authorize":{
    authorize(message);
    break;
    }
    case "unauthorize":{
    unAuthorize(message);
    break;
    }
    case "mute":{
    muteMember(message);
    break;
    }
    case "tmute":{
    tmuteMember(message);
    break;
    }
    case "unmute":{
    unmuteMember(message);
    break;
    }
    case "getmute":{
    getmute(message);
    break;
    }
    case "setmute":{
    setmute(message);
    break;
    }
    case "ban":{
    ban(message);
    break;
    }
    case "unban":{
    unban(message);
    break;
    }
    default:{
    Commands(command,message);
    break;
    }
  }
}

function Commands (command,message){
  switch (command) {
    case "id":{
    identify(message);
    break;
    }
    case "help":{
    help(message);
    break;
    }
    case "file_id":{
    getMedia(message)
    break;
    }
    default:{
    sendText(message.chat.id,"Command Not Found!",message.message_id)
    break;
    }
  }
}

/*User defined functions */
function ChatLogStatus(){
  var chat_logging = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B5").getValue();
  if (chat_logging){
    return true
  }
}

function inlineStatus(){
  var inline_logging = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B6").getValue();
  if (inline_logging){
    return true
  }
}

function callbackStatus(){
  var callback_logging = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B7").getValue();
  if (callback_logging){
    return true
  }
}

function chatlog(message){
  if (ChatLogStatus()){
    SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B4").setValue(0)
    sendText(message.chat.id,"Chat Log has been turned off!",message.message_id)
  }
  else{
    SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B4").setValue(1)
    sendText(message.chat.id,"Chat Log has been turned on!",message.message_id)
  }
}

function inline(message) {
  if (inlineStatus()) {
    SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B6").setValue(0)
    sendText(message.chat.id, "Inline logging has been turned off!", message.message_id)
  }
  else {
    SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B6").setValue(1)
    sendText(message.chat.id, "Inline logging has been turned on!", message.message_id)
  }
}

function callback(message) {
  if (callbackStatus()) {
    SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B7").setValue(0)
    sendText(message.chat.id, "Callback logging has been turned off!", message.message_id)
  }
  else {
    SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B7").setValue(1)
    sendText(message.chat.id, "Callback logging has been turned on!", message.message_id)
  }
}

function identify(message){
  var reply_message = message.reply_to_message
  if (reply_message){
    var user_id = reply_message.from.id;
    sendText(message.chat.id, 'The user id is ' + '<code>' + user_id +'</code>', message.message_id);
  }
  else {
    sendText(message.chat.id, 'The chat id is ' + '<code>' + message.chat.id + '</code>', message.message_id);
  }
}

function authorize(message){
  var id = message.chat.id
  var text=message.text;
  var reply_message = message.reply_to_message;
  var authorizer = message.from.first_name;
  var authorizer_username = message.from.username;
  var authorizer_id = message.from.id;
  var user_list = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('users_list');
  var new_row = user_list.getLastRow() + 1;
  if (reply_message){
    var user_first_name=reply_message.from.first_name
    var username = reply_message.from.username
    var user_id = reply_message.from.id;  
    user_list.getRange(new_row,1).setValue(user_first_name)
    user_list.getRange(new_row,2).setValue(username)
    user_list.getRange(new_row,3).setValue(user_id)
    user_list.getRange(new_row,4).setValue('0')
    user_list.getRange(new_row,5).setValue(authorizer)
    user_list.getRange(new_row,6).setValue(authorizer_username)
    user_list.getRange(new_row,7).setValue(authorizer_id)
    sendText(id,user_first_name + ' [<code>' + user_id + '</code>] ' + 'has been authorized' , message.message_id)
  }
  else {
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      user_list.getRange(new_row,3).setValue(second_half)
      user_list.getRange(new_row,4).setValue(0)
      user_list.getRange(new_row,5).setValue(authorizer)
      user_list.getRange(new_row,6).setValue(authorizer_username)
      user_list.getRange(new_row,7).setValue(authorizer_id)
      sendText(id, second_half + ' has been authorized')
    }
    else {
      sendText(id,"Please input a user id",message.message_id)
    }
  }
}

function unAuthorize(message){
  var id = message.chat.id
  var text=message.text;
  var reply_message = message.reply_to_message;
  var user_list = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('users_list');
  var user_list_last = user_list.getLastRow();
  var user_ids = user_list.getRange("C2:C"+ user_list_last).getValues();
  var id_list = []
  for (var i = 0; i < user_ids.length;i++){
    id_list.push(user_ids[i][0])
  }
  if (reply_message){
    var user_id = reply_message.from.id
    if (user_id == owner){
      sendText(id, "The owner cannot be unauthorized", message.message_id)
    }
    else {
      if (id_list.includes(user_id)){
        user_list.deleteRow(id_list.indexOf(user_id) + 2)
        sendText(id, user_id + ' has been unauthorized')
      }
      else {
        sendText(id, "The user does not exist", message.message_id)
      }
    }
  }
  else {
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      if (id_list.includes(+second_half)){
        user_list.deleteRow(id_list.indexOf(+second_half) + 2)
        sendText(id, +second_half + ' has been unauthorized')
      }
      else {
        sendText(id, "The user does not exist", message.message_id)
      }
    }
    else {
      sendText(id,"Please input a user id",message.message_id)
    }
}
}

function promote(message){
  var id = message.chat.id
  var text=message.text;
  var reply_message = message.reply_to_message;
  var user_list = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('users_list');
  var user_list_last = user_list.getLastRow();
  var user_ids = user_list.getRange("C2:C"+ user_list_last).getValues();
  var id_list = []
  for (var i = 0; i < user_ids.length;i++){
    id_list.push(user_ids[i][0])
  }
  if (reply_message){
    var user_id=reply_message.from.id
    if (id_list.includes(user_id)){
      user_list.getRange(id_list.indexOf(user_id)+2, 4).setValue(1)
      sendText(id, user_id + ' has been promoted to SuperUser')
      }
    else {
      sendText(id, "The user does not exist", message.message_id)
    }
  }
  else {
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      if (id_list.includes(+second_half)){
      user_list.getRange(id_list.indexOf(+second_half)+2, 4).setValue(1)
      sendText(id, second_half + ' has been promoted to SuperUser')
      }
    else {
      sendText(id, "The user does not exist", message.message_id)
    }
    }
    else {
      sendText(id,"Please input a user id",message.message_id)
    }
  }
}

function demote(message){
  var id = message.chat.id
  var text=message.text;
  var reply_message = message.reply_to_message;
  var user_list = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('users_list');
  var user_list_last = user_list.getLastRow();
  var user_ids = user_list.getRange("C2:C"+ user_list_last).getValues();
  var id_list = []
  for (var i = 0; i < user_ids.length;i++){
    id_list.push(user_ids[i][0])
  }
  if (reply_message){
    var user_id=reply_message.from.id
    if (id_list.includes(user_id)){
      user_list.getRange(id_list.indexOf(user_id) +2 , 4).setValue(0)
      sendText(id, user_id + ' has been demoted from SuperUser')
      }
    else {
      sendText(id, "The user does not exist", message.message_id)
    }
  }
  else {
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      if (id_list.includes(+second_half)){
      user_list.getRange(id_list.indexOf(+second_half) +2 , 4).setValue(0)
      sendText(id, second_half + ' has been demoted from SuperUser')
      }
    else {
      sendText(id, "The user does not exist", message.message_id)
    }
    }
    else {
      sendText(id,"Please input a user id",message.message_id)
    }
  }
}

function help(message) {
  var help_list = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('commands_list');
  var help_list_last = help_list.getLastRow();
  var command_ids = help_list.getRange("A2:A"+ help_list_last).getValues();
  var description_list = help_list.getRange("B2:B"+ help_list_last).getValues();
  var header = 'Commands List' 
  for (var i = 0; i < command_ids.length;i++){
    header = header + '\n/' + command_ids[i][0] + ' - ' + description_list[i][0]
  }
 sendText(message.chat.id, header,message.message_id)
}

function getMedia(message){
  var reply_message = message.reply_to_message
  if (reply_message.audio){
    sendText(message.chat.id, 'The Audio file id is ' + '<code>' + reply_message.audio.file_id +'</code>', message.message_id);
  }
  else if (reply_message.video){
    sendText(message.chat.id, 'The Video file id is ' + '<code>' + reply_message.video.file_id + '</code>', message.message_id);
  }
  else if (reply_message.voice){
    sendText(message.chat.id, 'The Voice file id is ' + '<code>' + reply_message.voice.file_id + '</code>', message.message_id);
  }
  else if (reply_message.document){
    sendText(message.chat.id, 'The Document file id is ' + '<code>' + reply_message.document.file_id + '</code>', message.message_id);
  }
  else if (reply_message.photo){
    sendText(message.chat.id, 'The Photo file id is ' + '<code>' + reply_message.photo[0].file_id + '</code>', message.message_id);
  }
  else{
    sendText(message.chat.id, 'Please reply to a Media file', message.message_id);
  }
}

function muteMember(message){
  var id = message.chat.id
  var text=message.text;
  var reply_message = message.reply_to_message;
  var unix_time = +(message.date)
  var mute_config = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B8:B11").getValues();
  var mute_days = +(mute_config[0][0]);
  var mute_hours = +(mute_config[1][0]);
  var mute_minutes = +(mute_config[2][0]);
  var mute_seconds = +(mute_config[3][0]);
  var total_muted = unix_time + mute_days*24*60*60 + mute_hours*3600 + mute_minutes*60 + mute_seconds
  var end_date = Utilities.formatDate(new Date(total_muted*1000), timezone, "dd/MM/yyyy HH:mm:ss")
  var muted_text = " has been muted for " + mute_days + "d" + mute_hours + "h" + mute_minutes + "m" + mute_seconds + "s until " + end_date
    var permissions =JSON.stringify({
    can_send_messages: false,
    can_send_media_messages:false,
    can_send_polls:false,
    can_send_other_messages:false,
    can_add_web_page_previews:false,
  })
  if (reply_message){
    var user_id = reply_message.from.id
    restrictChatMember(id,user_id,permissions,total_muted)
    sendText(id,'<code>' + user_id + '</code>' + muted_text, message.message_id)
  }
  else {
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      restrictChatMember(id,+second_half,permissions,+total_muted)
      sendText(id,'<code>'+ second_half + '</code>' + muted_text, message.message_id)
    }
    else {
      sendText(id,"Please input a user id",message.message_id)
    }
  }
}

function unmuteMember(message){
  var id = message.chat.id
  var text=message.text;
  var reply_message = message.reply_to_message;
  var unix_time = +(message.date)
  var total_muted = unix_time + 2
  var permissions =JSON.stringify({
    can_send_messages: true,
    can_send_media_messages:true,
    can_send_polls:true,
    can_send_other_messages:true, 
    can_add_web_page_previews:true,
  })
  if (reply_message){
    var user_id = reply_message.from.id
    restrictChatMember(id,user_id,permissions,total_muted)
    sendText(id,'<code>' + user_id + '</code>' + ' has been unmuted', message.message_id)
  }
  else {
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      restrictChatMember(id,+second_half,permissions,+total_muted)
      sendText(id,'<code>'+ second_half + '</code>' + ' has been unmuted', message.message_id)
    }
    else {
      sendText(id,"Please input a user id",message.message_id)
    }
  }
}

function time_handling(time){
  var collection = {}
    var string = ''
    for (var i = 0; i < time.length ; i++){
      if (time[i] == 'd'){
        if (string){
          collection[time[i]] = string
          string = ''
        }
      }
      else if (time[i] == 'h'){
        if (string){
          collection[time[i]] = string
          string = ''
        }
      }
      else if (time[i] == 'm'){
        if (string){
          collection[time[i]] = string
          string = ''
        }
      }
      else if (time[i] == 's'){
        if (string){
          collection[time[i]] = string
          string = ''
        }
      }
      else{
        if (time[i].match(/\d+/g)){
          string += time[i]
        }
      }
    }
  return collection
}

function setmute(message){
  var chat_id = message.chat.id
  var message_id = message.message_id
  var text = message.text
  var second_half = text.slice(1).split(" ")[1]
  var sheet_to_use = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env')
  if (second_half){
    var collection = time_handling(second_half)
    var text_to_send = 'Mute duration has been set to '
    //set duration now
    if (isEmpty(collection)){
      sendText(chat_id,"Fail to set new mute duration",message_id)
    }
    else {
      sheet_to_use.getRange("B8:B11").setValue(0);
      if (collection['d']){
        sheet_to_use.getRange("B8").setValue(collection['d'])
        text_to_send += collection['d'] + ' days '
      }
      if (collection['h']){
        sheet_to_use.getRange("B9").setValue(collection['h'])
        text_to_send += collection['h'] + ' hours '
      }
      if (collection['m']){
        sheet_to_use.getRange("B10").setValue(collection['m'])
        text_to_send += collection['m'] + ' minutes '
      }
      if (collection['s']){
        sheet_to_use.getRange("B11").setValue(collection['s'])
        text_to_send += collection['s'] + ' seconds '
      }
      sendText(chat_id,text_to_send,message_id) 
    }
  }
  else{
    sendText(chat_id,"Please input the duration for mute",message_id)
  }
}

function getmute(message){
  var id =message.chat.id
  var message_id = message.message_id
  var mute_config = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName('config_env').getRange("B8:B11").getValues();
  var mute_days = mute_config[0][0]
  var mute_hours = mute_config[1][0];
  var mute_minutes = mute_config[2][0];
  var mute_seconds = mute_config[3][0];
  var text = 'The current mute duration is ' + mute_days + ' days ' + mute_hours + ' hours ' + mute_minutes + ' minutes ' + mute_seconds + ' seconds'
  sendText(id,text,message_id)
}

function tmuteMember(message){
  var id = message.chat.id
  var text = message.text
  var reply_message = message.reply_to_message;
  var unix_time = +(message.date)
  var muted_text = " has been muted for "
  var total_muted = +(unix_time)
  var permissions = JSON.stringify({
    can_send_messages: false,
    can_send_media_messages: false,
    can_send_polls: false,
    can_send_other_messages: false,
    can_add_web_page_previews: false,
  })
  if (reply_message){
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      var collection = time_handling(second_half)
      if(isEmpty(collection)){
        sendText(id, "Please set a mute duration")
      }
      else {
        if (collection['d']){
          total_muted += +(collection['d']) * 24 * 60 * 60
          muted_text += collection['d'] + ' days '
        }
        if (collection['h']){
          total_muted += +(collection['h']) * 60 * 60
          muted_text += collection['h'] + ' hours '
        }
        if (collection['m']){
          total_muted += +(collection['m'])* 60
          muted_text += collection['m'] + ' minutes '
        }
        if (collection['s']){
          total_muted += +(collection['s'])
          muted_text += collection['s'] + ' seconds '
        }
       var user_id = reply_message.from.id
       var end_date = Utilities.formatDate(new Date(total_muted * 1000), timezone, "dd/MM/yyyy HH:mm:ss")
       muted_text += "until " + end_date
       restrictChatMember(id, user_id, permissions, total_muted)
       sendText(id, '<code>' + user_id + '</code>' + muted_text, message.message_id)
      }
    }
    else{
      muteMember(message)
    }
  }
  else {
    var middle = text.slice(1).split(" ")[1]
    var end = text.slice(1).split(" ")[2]
    if (middle){
      if (end){
        var collection = time_handling(end)
      if(isEmpty(collection)){
        sendText(id, "Please set a mute duration")
      }
      else {
        if (collection['d']){
          total_muted += +(collection['d']) * 24 * 60 * 60
          muted_text += collection['d'] + ' days '
        }
        if (collection['h']){
          total_muted += +(collection['h']) * 60 * 60
          muted_text += collection['h'] + ' hours '
        }
        if (collection['m']){
          total_muted += +(collection['m'])* 60
          muted_text += collection['m'] + ' minutes '
        }
        if (collection['s']){
          total_muted += +(collection['s'])
          muted_text += collection['s'] + ' seconds '
        }
       var user_id = +middle
       var end_date = Utilities.formatDate(new Date(total_muted * 1000), timezone, "dd/MM/yyyy HH:mm:ss")
       muted_text += "until " + end_date
       restrictChatMember(id, user_id, permissions, total_muted)
       sendText(id, '<code>' + user_id + '</code>' + muted_text, message.message_id)
      }
      }
      else{
        muteMember(message)
      }
    }
    else{
     sendText(id,"Please provide a user id to mute",message.message_id)
    }
  }
}

function ban(message){
  var id = message.chat.id
  var text=message.text
  var reply_message = message.reply_to_message;
  if (reply_message){
    var user_id = reply_message.from.id
    kickChatMember(id,user_id)
    sendText(id,'<code>' + user_id + '</code>' + ' has been banned', message.message_id)
  }
  else {
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      kickChatMember(id,second_half)
      sendText(id,'<code>'+ second_half + '</code>' + ' has been banned', message.message_id)
   }
  else {
      sendText(id,"Please input a user id",message.message_id)
  }
  }
}

function unban(message){
  var id = message.chat.id
  var text=message.text
  var reply_message = message.reply_to_message;
  if (reply_message){
    var user_id = reply_message.from.id
    unbanChatMember(id,user_id)
    sendText(id,'<code>' + user_id + '</code>' + ' has been unbanned', message.message_id)
  }
  else {
    var second_half = text.slice(1).split(" ")[1]
    if (second_half){
      unbanChatMember(id,second_half)
      sendText(id,'<code>'+ second_half + '</code>' + ' has been unbanned', message.message_id)
   }
   else {
      sendText(id,"Please input a user id",message.message_id)
   }
  }
}
