var storyContent = ﻿{"inkVersion":16,"root":[{"->":"Introduction"},"done",{"Introduction":[["^collar:Everything looks in order, let's head back home!","\n","^collar:Don't forget to grab some sticks for the fire in our way unless you want to freeze!","\n",["ev",{"^->":"Introduction.0.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:What? Who is talking? Get out of my head!!!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.0.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:Are you serious? Is your memory implant faulty again?","\n","^collar:Ok, let's make it brief. You are Rogelius, one of the dogs in charge of keeping the forest safe.","\n","^collar:My name is SAL, your companion since birth. I help you with everyday tasks and when things like this happen!!!","\n","^collar:Now go and get the damn sticks!","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Introduction.0.5.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:After making me patrol so much of the forest I thought you wanted to see me dead!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.0.5.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Introduction.0.6.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Yeah, we should get the gas stove fixed.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.0.6.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:Well, I doesn't really affect me. But sure.","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],{"g-0":["^COMMAND",{"#":"GOTO WAIT_STICKS"},"\n",{"->":".^.^.^.got_sticks"},{"#f":7}]}],{"got_sticks":[["^collar:Oh, I've got an update!","\n","^collar:There might be HIDDEN TREASURES underground.","\n","^collar:Quick!, click in the paw animation I've just highlighted.","\n",["ev",{"^->":"Introduction.got_sticks.0.6.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Ok, let's see.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.got_sticks.0.6.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Introduction.got_sticks.0.7.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Update? It's been a while since the last one! Is this another one of your stupid jokes?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.got_sticks.0.7.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:It is for real this time. Something interesting might be going on for a change.","\n","^collar:But you are right, I also thing something is a bit off.","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],{"g-0":["^COMMAND",{"#":"GOTO DIG_DIRT"},"\n",{"->":".^.^.^.^.found_bad_card"},{"#f":7}]}],{"#f":3}],"found_bad_card":[["^collar:Do you know what this is?","\n",["ev",{"^->":"Introduction.found_bad_card.0.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:A card?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.found_bad_card.0.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:Card?","\n","^collar:I don't know what that means.","\n","^collar:This is an ancient relic. Supposedly Our ancestors created them to design our world. Let's see what happens if you activate it.","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Introduction.found_bad_card.0.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Why do you always assume I don't know stuff? Let me just activate it!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.found_bad_card.0.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.g-0"},{"#f":7}]}],{"g-0":["^COMMAND",{"#":"GOTO CLICK_CARD"},"\n",{"->":".^.^.^.^.clicked_bad_card"},{"#f":7}]}],{"#f":3}],"clicked_bad_card":["^collar:Crap","\n","^collar:Let's get home","\n","^COMMAND",{"#":"GOTO GAME_ENCOUNTER"},"\n",{"->":".^.^.first_encounter"},{"#f":3}],"first_encounter":[["^collar:This shouldn't be here","\n",["ev",{"^->":"Introduction.first_encounter.0.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:No",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.first_encounter.0.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:And looks an awful lot like the one on the ancient device","\n",["ev",{"^->":"Introduction.first_encounter.0.2.c.9.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Yes",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.first_encounter.0.2.c.9.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:Crap","\n",["ev",{"^->":"Introduction.first_encounter.0.2.c.9.c.9.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Well, let me try something",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.first_encounter.0.2.c.9.c.9.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.^.^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Introduction.first_encounter.0.2.c.9.c.10.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Do you have any suggestions on what to do?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.first_encounter.0.2.c.9.c.10.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:Probably we can throw our sticks at it. I can help you aim, just click on the crosshair I'll set up when points to the green part.","\n","^collar:I'd say you'll have to do what the card said for defending","\n",{"->":".^.^.^.^.^.^.^.g-0"},{"#f":7}]}],{"#f":7}]}],{"#f":7}]}],["ev",{"^->":"Introduction.first_encounter.0.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:No Shit! Anyway, I know what to do!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.first_encounter.0.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.g-0"},{"#f":7}]}],{"g-0":["^COMMAND",{"#":"GOTO WAIT_COMBAT_FINISHED"},"\n",{"->":".^.^.^.^.combat_finished"},{"#f":7}]}],{"#f":3}],"combat_finished":["^collar: Nice! We got rid of it! Looks like it contained another card.","\n",["ev",{"^->":"Introduction.combat_finished.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Well \"I\" got rid of it. But whatever, let me grab my card.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.combat_finished.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"#f":7}]}],["ev",{"^->":"Introduction.combat_finished.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:I'm not sure I want to activate this.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.combat_finished.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:Well, what's the worst that coudld happen?","\n","^dog:...","\n","^COMMAND",{"#":"GOTO WAIT_FOR_LOOT"},"\n",{"->":".^.^.^.^.loot_finished"},{"#f":7}]}],{"#f":3}],"loot_finished":[["^collar:It looks like those monsters hoard helpful cards! Those will come in handy!","\n","^collar:We shouldn't go home now, we need to find answers.","\n",["ev",{"^->":"Introduction.loot_finished.0.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:HQ it is!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.loot_finished.0.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Introduction.loot_finished.0.5.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Answers where?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.loot_finished.0.5.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:At HQ, they were the ones who sent the weird update in the first place.","\n",["ev",{"^->":"Introduction.loot_finished.0.5.c.9.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:Let's do that then. And kick their asses once we get there!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.loot_finished.0.5.c.9.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Introduction.loot_finished.0.5.c.10.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^dog:HQ?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Introduction.loot_finished.0.5.c.10.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^collar:Come on! What happens to you today?","\n","^collar:Boss will explay once we get there.","\n","^collar:And hopefully fix your damn brain.","\n",{"->":".^.^.^.^.^.g-0"},{"#f":7}]}],{"#f":7}]}],{"g-0":["^collar:Just be careful, more of those enemies might appear on the way.","\n","^COMMAND",{"#":"GOTO CONTINUE_WAY"},"\n","done",{"#f":7}]}],{"#f":3}],"no_more_sticks":["^collar:Looks like you ran out of sticks!","\n","^collar:I know it might be dangerous, but maybe you should try to dig for them.","\n","done",{"#f":3}],"basic_enemy_card_found":["^collar:What is that??? A bunch of dirt?","\n","done",{"#f":3}],"bee_enemy_card_found":["^collar:Be careful with those missiles!","\n","done",{"#f":3}],"first_gear_card_found":["^collar:Nice! You'll be able to equip those!","\n","done",{"#f":3}],"#f":3}],"#f":3}],"listDefs":{}};