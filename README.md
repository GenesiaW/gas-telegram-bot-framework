
# GAS Telegram Bot Framework

Google Apps Script Telegram Bot Framework is a simple framework for creation of telegram bots to be used in small groups. It allows the bot to be hosted on Google Apps Script and data is stored in the specified Google Sheet. Simple authentication system is implemented for usage of bots in organizations, preventing unauthorized users from using the bot.

__Note: This is a project that is written by an amateur, there are better ways to implement some of the features.__

# Features
- Authentication System
- Basic Group Management Commands
- Supports Inline and Callback Handling
- Easy to edit command list
### WIP
- Welcome Message Handling
- Date and Time Selector using callback
 

# Deployment
1.  Make a copy of the [Google Sheets template][googlesheets] .
2.  Make a copy of the [Google Apps Script code][appscript].
3.  Copy the sheet id of the Google Sheet and paste into the first line of the App scripts file. replacing `15mSf09XUiFloem3V764MUET3wk-hf0KG2VYbB0QJgas`
4.  Save the script and deploy as a new web app. Set access to anyone. 
5.  Copy the webapp url and paste into cell `B3` of `config_env` sheet in the Google Sheet.
6.  Copy and paste the bot token that you obtained from Bot Father into cell `B2`of `config_env` sheet.
7. Go the to google app scripts code and run the SetWebHook function.
8. Now the bot should be deployed.
9.  Do the `/id` command in telegram to obtain your telegram user id for cell `B1` of the `config_env` sheet.

[googlesheets]: https://docs.google.com/spreadsheets/d/15mSf09XUiFloem3V764MUET3wk-hf0KG2VYbB0QJgas/edit?usp=sharing
[appscript]:https://script.google.com/d/1QPLKhoZ_cmkaElRLoQ9CuD31LuAIQ6MVkOYL_hJYhfm26GdRaucr7_SC/edit?usp=sharing
