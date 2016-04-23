(function($) {
    $.fn.imageResizeAbs = function(options) {

        var that = this;
        var settings = {
            width: 150,
            height: 150
        };
        options = $.extend(settings, options);

        if (!that.is('img')) {
            return;
        }

        return that.each(function() {

			$(that).attr('style','');
		
            var maxWidth = options.width;
            var maxHeight = options.height;
            var ratio = 0;
            var width = $(that).width();
            var height = $(that).height();
			
            if (width > maxWidth) {
                ratio = maxWidth / width;
                $(that).css('width',  width = maxWidth);
                $(that).css('height', height = height * ratio);
            } 
			if (height > maxHeight) {
                ratio = maxHeight / height;
                $(that).css('height', height = maxHeight);
                $(that).css('width',  width = width * ratio);
            }
        });
    };
})(jQuery);
(function (jQuery) {
    jQuery.fn.deserialize = function (data) {
        var f = jQuery(this),
            map = {},
            find = function (selector) { return f.is("form") ? f.find(selector) : f.filter(selector); };
        jQuery.each(data.split("&"), function () {
            var nv = this.split("="),
                n = decodeURIComponent(nv[0].replace(/\+/g, "%20")),
                v = nv.length > 1 ? decodeURIComponent(nv[1].replace(/\+/g, "%20")) : null;
            if (!(n in map)) {
                map[n] = [];
            }
            map[n].push(v);
        })
        jQuery.each(map, function (n, v) {
            find("[name='" + n + "']").val(v);
        })
        find("input:text,select,textarea").each(function () {
            if (!(jQuery(this).attr("name") in map)) {
                jQuery(this).val("");
            }
        })
        find("input:checkbox:checked,input:radio:checked").each(function () {
            if (!(jQuery(this).attr("name") in map)) {
                this.checked = false;
            }
        })
        return this;
    };
})(jQuery);


var state = new Object();
state['characters'] = new Object();
state['timers'] = new Object();
state['encounter'] = null;
state['ts'] = null;
state['poll'] = 2500;
state['lock'] = 0;
var confirm_dialog = null;

$(function() { init(); });
function init() {

	/* Global Init */
	
	$('form').submit(function(){ return false; });
	$('form').each(function(){ this.reset(); });
	
	confirm_dialog = $('#confirm_dialog').dialog({
		autoOpen: false,
		height: 230,
		width: 400,
		modal: true,
		resizable: false,
		buttons: {
			"Ok":function() 	{ $( this ).dialog( "close" ); },
			Cancel:function() 	{ $( this ).dialog( "close" ); }
		}
	});
	
	/* Section Specific Code */
	
	if(("" + window.location).indexOf('?e=') != -1)
	{
	/* BEGIN Encounter ONLY code */
	
		/* Init Add Character */
		
		var ignore_change = false;
		$('#nm_CID_ADDCHARACTER').autocomplete({
			source: "get_character.php",
			select: function( event, ui ) { 
				$('#form_CID_ADDCHARACTER').deserialize(ui.item.data);
				$('#form_CID_ADDCHARACTER_delete').button( "option", "disabled", false );
				load_character_image($('#form_CID_ADDCHARACTER'),$('#im_CID_ADDCHARACTER').val());
				ignore_change = true;
				$('#nm_CID_ADDCHARACTER').blur();
			},
			change: function (event, ui) {
				if (ignore_change)
					ignore_change = false;
				else
				{
					$('#form_CID_ADDCHARACTER_delete').button( "option", "disabled", true );
					$('#form_CID_ADDCHARACTER input:gt(0)').val('');
					$('#form_CID_ADDCHARACTER textarea').val('');
					$('#form_CID_ADDCHARACTER .dynamic-image').hide(); 
				}
			}
		});
		$('#form_CID_ADDCHARACTER button').button();
		
		$('#form_CID_ADDCHARACTER_delete').button('option','icons', {secondary: 'ui-icon-trash'});
		$('#form_CID_ADDCHARACTER_save').button('option','icons', {secondary: 'ui-icon-disk'});
			
		$('#form_CID_ADDCHARACTER input.toggle').button();
		$('#form_CID_ADDCHARACTER input.spin').spinner();
		$('#form_CID_ADDCHARACTER_delete').button( "option", "disabled", true );
		
		$('#im_CID_ADDCHARACTER').bind("change keyup input",function() {
			load_character_image($('#form_CID_ADDCHARACTER'),$('#im_CID_ADDCHARACTER').val())
		});
		$('#form_CID_ADDCHARACTER .dynamic-image').on('load', function(){ 
			$(this).imageResizeAbs( {width: 150, height: 150} ).show(); 
		});
		
		$('#form_CID_ADDCHARACTER_save').click(function(){
			$.ajax({
				type: "POST",
				url: "push_character.php",
				data: {
					name: $('#nm_CID_ADDCHARACTER').val(),
					data: $('#form_CID_ADDCHARACTER').serialize()
				}
			});
			$('#form_CID_ADDCHARACTER_delete').button( "option", "disabled", false );
		});
		
		$('#form_CID_ADDCHARACTER_delete').click(function(){
			confirmation('Are you sure you want to delete [' + $('#nm_CID_ADDCHARACTER').val() + ']', function() {
				$.ajax({
					type: "POST",
					url: "push_character.php",
					data: {	
						name: $('#nm_CID_ADDCHARACTER').val(),
						data: 'DELETE'
					}
				});
				$('#nm_CID_ADDCHARACTER').val('');
				$('#nm_CID_ADDCHARACTER').autocomplete('option', 'change').call($('#nm_CID_ADDCHARACTER'));				
			});
		});
		
		$( ".character_collapsable_accordion").accordion({ 
			collapsible: true,
			active: false
		});
		
		$('#form_CID_ADDCHARACTER_jb').click(function(){
			var id = $('#nm_CID_ADDCHARACTER').val();
			if (id.length < 1) return;
			if (state["characters"][id])
			{
				var num = 2;
				while(state["characters"][id + " #" + num]) num++;
				id = id + " #" + num;
			}
			state["characters"][id] = copy_character_template();
			
			var form = $('#' + state["characters"][id]);
			form.find('h1').text(id);
			form.find('[name="name"]').val(id);
			form.find('[name="notes"]').val($('#no_CID_ADDCHARACTER').val());
			form.find('[name="mote1"]').val($('#m1_CID_ADDCHARACTER').val());
			form.find('[name="mote2"]').val($('#m2_CID_ADDCHARACTER').val());
			form.find('[name="will"]').val($('#wp_CID_ADDCHARACTER').val());
			
			form.find('[name="img"]').val($('#im_CID_ADDCHARACTER').val());
			load_character_image(form,$('#im_CID_ADDCHARACTER').val());
			
			var data = new Object();
			data["name"] = id;
			data["data"] = form.serialize();
			
			$.ajax({
				type: "POST",
				url: "push_encounter.php",
				data: {	
					name: state['encounter'].val(),
					action: "ADD",
					data: JSON.stringify(data)
				},error: function (x,y,z) { if (x.status == 401) confirmation('This encounter has ended, no changes were made.'); }
			});
		});
		
		/* Init Vital Bar */
		state['ts'] = $('#vital_bar input[name="ts"]');
		state['encounter'] = $('#vital_bar input[name="encounter"]');
		state['encounter'].val(location.search.substring(3));
		
		$('#vital_bar button:lt(1)').button().click(function(){
			
			confirmation('Would you like to end the Encounter ?', function(){
				$.ajax({
					type: "POST",
					url: "push_encounter.php",
					data: {
						name: state['encounter'].val(),
						action: "DELETE",
						data: state['encounter'].val()
					},
					success: function () {
						//location.search = "";
						confirmation('This encounter has ended, no further changes will be updated.');
					},error: function (x,y,z) { if (x.status == 401) confirmation('This encounter has ended, no changes were made.'); }
				});
			});
		});
		
		$('#vital_tick').bind("input",function(){buffered_push(this);});
		
		$('#vital_bar button:gt(0)').button().click(function(){
		
			if($('#active_roster .toggle:not(:checked)').length > 0 && parseInt($('#vital_round').val()) > 0)
				confirmation('Are you sure you want to advance to the next round ? Not everyone has gone yet.',round_reset);
			else
				round_reset();
		});
	
		
		/* Init State */
		
		state['ts'].val(0);
		pull_data();
		
	/* END Encounter ONLY Code */
		
		$('#lobby_area').hide();
		$('#join_battle_dialog').hide();
		
	} else {
		
		$('#battle_area').hide();
		
	/* BEGIN Lobby ONLY Code */
	
		/* Init Create Encounter Dialog */
	
		var dialog = $( "#join_battle_dialog" ).dialog({
			autoOpen: false,
			height: 210,
			width: 400,
			modal: true,
			resizable: false,
			buttons: {
				"Create Encounter": function() {
					var encounter = new Object();
					encounter.name = (new Date()).getTime().toString(16);
					encounter.label = $('#join_battle_dialog_name').val();
					$.ajax({
						type: "POST",
						url: "push_encounter.php",
						data: {
							name: encounter.name,
							action: "INIT",
							data: JSON.stringify(encounter)
						},
						success: function (data) {
							window.location = "?e=" + encounter.name;
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							alert("Sorry, there was an error creating this encounter. Please try again.");
						}
					});
					dialog.dialog( "close" );
				},
				Cancel: function() {
					dialog.dialog( "close" );
				}
			},
			close: function() {
			}
		});

		/* Init Lobby Area */
		
		$('#lobby_area button').button().click(function() {
			dialog.dialog( "open" );
		});

		load_encounter_list();
		setInterval(load_encounter_list,300000);
	}
	
	/* END Lobby ONLY Code */
	/* END Encounter ONLY code */
}

function round_reset() {
	$.ajax({
		type: "POST",
		url: "push_encounter.php",
		data: {
			name: state['encounter'].val(),
			action: "NEXTROUND",
			data: state['encounter'].val(),
			ts: state['ts'].val()
		},
		success: process_data,
		error: function (x,y,z) { if (x.status == 401) confirmation('This encounter has ended, no changes were made.'); }
	});
}

function tick_highlight(force = false, animate=false) {
	
	if(force)
		$('.turn-indicator').removeClass('turn-indicator');
	var abort = false;
	if($('#active_roster .toggle:not(:checked)').length == 0) {
		$('#vital_bar button:gt(0)').addClass('turn-indicator');
		return;
	}
	$('#active_roster .turn-indicator').each(function(){
		if(!($(this).parents('form').find('.toggle').prop('checked')))
			abort = true;
	});
	if (abort) return;

	var tick = Number.NEGATIVE_INFINITY;
	$('#active_roster [name="init"]').each(function(){
		if ($(this).spinner("isValid") && $(this).spinner("value") > tick && !($(this).parents('form').find('.toggle').prop('checked')))
			tick = $(this).spinner("value");
	});
	if (tick >= $('#vital_tick').val())
		tick = $('#vital_tick').val() - ( force ? 0 : 1 );
	$('#vital_tick').val(tick);
	
	$('#active_roster .toggle:not(:checked)').each(function(){
		if (parseInt($(this).parents('form').find('[name="init"]').val()) >= tick)
		{
			$('label[for="' + $(this).attr('id') + '"]').addClass('turn-indicator');
			if (animate) {
				$('#active_roster').prepend($(this).parents('form'));
				$(this).parents('.character-container').hide().show( 'drop',{}, 500 );
			}
		}
	});
}

function pull_data() {
	$.ajax({
		type: "POST",
		url: "pull_encounter.php",
		data: {
			name: state['encounter'].val(),
			ts: state['ts'].val()
		},
		success: function(data) {
			process_data(data);
			if (state['poll'] > 0) setTimeout(pull_data,state['poll']);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.status == 403)
				location.search = "";
			if (XMLHttpRequest.status == 401 && $('#vital_bar button:lt(1)').text() == "End Encounter")
			{
				$('#vital_bar button:lt(1)').text('Encounter Ended. Back to Lobby ?');
				$('#vital_bar button:lt(1)').click(function(){ location.search = ""; });
				state['poll'] = 0;
			}
			if (state['poll'] > 0) setTimeout(pull_data,state['poll']);
			console.debug(errorThrown);
		}
	});
	
}

function process_data(data){
	var rush = false;
	var instructions = JSON.parse(data);
	for (var i in instructions) {
		//console.debug({current: state['ts'].val(), instruction:instructions[i]['action'], obj:instructions[i]});
		if (parseInt(state['ts'].val()) >= parseInt(instructions[i]['ts'])) continue;
		switch (instructions[i]['action'])
		{
			case "STATE":
				if (instructions[i]['data'].length == 0) break;
				flush_buffers();
				var s = JSON.parse(instructions[i]['data']);
				$('#vital_bar form').deserialize(s['vital']);
				for (var c in s['characters']){
					if(!state['characters'][c])
						state['characters'][c] = copy_character_template();
					
					var form = $('#' + state['characters'][c]);
					form.deserialize(s['characters'][c]);
					load_character_image(form,form.find('[name="img"]').val());
					form.find('h1').text(c);
				}
				$('#active_roster .toggle').button('refresh');
				tick_highlight(true, true);
				break;
			case "ADD":
				var character = JSON.parse(instructions[i]['data']);
				if (!state['characters'][character['name']])
					state['characters'][character['name']] = copy_character_template();
				var form = $('#' + state['characters'][character['name']]);
				form.deserialize(character['data']);
				load_character_image(form,form.find('[name="img"]').val());
				form.find('h1').text(character['name']);
				break;
			case "UPDATE":
				var update = JSON.parse(instructions[i]['data']);
				var ui = null;
				if (update['name'])
					ui = $('#' + state['characters'][update['name']] + ' [name="' + update['control'] + '"]');
				else
					ui = $('#vital_bar [name="' + update['control'] + '"]');
				if ($(ui).hasClass('toggle')) {
					$(ui).prop('checked',update["value"]);
					$(ui).button("refresh");
					tick_highlight();
				}
				else
					$(ui).val(update["value"]);
				break;
			case "NEXTROUND":
				$('#active_roster .toggle').prop('checked',false);
				$('#active_roster .toggle').button('refresh');
				$('#vital_round').val(1 + parseInt($('#vital_round').val()));
				
				$('#vital_tick').val(1000);
				tick_highlight(true);
				break;
			case "LOCK":
			
				if(state['lock'] == instructions[i]['ts']) break;
				state['lock'] = instructions[i]['ts'];
			
				var s = new Object();
				s['vital'] = $('#vital_bar form').serialize();
				s['characters'] = new Object();
				for (var c in state['characters'])
					s['characters'][c] = $('#' + state['characters'][c]).serialize();
				state['ts'].val(instructions[i]['ts']);
				$.ajax({
					type: "POST",
					url: "push_encounter.php",
					data: {
						name: state['encounter'].val(),
						action: "STATE",
						data: JSON.stringify(s),
						ts: state['ts'].val()
					},
					success: process_data
				});
				break;
			case "RETIRE":
				if (!state['characters'][instructions[i]['data']]) break;
				var form = $('#' + state['characters'][instructions[i]['data']]);
				state['characters'][instructions[i]['data']] = null;
				form.find('input,textarea,button').attr('disabled',true);
				form.find('.spin').spinner('option','disabled',true );
				form.find('.toggle').prop('checked',true).button('refresh');
				form.find('.character-text button').hide();
				$('#retired_roster').append(form);
				break;
			default:
				console.debug('Panic at the disco');
		}
		state['ts'].val(instructions[i]['ts']);
		if (instructions[i]['action'] == 'LOCK')
			state['ts'].val(state['ts'].val() - 1);
	}
}

function buffered_push(ui) {
	var id = $(ui).attr('id');
	var timer = state['timers'][id];
	if (timer)
		clearTimeout(timer);
	state['timers'][id] = setTimeout(function(){push_change(id);}, 2000);
}

function spin_num_only(ui) {
	if(!$(ui).spinner("isValid"))
		$(ui).spinner("value",0);
}

function push_change(id) {
	var ui = $('#'+id);
	var data = Object();
	data["name"] = $(ui).parents('form').find('[name="name"]').val();
	data["control"] = $(ui).attr('name');
	var action = "UPDATE";
	
	if ($(ui).hasClass('toggle'))
	{
		action = "UPDATELOCK";
		data["value"] = $(ui).prop('checked');
	}
	else
		data["value"] = $(ui).val();

	state['timers'][id] = null;
	
	$.ajax({
		type: "POST",
		url: "push_encounter.php",
		data: {
			name: state['encounter'].val(),
			action: action,
			data: JSON.stringify(data),
			ts: state['ts'].val()
		},
		success: function(data) {
			if (action == "UPDATELOCK") process_data(data);
		},error: function (x,y,z) { if (x.status == 401) confirmation('This encounter has ended, no changes were made.'); }
	});
}

function flush_buffers() {
	for(var id in state['timers']) {
		if (state['timers'][id]) {
			clearTimeout(state['timers'][id]);
			push_change(id);
		}
	}
}

function load_encounter_list() {
	$.ajax({
		type: "POST",
		url: "pull_encounter.php",
		success: function (data) {
			$('#lobby_area ul').html('');
			JSON.parse(data).forEach(function(item, index) {
				
				$('#lobby_area ul').append(
					$('<span>').append(
						$('<button>').text(item.label).click(function(){ 
							window.location = "?e=" + item.name;
						})).append(
						$('<button>').attr('class','trash').click(function(){
							
							confirmation('Would you like to end the [' + item.label + '] Encounter ?', function(){
								$.ajax({
									type: "POST",
									url: "push_encounter.php",
									data: {
										name: item.name,
										action: "DELETE",
										data: item.name
									},
									success: load_encounter_list
								});								
							});
						})
					).buttonset());
				$('#lobby_area ul .trash').button("option","icons",{primary: "ui-icon-trash"});
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("Sorry, there was an error creating this encounter. Please try again.");
		}
	});
}

function copy_character_template() {
	
	var rand = ("" + Math.random()).replace(".","");
	
	var copy = $('#character_template form').clone();
	copy.attr('id',copy.attr('id').replace('XXXX',rand));
	copy.find('[id$="XXXX"]').each(function (k,v)  { $(this).attr('id', $(this).attr('id').replace('XXXX',rand)); });
	copy.find('[for$="XXXX"]').each(function (k,v) { $(this).attr('for',$(this).attr('for').replace('XXXX',rand)); });
	
	$('#active_roster').append(copy);
	
	copy.submit(function(){ return false; });
	copy.find('button').button();
	copy.find('input.toggle').button();
	copy.find('input.spin').spinner();
	
	copy.find('.spin').bind("input spin",function(){buffered_push(this);spin_num_only(this)});
	copy.find('.toggle').bind("change",function(){buffered_push(this);});
	copy.find('textarea').bind("input",function(){buffered_push(this);});
	
	copy.find('.dynamic-image').on('load', function(){ 
		$(this).imageResizeAbs( {width: 150, height: 150} ).show(); 
	});
	
	copy.find('.character-text button').click(function(){
		var name = $(this).parents('form').find('[name="name"]').val();
		confirmation("Would you like " + name + " to leave the battle ?", function(){
			$.ajax({
				type: "POST",
				url: "push_encounter.php",
				data: {
					name: state['encounter'].val(),
					action: "RETIRE",
					data: name
				}
			});			
		});
	});
	return copy.attr('id');
}

function load_character_image(form,url) {
	if (url.indexOf("http") == -1 && url.length > 0)
		url = "http://" + url;
	$(form).find('.dynamic-image').attr('src', url).hide(); 
}

function confirmation(text,yes) {
	$('#confirm_dialog p').text(text);
	confirm_dialog.dialog("option","buttons",[
		{text: "Ok", click: function() { if(yes)yes(); $(this).dialog("close"); }},
		{text: "Cancel", click: function() { $(this).dialog("close"); }},
	]).dialog('open');
}
