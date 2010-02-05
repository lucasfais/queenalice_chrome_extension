const QUEENALICE_URL = 'http://www.queenalice.com'
const QUEENALICE_GAME_URL = QUEENALICE_URL + '/game.php';
const QUEENALICE_MYGAMES_URL = QUEENALICE_URL + '/mygames.php';

var queenalice = {
  
  init: function() {
    this.get_pending_games();
  },
  
  get_pending_games: function() {
    
    $.post(QUEENALICE_MYGAMES_URL, function(data){

      var gamesWaintingRe = new RegExp("(\\d+) games? waiting", "g");
      var gamesWaitingMatches = gamesWaintingRe.exec(data);

      var panel_text = '';
      var panel_tooltip = 'No game waiting your move';
      var image = 'logo_mono.png';
      
      if (gamesWaitingMatches && gamesWaitingMatches.length > 0) {
        panel_text = gamesWaitingMatches[1];
        panel_tooltip = gamesWaitingMatches[0] + ' your move';
        image = 'logo.png';
      }
      else {
        var invalidLoginRe = new RegExp("You need to sign in to view this page", "g");
        var invalidLoginMatches = data.match(invalidLoginRe);

        if (invalidLoginMatches && invalidLoginMatches.length > 0) {
          panel_tooltip = "Click here to sign in QueenAlice.com for game notifications.";
        }
      }
      
      chrome.browserAction.setIcon({path: image});
      
      chrome.browserAction.setBadgeText({
        text: panel_text
      });
      
      chrome.browserAction.setTitle({
        title: panel_tooltip
      });
      
    });
    
  },
  
  open_mygames: function () {
    chrome.tabs.create({url: QUEENALICE_GAME_URL});
  },
  
  observe: function() {
    this.get_pending_games();
  }
}
 
$(document).ready(function(){
  queenalice.init();
  window.setInterval(queenalice.get_pending_games, 1*60*1000); // one minute
});