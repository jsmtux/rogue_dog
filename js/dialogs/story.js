var storyContent = ﻿{"inkVersion":16,"root":[{"->":"Training"},"done",{"Training":["^So, I figured we could do some more training before the final match. Everyone expects you to win, and it would be a pity to let them down.","\n",["ev",{"^->":"Training.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","str","^.","/str","/ev",{"*":".^.c","flg":22},{"s":["^Good Thinking",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"^, I don't think I need it though.","\n","\n",{"->":".^.^.^.trials_start"},{"#f":7}]}],["ev",{"^->":"Training.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Could we go over the basics again?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Sure, no problem in reviewing the basics. ",{"->":".^.^.^.jumping_basics_review"},"\n",{"#f":7}]}],["ev",{"^->":"Training.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Final match? What? Who are you?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.story_review"},{"#f":7}]}],{"jumping_basics_review":[["^You'll be jumping a few fences, as any other day.","\n","^In order to jump just swipe in the direction you want. Whilst your finger is down you will see the trajectory you'll follow. Try it now.","\n","^COMMAND",{"#":"GOTO JUMP_TUTORIAL"},"\n",["^Excellent, you are good to go!","\n","^Do you have any other questions?","\n",["ev",{"^->":"Training.jumping_basics_review.0.g-0.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Nah, let's go!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.jumping_basics_review.0.g-0.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":"Training.trials_start"},{"#f":7}]}],["ev",{"^->":"Training.jumping_basics_review.0.g-0.5.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str",{"CNT?":"Training.story_review"},"!","/ev",{"*":".^.c","flg":19},{"s":["^Who are you, again?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.jumping_basics_review.0.g-0.5.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":"Training.story_review"},{"#f":7}]}],{"#f":7,"#n":"g-0"}],null],{"#f":3}],"story_review":[["^What? Is your memory implant faulty again?","\n","^Ok let's go quickly this time!","\n","^You are Rogelius, one of the top fence jumpers. Extremely famous in all BionicDogTown.","\n","^My name is Wheatley I'm in your collar and we've known each other our whole life. Your nature only won't allow you to be so intelligent, so you need me for that and I harvest some of your energy in return.","\n",["G>","ev",{"CNT?":"Training.jumping_basics_review"},"/ev",[{"->":".^.b","c":true},{"b":["^Let's go then! ",{"->":".^.^.^.5"},null]}],"nop","G<",null],"\n",["G>","ev",{"CNT?":"Training.jumping_basics_review"},"/ev",[{"->":".^.b","c":true},{"b":[{"->":"Training.trials_start"},{"->":".^.^.^.5"},null]}],"nop","G<",null],"\n","^Is that good enough?","\n",["ev",{"^->":"Training.story_review.0.14.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Sure, it was a small glitch, won't happen again.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.story_review.0.14.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^No problem, let's review the basics again, just in case.","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Training.story_review.0.15.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Stop talking already, you can't take a joke.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.story_review.0.15.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Whatever, let's review the trial basics again.","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],{"g-0":[{"->":"Training.jumping_basics_review"},{"#f":7}]}],{"#f":3}],"trials_start":["^COMMAND",{"#":"GOTO TRIALS"},"\n","done",{"#f":3}],"trials_finished_retry":["^What's goin on Rogelius? Are you not feeling well today? You failed ",["G>","ev",{"VAR?":"training_times_failed"},"out","/ev","G<",null],"^ times.","\n","^Please, try again.","\n","^COMMAND",{"#":"GOTO TRIALS"},"\n","done",{"#f":3}],"trials_finished_ok":[[["^Good Job!","\n","^Hey!, I was thinking, why we don't take some training outside. Since it is kind of illegal, probably we will be the only team ever doing that.","\n",["ev",{"^->":"Training.trials_finished_ok.0.g-0.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Sure! ",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.trials_finished_ok.0.g-0.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"^You are on fire today!","\n","\n",{"->":".^.^.^.^.g-1"},{"#f":7}]}],["ev",{"^->":"Training.trials_finished_ok.0.g-0.5.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^What? No! ",{"->":"$r","var":true},null],"c":["ev",{"^->":"Training.trials_finished_ok.0.g-0.5.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"^Are you crazy? We could get punished for that!","\n","\n","^Come on, you have been doing the same all your life. Let's go wild and get some adventure.","\n",{"->":".^.^.^.^.g-1"},{"#f":7}]}],{"#f":7,"#n":"g-0"}],{"g-1":["^Jump over that fence!","\n","^COMMAND",{"#":"GOTO JUMPFENCE"},"\n","done",{"#f":7}]}],{"#f":3}],"#f":3}],"Forest":["^Excellent! It looks like we have plenty of ways of training in the forest.","\n","^COMMAND",{"#":"GOTO EXPLOREFOREST"},"\n","done",{"found_obstacle":["^Oh! Wow, the path is blocked!","\n",["ev",{"^->":"Forest.found_obstacle.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^This would have never happened if we had stayed back at home.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_obstacle.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Well, you could use your enhanced barking to blow it off.","\n","^Do you know how to use it?","\n",["ev",{"^->":"Forest.found_obstacle.2.c.11.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Sure, I just like to wind you up!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_obstacle.2.c.11.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":"Forest.move_obstacle"},{"#f":7}]}],["ev",{"^->":"Forest.found_obstacle.2.c.12.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^If I knew already that branch wouldn't still be there.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_obstacle.2.c.12.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Ok, calm down.","\n",{"->":"Forest.explain_barking"},{"#f":7}]}],{"#f":7}]}],["ev",{"^->":"Forest.found_obstacle.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Don't worry, I can handle this.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_obstacle.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Are you sure you know how?","\n",["ev",{"^->":"Forest.found_obstacle.3.c.9.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Of course, leave me alone!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_obstacle.3.c.9.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":"Forest.move_obstacle"},{"#f":7}]}],["ev",{"^->":"Forest.found_obstacle.3.c.10.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Not sure, any suggestion?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_obstacle.3.c.10.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":"Forest.explain_barking"},{"#f":7}]}],{"#f":7}]}],{"#f":3}],"explain_barking":["^Your enhanced barking can produce heavy sound waves that can move objects or disarm electrical equipment.","\n","^It needs some skill to pull it of though, the version you have equipped is not fully automatic.","\n","^In order to make it work, tap the screen when the slider is over the green part.","\n","^Try it now.","\n",{"->":".^.^.move_obstacle"},{"#f":3}],"move_obstacle":["^COMMAND",{"#":"GOTO MOVEOBSTACLE"},"\n","done",{"#f":3}],"obstacle_moved":[[["^Excellent! we can go on now. You may find some holes in the ground, so be sure to jump over that. Without some extra energy we will die underground.","\n","^COMMAND",{"#":"GOTO WAITFORFIRSTENCOUNTER"},"\n","done",{"#f":7,"#n":"g-0"}],null],{"#f":3}],"failed_moving_obstacle":["^Ok, you need some more training. Try again!","\n","^COMMAND",{"#":"GOTO MOVEOBSTACLE"},"\n","done",{"#f":3}],"enemy_encounter":[[["^\"Soldiers are not allowed here. Unit must be faulty. Must exterminate...\"","\n",["ev",{"^->":"Forest.enemy_encounter.0.g-0.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^What? I'm not a soldier!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.enemy_encounter.0.g-0.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.^.g-1"},{"#f":7}]}],["ev",{"^->":"Forest.enemy_encounter.0.g-0.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^You think you can exterminate me, piece of dirt?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.enemy_encounter.0.g-0.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.^.g-1"},{"#f":7}]}],{"#f":7,"#n":"g-0"}],{"g-1":["^I don't think it will answer to you. But it confirms my suspicions. Bark at him to debilitate it. You can defend from his attacks by swiping in the direction he says, it is quite a dumb machine.","\n","^I'll explain what is going on as soon as you defeat it.","\n",["ev",{"^->":"Forest.enemy_encounter.0.g-1.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^You'd better!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.enemy_encounter.0.g-1.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.^.g-2"},{"#f":7}]}],["ev",{"^->":"Forest.enemy_encounter.0.g-1.5.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^You owe me one!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.enemy_encounter.0.g-1.5.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.^.g-2"},{"#f":7}]}],{"#f":7}],"g-2":["^COMMAND",{"#":"GOTO CONTINUEFIRSTENCOUNTER"},"\n","done",{"#f":7}]}],{"#f":3}],"enemy_encounter_defeated":[[["^It wasn't so difficult, was it?","\n","^Oh, wait he dropped a card. This cards can be used for improving your skills, but be careful, it sometimes attracts more enemies or obstacles.","\n",["^COMMAND",{"#":"GOTO PICKCARDFIRSTENCOUNTER"},"\n","done",{"#f":7,"#n":"g-1"}],{"#f":7,"#n":"g-0"}],null],{"#f":3}],"enemy_encounter_finished":[[["^Cool, so you just activated it. Now your health has been restored.","\n",["ev",{"^->":"Forest.enemy_encounter_finished.0.g-0.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^So, why did you get me here, to retrieve this stupid card?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.enemy_encounter_finished.0.g-0.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^No, but it'll probably be helpful to know that this monsters drop them. ",{"->":"Forest.enemy_explanation"},"\n",{"#f":7}]}],["ev",{"^->":"Forest.enemy_encounter_finished.0.g-0.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Why did this unit try to kill me?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.enemy_encounter_finished.0.g-0.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^I'm not entirely sure. ",{"->":"Forest.enemy_explanation"},"\n",{"#f":7}]}],{"#f":7,"#n":"g-0"}],null],{"#f":3}],"enemy_explanation":[["^There is a reason why I wanted to check it out here in the woods.","\n","^Rumours say we are not training for sports, but to take part on a war. This monster said something about us being a soldier. We should find answers.","\n",["ev",{"^->":"Forest.enemy_explanation.0.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^I can't believe we've been lied to all our life.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.enemy_explanation.0.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"^ Does this mean I am not the best fence jumper?","\n","\n","^What? Is that the only thing you ever think about? Anyway, let's go on.","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Forest.enemy_explanation.0.5.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^WHY ARE YOU ALWAYS GETTING ME INTO TROUBLE!?!?!?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.enemy_explanation.0.5.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Oh! Come on! Aren't you at least a bit curious about what is going on?","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],{"g-0":["^Almost forgot! Some of those cards contain energy cristals. I have an idea we can try, but you'll first need to find enough energy.","\n","^COMMAND",{"#":"GOTO CONTINUEUNTILENERGYFINISHED"},"\n","done",{"#f":7}]}],{"#f":3}],"found_energy":[["^Wow! Good job! I think we have enough energy to go underground!","\n",["ev",{"^->":"Forest.found_energy.0.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^What for? Didn't you say we would die underground?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_energy.0.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Don't worry, that is what the energy is for.","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],["ev",{"^->":"Forest.found_energy.0.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Are you trying to get us into more problems?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_energy.0.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^We have been ok up until now, haven't we?","\n",{"->":".^.^.^.g-0"},{"#f":7}]}],{"g-0":["^I guess you have already noticed, but enemies are becoming more aggressive and strong. They are trying harder to stop us. We need an advantage.","\n","^I´ve been scanning the terrain, and I can clearly see pieces of cards like those dropped by the monsters, but broken in pieces. I think it is worth a try.","\n",["ev",{"^->":"Forest.found_energy.0.g-0.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Wait, what? I could have used that in my competitions!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_energy.0.g-0.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n",{"->":".^.^.^.^.g-1"},{"#f":7}]}],["ev",{"^->":"Forest.found_energy.0.g-0.5.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^I don't think I can survive for much longer without some help.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_energy.0.g-0.5.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"^ Let's see what happens!","\n","\n",{"->":".^.^.^.^.g-1"},{"#f":7}]}],{"#f":7}],"g-1":["^COMMAND",{"#":"GOTO CONTINUEUNTILPIECESPICKED"},"\n","done",{"#f":7}]}],{"#f":3}],"found_gear":[["^Yes! This will help us! You look a bit stupid with that hat though!","\n","^Maybe we'll be able to pick some more gear if you keep searching underground!","\n",["^COMMAND",{"#":"GOTO WAITFORFIRSTBOSS"},"\n","done",[["ev","str","^START FIGHT AND GET INTERRUPTED BY BIG BOSS","/str","/ev",{"*":".^.c","flg":20},{"c":[{"->":".^.^.^.^.^.g-2"},{"#f":7}]}],{"#f":7,"#n":"g-1"}],{"#f":7,"#n":"g-0"}],{"g-2":["^What do we have here? I would have never thought a barely trained soldier like you would make it until here with all the security I have around.","\n",["ev",{"^->":"Forest.found_gear.0.g-2.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Not only that, I could easily kick your ass as well!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_gear.0.g-2.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Hehehe, whatever.","\n",{"->":".^.^.^.^.g-3"},{"#f":7}]}],["ev",{"^->":"Forest.found_gear.0.g-2.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Security? For what?",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_gear.0.g-2.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^What do you think? that anyone would be interested in your stupid fence jumping? that you were the best one for no reason?","\n","^You are simple pawns in our game of war. As soon as you get trained enough we switch your stupid friendly collar and get you in a fighting mood.","\n","^This security is needed so that the other factions won't attack our training camps.","\n",{"->":".^.^.^.^.g-3"},{"#f":7}]}],{"#f":7}],"g-3":["^You are a valuable asset to me though. So I´ll give you two options. Either surrender and we'll reset your consciousnes and get you back into training or die.","\n",["ev",{"^->":"Forest.found_gear.0.g-3.2.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^You'll never get me back there alive!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_gear.0.g-3.2.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Then die! ",{"->":"Forest.boss_battle"},"\n",{"#f":7}]}],["ev",{"^->":"Forest.found_gear.0.g-3.3.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^I won't give up my freedom!",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_gear.0.g-3.3.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^Then die! ",{"->":"Forest.boss_battle"},"\n",{"#f":7}]}],["ev",{"^->":"Forest.found_gear.0.g-3.4.$r1"},{"temp=":"$r"},"str",{"->":".^.s"},[{"#n":"$r1"}],"/str","/ev",{"*":".^.c","flg":18},{"s":["^Fair enough. Let's go back, this stupid collar is always getting me into problems.",{"->":"$r","var":true},null],"c":["ev",{"^->":"Forest.found_gear.0.g-3.4.c.$r2"},"/ev",{"temp=":"$r"},{"->":".^.^.s"},[{"#n":"$r2"}],"\n","^I knew you were not smart enough. Come here little boy. ","done","\n",{"#f":7}]}],{"#f":7}]}],{"#f":3}],"boss_battle":[["ev","str","^BATTLE AND LOOSE","/str","/ev",{"*":".^.c","flg":20},{"c":["done",{"#f":7}]}],{"#f":3}],"#f":3}],"global decl":["ev",0,{"VAR=":"training_times_failed"},"/ev","end",null],"#f":3}],"listDefs":{}};