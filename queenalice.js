const QUEENALICE_URL = 'http://www.queenalice.com'
const QUEENALICE_GAME_URL = QUEENALICE_URL + '/game.php';
const QUEENALICE_MYGAMES_URL = QUEENALICE_URL + '/mygames.php';

/*
en = English
es = Español (Spanish)
de = Deutsch (German)
is = Íslenska (Icelandic)
ca = Català (Catalan)
fr = Français (French)
pt = Português (Portuguese)
nl = Nederlands (Dutch)
ro = Româna (Romanian)
ru = ??????? (Russian)
gl = Galego (Galician)
it = Italiano (Italian)
ms = Bahasa Malaysia (Malay)
pl = Polski (Polish)
uk = ?????????? (Ukranian)
*/

var queenalice = {
  
  init: function() {
    this.get_pending_games();
  },
  
  get_pending_games: function() {
  
    $.post(QUEENALICE_MYGAMES_URL, function(data){
  
      var detectingLanguageArr = new Array();
      var panel_tooltipNoGameLanguageArr = new Array();
      var gamesWaitingReLanguageArr = new Array();
      var panel_tooltipYourMoveLanguageArr = new Array();
      var invalidLoginReLanguageArr = new Array();
      var panel_tooltipSignInLanguageArr = new Array();
      var language = 'pt';
    
      // English translation
      detectingLanguageArr['en'] = 'content=\"en\"';
      panel_tooltipNoGameLanguageArr['en'] = 'No game waiting your move';
      gamesWaitingReLanguageArr['en'] = '(\\d+) games? waiting';
      panel_tooltipYourMoveLanguageArr['en'] = ' your move';
      invalidLoginReLanguageArr['en'] = 'You need to sign in to view this page';
      panel_tooltipSignInLanguageArr['en'] = 'Click here to sign in QueenAlice.com for game notifications.';
    
      // Portuguese translation
      detectingLanguageArr['pt'] = 'content=\"pt\"';
      gamesWaitingReLanguageArr['pt'] = '(\\d+) Jogos? Pendentes?';
      panel_tooltipNoGameLanguageArr['pt'] = 'Não há jogos aguardando o seu movimento';
      panel_tooltipYourMoveLanguageArr['pt'] = ' aguardando seu movimento';
      invalidLoginReLanguageArr['pt'] = 'Você precisa logar para ver esta página';
      panel_tooltipSignInLanguageArr['pt'] = 'Você precisa logar no QueenAlice.com para receber notificações de jogo.';
    
      // Spanish translation
      detectingLanguageArr['es'] = 'content=\"es\"';
      gamesWaitingReLanguageArr['es'] = '(\\d+) partidas? pendientes?';
      panel_tooltipNoGameLanguageArr['es'] = 'No hay juegos en espera de su movimiento';
      panel_tooltipYourMoveLanguageArr['es'] = ' en  espera de su movimiento';
      invalidLoginReLanguageArr['es'] = 'Tienes que iniciar sesión para ver esta página';
      panel_tooltipSignInLanguageArr['es'] = 'Tienes que iniciar sesión para recibir notificaciones de juego.';   
    
      var languageArr = new Array();
      languageArr[0] = 'en';
      languageArr[1] = 'pt';
      languageArr[2] = 'es';
    
      for (languageCode = 0; languageCode <= languageArr.length; languageCode++)
      {
        var detectingLanguage = new RegExp(detectingLanguageArr[languageArr[languageCode]], "g");
        if (detectingLanguage.exec(data))
        {
          language = languageArr[languageCode];
          break;
        } 
      }
    
      var gamesWaitingRe = new RegExp(gamesWaitingReLanguageArr[language], "g");
      gamesWaitingMatches = gamesWaitingRe.exec(data);

      var panel_text = '';
      var panel_tooltip = panel_tooltipNoGameLanguageArr[language];
      var image = 'logo.png';
      
      if (gamesWaitingMatches && gamesWaitingMatches.length > 0) {
        panel_text = gamesWaitingMatches[1];
        panel_tooltip = gamesWaitingMatches[0] + panel_tooltipYourMoveLanguageArr[language];
      }
      else {
        var invalidLoginRe = new RegExp(invalidLoginReLanguageArr[language], "g");
        var invalidLoginMatches = data.match(invalidLoginRe);

        if (invalidLoginMatches && invalidLoginMatches.length > 0) {
          panel_tooltip = panel_tooltipSignInLanguageArr[language];
          image = 'logo_mono.png';
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