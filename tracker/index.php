<?php
require_once('./../common/whoami.php');
if ($login == 'Anonymous')
	header( 'Location: www.example.com/login' ) ;
?>
<html>
	<head>
		<title>Exalted 3e Tick Tracker</title>
		<link rel="stylesheet" href="../common/jQueryUI/themes/smoothness/jquery-ui.min.css">
		<link rel="stylesheet" href="../common/jQueryUI/jquery-ui.structure.min.css">
		<link rel="stylesheet" href="tracker.css">
		<script src="../common/jquery.js"></script>
		<script src="../common/jQueryUI/jquery-ui.min.js"></script>
		<script src="logic.js"></script>
	</head>
	<body>
		<div id="battle_area">
			<div class="character_collapsable_accordion">
				<h3>Add Character</h3>
				<div>
					<form id="form_CID_ADDCHARACTER">
						<div class="character-container">
							<div class="character-portrait">
								<img class="dynamic-image">
							</div>
							<div class="character-text">
								<div class="text-controls">
									<div>
										<label for="nm_CID_ADDCHARACTER">Name</label>		
										<input type="text" name="name" id="nm_CID_ADDCHARACTER">
									</div>
									<div>
										<label for="im_CID_ADDCHARACTER">Image URL</label>	
										<input type="text" name="img"  id="im_CID_ADDCHARACTER">
									</div>
								</div>
								<textarea name="notes" id="no_CID_ADDCHARACTER"></textarea>
							</div>
							<div class="character-inputs">
								<label for="m1_CID_ADDCHARACTER">Personal</label>	<input name="mote1" maxlength="3" class="spin" id="m1_CID_ADDCHARACTER">
								<label for="m2_CID_ADDCHARACTER">Peripheral</label>	<input name="mote2" maxlength="3" class="spin" id="m2_CID_ADDCHARACTER">
								<label for="wp_CID_ADDCHARACTER">Willpower</label>	<input name="will"  maxlength="3" class="spin" id="wp_CID_ADDCHARACTER">
							</div>
							<div class="character-controls">
								<button id="form_CID_ADDCHARACTER_delete">Delete Character</button>
								<button id="form_CID_ADDCHARACTER_save">Save Character</button> <br>
								<button id="form_CID_ADDCHARACTER_jb" class="jb">Join Battle</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div id="vital_bar" class="floaty">
				<form>
					<button>End Encounter</button>
					<input type="hidden" name="encounter">
					<input type="hidden" name="ts">
					<span>
						<label for="vital_round">Round</label><input type="text" name="round" id="vital_round" readonly value="0">
						<label for="vital_tick">Tick</label><input type="text" name="tick" id="vital_tick" value="0">
						<Button>Next Round</button>
					</span>
				</form>
			</div>
			<div id="active_roster"></div>
			<div id="retired_roster"></div>
		</div>
		<div id="lobby_area">
			<h1>Exalted 3e Tick Tracker</h1>
			<button>Create a New Encounter</button>
			<ul></ul>
		</div>
		<div id="join_battle_dialog" title="Please name the new Encounter">
			<form>
				<input type="text" name="encounter_name" id="join_battle_dialog_name" class="text ui-widget-content ui-corner-all">
				<input type="submit" tabindex="-1">
			</form>
		</div>
		<div id="confirm_dialog" title="Confirmation Dialog"><p></p></div>
		<div id="character_template">
			<form id="form_CID_XXXX">
				<div class="character-container">
					<div class="character-portrait">
						<img class="dynamic-image">
					</div>
					<div class="character-text">
						<h1>Character Name Placeholder</h1> 
						<button>Leave Battle</button>
						<input type="hidden" name="name">
						<input type="hidden" name="img">
						<textarea name="notes" id="no_CID_XXXX"></textarea>
					</div>
					<div class="character-inputs">
						<label for="m1_CID_XXXX">Personal</label>	<input name="mote1" maxlength="3" class="spin" id="m1_CID_XXXX">
						<label for="m2_CID_XXXX">Peripheral</label>	<input name="mote2" maxlength="3" class="spin" id="m2_CID_XXXX">
						<label for="wp_CID_XXXX">Willpower</label>	<input name="will"  maxlength="3" class="spin" id="wp_CID_XXXX">
					</div>
					<div class="character-controls">
						<label for="in_CID_XXXX">Initiative</label>	<input name="init"  maxlength="3" class="spin"  id="in_CID_XXXX" value="3">
						<label for="go_CID_XXXX">GO</label>			<input name="go" type="checkbox" class="toggle" id="go_CID_XXXX">
					</div>
				</div>
			</form>
		</div>
	</body>
</html>
