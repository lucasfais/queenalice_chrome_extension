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

			var detecting;
			var panel_tooltipNoGame;
			var gamesWaitingRe;
			var panel_tooltipYourMove;
			var invalidLoginRe;
			var panel_tooltipSignIn;
			var language;
			var detectingLanguageRe = '<meta.*http\-equiv\=\"Content\-Language\".*content=\"(\\w{2})\">';
			
			var detectedLanguageRe = new RegExp(detectingLanguageRe, "g");
			language = detectedLanguageRe.exec(data);
			language = language[1];
			
			switch(language)
			{
				case 'en':
					// English translation
					gamesWaitingRe = '(\\d+) games? waiting';
					panel_tooltipNoGame = 'No game waiting your move';			
					panel_tooltipYourMove = ' your move';
					invalidLoginRe = 'You need to sign in to view this page';
					panel_tooltipSignIn = 'Click here to sign in QueenAlice.com for game notifications.';
					break;
				case 'pt':
					// Portuguese translation
					gamesWaitingRe = '(\\d+) Jogos? Pendentes?';
					panel_tooltipNoGame = 'Não há jogos aguardando o seu movimento';
					panel_tooltipYourMove = ' aguardando seu movimento';
					invalidLoginRe = 'Você precisa logar para ver esta página';
					panel_tooltipSignIn = 'Você precisa logar no QueenAlice.com para receber notificações de jogo.';
					break;
				case 'es':				  
					// Spanish translation
					gamesWaitingRe = '(\\d+) partidas? pendientes?';
					panel_tooltipNoGame = 'No hay juegos en espera de su movimiento';
					panel_tooltipYourMove = ' en  espera de su movimiento';
					invalidLoginRe = 'Tienes que iniciar sesión para ver esta página';
					panel_tooltipSignIn = 'Tienes que iniciar sesión para recibir notificaciones de juego.';				  
					break;
				case 'fr':	
					// French translation
					gamesWaitingRe = '(\\d+) parties? en attente';
					panel_tooltipNoGame = "Aucun jeu de l'attente de votre action";
					panel_tooltipYourMove = ' de votre action';
					invalidLoginRe = 'Vous devez vous connecter pour voir cette page';
					panel_tooltipSignIn = 'Cliquez ici pour vous QueenAlice.com pour les notifications de jeux.';				  
					break;
				case 'de':	
					// Deutch translation
					gamesWaitingRe = '(\\d+) Partien? warten';
					panel_tooltipNoGame = 'Kein Spiel wartet Ihren Umzug';			
					panel_tooltipYourMove = ' Ihren Umzug';
					invalidLoginRe = 'Sie müssen sich anmelden, um diese Seite zu sehen.';
					panel_tooltipSignIn = 'Klicken Sie hier um in QueenAlice.com für Spiel-Benachrichtigungen zu unterzeichnen.';				  
					break;
				case 'it':					
					// Italian translation
					gamesWaitingRe = '(\\d+) partite in attesa';
					panel_tooltipNoGame = 'Nessun gioco di attesa la mossa';			
					panel_tooltipYourMove = ' la tua mossa';
					invalidLoginRe = 'È necessario accedere per visualizzare questa pagina';
					panel_tooltipSignIn = 'Clicca qui per accedere QueenAlice.com per le notifiche di gioco.';
					break;
				default:
					// Language not supported
					language = false;
				break;				
			}
			
			if (!language){
				panel_tooltip = "Language not supported. Use English, Portuguese, Spanish, French, Deutch or Italian.";
			}else{
				
				//data = 'content="pt"';

				//alert(language[1]);

				var gamesWaitingRe = new RegExp(gamesWaitingRe, "g");
				gamesWaitingMatches = gamesWaitingRe.exec(data);

				var panel_text = '';
				var panel_tooltip = panel_tooltipNoGame;
				var image = 'logo.png';

				if (gamesWaitingMatches && gamesWaitingMatches.length > 0) {
					panel_text = gamesWaitingMatches[1];
					panel_tooltip = gamesWaitingMatches[0] + panel_tooltipYourMove;
				}
				else {
					var invalidLoginRe = new RegExp(invalidLoginRe, "g");
					var invalidLoginMatches = data.match(invalidLoginRe);

					if (invalidLoginMatches && invalidLoginMatches.length > 0) {
						panel_tooltip = panel_tooltipSignIn;
						image = 'logo_mono.png';
					}
				}

				chrome.browserAction.setIcon({path: image});

				chrome.browserAction.setBadgeText({
					text: panel_text
				});
			}

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