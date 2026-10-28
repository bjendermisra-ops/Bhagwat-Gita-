/* Gita Quest v1 — independent, child-friendly learning journey.
   No advertising, tracking, network accounts or native Android calls.
   Gita verse text/translation comes from the existing local gita-v2.json.
   Scenario text is an educational illustration, not a verbatim Gita quote. */
(function(){
'use strict';
const APP=document.getElementById('quest-app');
const DATA_URL='data/gita-v2.json', STORAGE='gitaquest.v1.progress', LANG_KEY='gitaquest.v1.lang';
const L=(hi,mr,en)=>[hi,mr,en];
const W=[
 {mark:'⚖',title:L('कर्म की यात्रा','कर्माचा प्रवास','The Path of Action'),subtitle:L('सही काम करना सीखो','योग्य कृती करायला शिका','Choose thoughtful actions'),desc:L('मेहनत, साहस और जिम्मेदारी','प्रयत्न, धैर्य आणि जबाबदारी','Effort, courage and responsibility')},
 {mark:'❀',title:L('मन और मैत्री','मन आणि मैत्री','Mind & Friendship'),subtitle:L('मन को समझो','मन समजून घ्या','Understand your thoughts'),desc:L('धैर्य, दया और मीठे वचन','संयम, दया आणि गोड शब्द','Patience, kindness and gentle words')},
 {mark:'✧',title:L('भक्ति और विश्वास','भक्ती आणि विश्वास','Devotion & Trust'),subtitle:L('प्रेम और विवेक से आगे बढ़ो','प्रेम व विवेकाने पुढे जा','Grow with love and wisdom'),desc:L('विश्वास, सहायता और अच्छे निर्णय','विश्वास, मदत आणि चांगले निर्णय','Trust, care and good decisions')}
];
const C=(world,ref,title,story,options,correct,lesson)=>({kind:'choice',world,ref,title,story,options,correct,lesson});
const O=(world,ref,title,story,parts,lesson)=>({kind:'order',world,ref,title,story,parts,lesson});
const levels=[
C(0,'2.47',L('सच्चा सहयोग','खरी मदत','Helping Without Rewards'),
L('तुम्हारे दोस्त को गणित समझ नहीं आ रहा। उसकी मदद करने के लिए कोई पुरस्कार नहीं मिलेगा। तुम क्या करोगे?',
'तुझ्या मित्राला गणित समजत नाही. त्याला मदत केल्यावर बक्षीस मिळणार नाही. तू काय करशील?',
'Your friend struggles with math. Nobody will reward you for helping. What will you do?'),
[L('पुरस्कार मिलने पर ही मदद करूँगा','बक्षीस मिळाले तरच मदत करेन','Help only if I get a reward'),
L('अपना काम छोड़कर उसका मज़ाक उड़ाऊँगा','त्याची थट्टा करेन','Laugh at my friend'),
L('जितनी मदद कर सकता हूँ, खुशी से करूँगा','जमेल तशी आनंदाने मदत करेन','Help as best I can, with kindness')],2,
L('गीता 2.47 हमें कर्म पर ध्यान देने और फल से अत्यधिक आसक्त न होने की सीख देती है।',
'गीता २.४७ आपल्याला कर्मावर लक्ष देण्यास आणि फळाची अतिआसक्ती न ठेवण्यास शिकवते.',
'Gita 2.47 encourages sincere action without excessive attachment to results.')),
C(0,'2.48',L('हार के बाद','हरल्यानंतर','After a Setback'),
L('तुमने प्रतियोगिता में मेहनत की, लेकिन पहला स्थान नहीं मिला। तुम्हारी अगली चाल?',
'स्पर्धेत खूप मेहनत केलीस, पण पहिला क्रमांक मिळाला नाही. पुढे काय?',
'You practiced hard but did not win first place. What comes next?'),
[L('गुस्से में सब कुछ छोड़ दूँगा','रागाने सर्व सोडून देईन','Quit everything angrily'),
L('सीखकर फिर कोशिश करूँगा','शिकून पुन्हा प्रयत्न करेन','Learn and try again'),
L('दूसरों को दोष दूँगा','इतरांना दोष देईन','Blame everyone else')],1,
L('समत्व का अर्थ है सफलता और असफलता में संतुलन बनाए रखना।',
'समत्व म्हणजे यश आणि अपयशात मनाचा समतोल राखणे.',
'Equanimity means staying balanced through success and setbacks.')),
C(0,'3.19',L('घर की जिम्मेदारी','घरची जबाबदारी','A Small Responsibility'),
L('घर में सब व्यस्त हैं और पौधों को पानी चाहिए। तुम क्या करोगे?',
'घरी सगळे व्यस्त आहेत आणि झाडांना पाणी हवे आहे. तू काय करशील?',
'Everyone is busy at home and the plants need water. What will you do?'),
[L('किसी के कहने से पहले पानी दे दूँगा','कोणी सांगण्याआधी पाणी देईन','Water the plants without being asked'),
L('केवल फोटो खिंचवाने के लिए करूँगा','फक्त फोटोसाठी करेन','Do it only for praise'),
L('पौधों को सूखने दूँगा','झाडांना सुकू देईन','Ignore them')],0,
L('गीता 3.19 कर्तव्य को बिना आसक्ति के करने की प्रेरणा देती है।',
'गीता ३.१९ आसक्ती न ठेवता कर्तव्य करण्यास प्रेरणा देते.',
'Gita 3.19 points toward doing our responsibilities without attachment.')),
C(0,'3.21',L('उदाहरण बनो','चांगले उदाहरण','Lead by Example'),
L('खेल के बाद मैदान में कागज़ बिखरे हैं। छोटे बच्चे तुम्हें देख रहे हैं।',
'खेळानंतर मैदानात कागद पडले आहेत. लहान मुले तुला पाहत आहेत.',
'After a game, litter is scattered around. Younger children are watching you.'),
[L('किसी और के साफ करने का इंतज़ार','इतरांची वाट पाहीन','Wait for someone else'),
L('और कचरा फैलाना','अजून कचरा टाकेन','Make more mess'),
L('मिलकर सफाई शुरू करना','सगळ्यांना घेऊन स्वच्छता करेन','Start cleaning up together')],2,
L('अच्छे आचरण से दूसरे भी प्रेरणा ले सकते हैं।',
'चांगल्या आचरणातून इतरांनाही प्रेरणा मिळू शकते.',
'Our example can inspire other people to act well.')),
O(0,'2.14',L('भावना बदलती हैं','भावना बदलतात','Feelings Can Change'),
L('कठिन समय में शांत रहने के तीन छोटे कदम सही क्रम में चुनो।',
'कठीण वेळी शांत राहण्याचे तीन टप्पे योग्य क्रमाने लावा.',
'Put these three calming steps in a helpful order.'),
[L('रुको और साँस लो','थांबा आणि श्वास घ्या','Pause and breathe'),
L('स्थिति को समझो','परिस्थिती समजून घ्या','Understand the situation'),
L('धैर्य से आगे बढ़ो','धैर्याने पुढे जा','Move forward patiently')],
L('गीता 2.14 सुख-दुःख को अस्थायी समझकर धैर्य रखने की सीख देती है। यह क्रम अभ्यास के लिए है, श्लोक का शाब्दिक पाठ नहीं।',
'गीता २.१४ सुख-दुःख तात्पुरते समजून धैर्य शिकवते. हा क्रम शिकण्यासाठी आहे, श्लोकातील शब्द नाहीत.',
'Gita 2.14 teaches patience amid changing experiences. These steps are a learning activity, not the verse text.')),
C(1,'6.5',L('खुद का दोस्त बनो','स्वतःचे मित्र व्हा','Be Your Own Friend'),
L('पढ़ाई कठिन लग रही है और तुम अपने आप से कह रहे हो, “मैं कुछ नहीं कर सकता।”',
'अभ्यास कठीण वाटतो आहे आणि तू स्वतःला म्हणतोस, “मला काहीच जमत नाही.”',
'Studying feels hard and you tell yourself, “I can never do this.”'),
[L('अपने आप को बुरा कहता रहूँ','स्वतःला वाईट म्हणत राहीन','Keep putting myself down'),
L('छोटा लक्ष्य रखकर अभ्यास करूँ','लहान ध्येय ठेवून सराव करेन','Take one small learning step'),
L('किताब फेंक दूँ','पुस्तक फेकून देईन','Throw the book away')],1,
L('गीता 6.5 मनुष्य को अपने प्रयासों से स्वयं को ऊपर उठाने की याद दिलाती है।',
'गीता ६.५ स्वतःच्या प्रयत्नांनी उन्नती करण्याची आठवण देते.',
'Gita 6.5 reminds us to uplift ourselves through our efforts.')),
C(1,'6.26',L('भटकता मन','भटकणारे मन','A Wandering Mind'),
L('श्लोक पढ़ते समय ध्यान बार-बार दूसरी चीज़ों पर चला जाता है।',
'श्लोक वाचताना लक्ष वारंवार इतरत्र जाते.',
'While reading a verse, your attention keeps wandering.'),
[L('ध्यान भटके तो धीरे से वापस लाऊँ','लक्ष भरकटले तर शांतपणे परत आणेन','Gently bring attention back'),
L('अपने आप पर चिल्लाऊँ','स्वतःवर ओरडेन','Shout at myself'),
L('फिर कभी पढ़ूँ ही नहीं','पुन्हा कधीच वाचणार नाही','Never try reading again')],0,
L('गीता 6.26 चंचल मन को बार-बार शांतिपूर्वक केंद्रित करने की बात करती है।',
'गीता ६.२६ चंचल मन वारंवार शांतपणे एकाग्र करण्याचे सांगते.',
'Gita 6.26 describes gently bringing the wandering mind back.')),
C(1,'12.13',L('दया की जीत','दयाळूपणा','The Kindness Choice'),
L('एक नया बच्चा खेल में शामिल होना चाहता है लेकिन दूसरों से घबराता है।',
'एका नवीन मुलाला खेळात सहभागी व्हायचे आहे पण तो घाबरलेला आहे.',
'A new child wants to join a game but feels shy.'),
[L('उसे बाहर रहने दूँ','त्याला बाहेरच ठेवेन','Keep them out'),
L('उस पर हँसू','त्याची थट्टा करेन','Laugh at them'),
L('मित्रता से खेल में बुलाऊँ','मैत्रीने खेळात बोलावेन','Invite them kindly')],2,
L('गीता 12.13 करुणा, मैत्री और द्वेष-रहित व्यवहार का महत्त्व बताती है।',
'गीता १२.१३ करुणा, मैत्री आणि द्वेषरहित वागण्याचे महत्त्व सांगते.',
'Gita 12.13 values compassion, friendship and freedom from hostility.')),
C(1,'16.2',L('सच और साहस','सत्य आणि धैर्य','Courage to Be Honest'),
L('तुमसे गलती से एक किताब फट गई। कोई नहीं जानता कि किसने फाड़ी।',
'तुझ्याकडून चुकून पुस्तक फाटले. ते कोणी फाडले हे कोणालाही माहीत नाही.',
'You accidentally tear a book. Nobody knows who did it.'),
[L('किसी और पर दोष डालूँ','दुसऱ्यावर दोष टाकेन','Blame someone else'),
L('सच बताकर सुधारने की कोशिश करूँ','खरे सांगून दुरुस्त करेन','Tell the truth and help fix it'),
L('किताब छिपा दूँ','पुस्तक लपवेन','Hide the book')],1,
L('गीता 16.2 सत्य, अहिंसा और कोमलता जैसे गुणों की ओर प्रेरित करती है।',
'गीता १६.२ सत्य, अहिंसा आणि सौम्यतेसारखे गुण शिकवते.',
'Gita 16.2 names honesty, nonviolence and gentleness among good qualities.')),
O(1,'17.15',L('मीठे और सच्चे शब्द','गोड आणि खरे शब्द','Words That Help'),
L('अच्छी बात बोलने के तीन गुण सही क्रम में चुनो।',
'चांगले बोलण्याचे तीन गुण योग्य क्रमाने लावा.',
'Place the three helpful qualities of speech in order.'),
[L('सत्य बोलो','सत्य बोला','Speak truthfully'),
L('कोमलता रखो','सौम्यपणा ठेवा','Be gentle'),
L('भलाई का ध्यान रखो','हिताचा विचार करा','Consider what helps')],
L('गीता 17.15 वाणी की ऐसी तपस्या बताती है जिसमें सत्य, प्रिय और हितकारी वचन शामिल हों। यह सीखने वाला अभ्यास है।',
'गीता १७.१५ सत्य, प्रिय आणि हितकारी बोलण्याचे महत्त्व सांगते. हा शिकण्याचा उपक्रम आहे.',
'Gita 17.15 describes truthful, pleasing, beneficial speech. This is a learning activity.')),
C(2,'9.22',L('विश्वास के साथ प्रयास','विश्वासाने प्रयत्न','Trust & Steady Effort'),
L('तुम रोज थोड़ी देर गीता सीखना चाहते हो, लेकिन कुछ दिन मुश्किल लगते हैं।',
'तुला दररोज थोडी गीता शिकायची आहे, पण काही दिवस अवघड जातात.',
'You want to study the Gita regularly, but some days feel difficult.'),
[L('उपहास करूँ','थट्टा करेन','Make fun of learning'),
L('धैर्य से छोटी दिनचर्या बनाऊँ','धीराने लहान दिनक्रम बनवेन','Keep a gentle, steady routine'),
L('सब पर दबाव डालूँ','सर्वांवर दबाव टाकेन','Pressure everyone else')],1,
L('गीता 9.22 अनन्य भक्ति और ईश्वर पर विश्वास का संदेश देती है।',
'गीता ९.२२ एकनिष्ठ भक्ती आणि ईश्वरावरील विश्वासाचा संदेश देते.',
'Gita 9.22 speaks of steady devotion and trust in the Divine.')),
C(2,'12.14',L('छोटी भक्ति, बड़ा मन','लहान भक्ती, मोठे मन','A Peaceful Practice'),
L('सुबह तुमने प्रार्थना के लिए पाँच मिनट निकाले। बाद में घर में किसी ने तुम्हें परेशान किया।',
'सकाळी तू पाच मिनिटे प्रार्थना केलीस. नंतर घरात कुणीतरी तुला त्रास दिला.',
'You prayed quietly this morning. Later, someone at home annoyed you.'),
[L('शांत होकर विनम्रता से बात करूँ','शांतपणे नम्रतेने बोलेन','Pause and respond kindly'),
L('तुरंत चिल्लाऊँ','लगेच ओरडेन','Shout immediately'),
L('बदला लेने की सोचूँ','बदला घेईन','Plan revenge')],0,
L('गीता 12.14 संतोष, संयम और दृढ़ भक्ति का वर्णन करती है।',
'गीता १२.१४ समाधान, संयम आणि दृढ भक्तीचे वर्णन करते.',
'Gita 12.14 describes contentment, self-control and steady devotion.')),
C(2,'4.7',L('सही का साथ','योग्य गोष्टीची साथ','Standing for What Is Right'),
L('कुछ बच्चे किसी छोटे बच्चे को डराकर उसका सामान ले रहे हैं। तुम क्या करोगे?',
'काही मुले एका लहान मुलाला घाबरवून त्याचे सामान घेत आहेत. तू काय करशील?',
'Some children are bullying a younger child and taking their belongings.'),
[L('हँसकर आगे निकल जाऊँ','हसून पुढे जाईन','Walk away laughing'),
L('भीड़ के साथ मिल जाऊँ','गटात सामील होईन','Join the bullies'),
L('सुरक्षित रहकर किसी विश्वसनीय बड़े से मदद माँगूँ','सुरक्षित राहून विश्वासू मोठ्यांची मदत घेईन','Stay safe and ask a trusted adult for help')],2,
L('गीता 4.7 धर्म की रक्षा के महत्त्व का संदेश देती है। इस स्थिति में सुरक्षित सहायता लेना सही कदम है।',
'गीता ४.७ धर्मरक्षणाचे महत्त्व सांगते. येथे सुरक्षितपणे मोठ्यांची मदत घेणे योग्य आहे.',
'Gita 4.7 emphasizes the importance of righteousness. In this situation, seeking safe adult help is wise.')),
C(2,'18.66',L('मार्गदर्शन माँगो','मार्गदर्शन घ्या','Ask for Guidance'),
L('तुम्हें समझ नहीं आ रहा कि एक कठिन निर्णय कैसे लो।',
'एक कठीण निर्णय कसा घ्यावा हे तुला समजत नाही.',
'You feel unsure about a difficult choice.'),
[L('सही-गलत देखे बिना जल्दी करूँ','विचार न करता घाई करेन','Rush without thinking'),
L('प्रार्थना, विचार और विश्वसनीय मार्गदर्शन लूँ','प्रार्थना करून विचार व विश्वासू मार्गदर्शन घेईन','Reflect, pray and seek trusted guidance'),
L('सबसे नाराज़ हो जाऊँ','सर्वांवर रागावेन','Get angry with everyone')],1,
L('गीता 18.66 श्रीकृष्ण की शरणागति के संदेश से जुड़ी है। कठिन समय में विचार और भरोसेमंद मार्गदर्शन लेना उपयोगी है।',
'गीता १८.६६ श्रीकृष्णाच्या शरणागतीचा संदेश देते. कठीण वेळी विचार व विश्वासू मार्गदर्शन मदत करू शकते.',
'Gita 18.66 expresses surrender to Krishna. Thoughtful guidance and reflection can help in difficult moments.')),
O(2,'18.78',L('ज्ञान को जीवन में उतारो','ज्ञान आचरणात आणा','Put Wisdom into Practice'),
L('सीखने की यात्रा के अंतिम तीन कदम सही क्रम में चुनो।',
'शिकण्याच्या प्रवासातील शेवटचे तीन टप्पे योग्य क्रमाने लावा.',
'Arrange the three closing steps of your learning journey.'),
[L('मन से सीखो','मनापासून शिका','Learn with care'),
L('अच्छा निर्णय चुनो','चांगला निर्णय निवडा','Choose a wise action'),
L('उसे जीवन में अपनाओ','ते जीवनात आचरा','Put it into practice')],
L('गीता 18.78 योगेश्वर श्रीकृष्ण और अर्जुन के साथ धर्ममय विजय का संदेश देती है। खेल का यह क्रम एक अभ्यास है, मूल श्लोक नहीं।',
'गीता १८.७८ श्रीकृष्ण आणि अर्जुनासोबत धर्ममय विजयाचा संदेश देते. हा शिकण्याचा उपक्रम आहे, मूळ श्लोक नाही.',
'Gita 18.78 closes with the presence of Krishna and Arjuna and a vision of righteous success. This sequence is a learning exercise.'))
];
levels.forEach((v,i)=>v.id='q'+String(i+1).padStart(2,'0'));
const label={
  hindi:{back:'ऐप पर लौटें',home:'सभी यात्राएँ',hear:'सुनें',replay:'फिर से खेलें',begin:'यात्रा शुरू करें',continue:'जहाँ छोड़ा, वहाँ से',worlds:'तीन ज्ञान यात्राएँ',all:'सभी १५ चुनौतियाँ',completed:'पूर्ण',progress:'तुम्हारी प्रगति',challenge:'चुनौती',choose:'तुम क्या करोगे?',arrange:'क्रम से शब्द चुनो',check:'मेरा जवाब जाँचें',reset:'दोबारा चुनें',right:'बहुत सुंदर!',wrong:'अच्छी कोशिश! एक बार और सोचो।',next:'अगली चुनौती',finish:'यात्रा पूरी!',verse:'गीता से सीखो',note:'यह स्थिति बच्चों के सीखने के लिए बनाई गई है; मूल श्लोक नीचे दिया गया है।',source:'मूल श्लोक और अर्थ · ऐप के संग्रह से',missing:'इस श्लोक का पाठ अभी उपलब्ध नहीं है।',garden:'तुम्हारा ज्ञान-कमल',gardenSub:'हर पूरी चुनौती पर एक पंखुड़ी खिलेगी।',noTimer:'न टाइमर · न हार का दंड',offline:'बिना अकाउंट, डिवाइस पर सेव',intro:'कहानियाँ चुनो, श्लोक समझो, जीवन में अपनाओ।',hero:'खेलते-खेलते गीता सीखो',loadError:'यदि पाठ उपलब्ध न हो, तो चुनौती की सीख फिर भी पढ़ सकते हो।',help:'अभ्यास के लिए शब्दों को सही क्रम में टैप करो।',nothing:'अभी कोई पंखुड़ी नहीं — पहली चुनौती से शुरू करो।'},
  marathi:{back:'ॲपकडे परत',home:'सर्व प्रवास',hear:'ऐका',replay:'पुन्हा खेळा',begin:'प्रवास सुरू करा',continue:'पुढे सुरू ठेवा',worlds:'तीन ज्ञानप्रवास',all:'सर्व १५ आव्हाने',completed:'पूर्ण',progress:'तुमची प्रगती',challenge:'आव्हान',choose:'तू काय करशील?',arrange:'शब्द क्रमाने निवडा',check:'उत्तर तपासा',reset:'पुन्हा निवडा',right:'खूप छान!',wrong:'छान प्रयत्न! पुन्हा विचार करा.',next:'पुढील आव्हान',finish:'प्रवास पूर्ण!',verse:'गीतेतून शिका',note:'ही परिस्थिती शिक्षणासाठी आहे; मूळ श्लोक खाली आहे.',source:'मूळ श्लोक व अर्थ · ॲप संग्रह',missing:'हा श्लोक सध्या उपलब्ध नाही.',garden:'ज्ञानकमळ',gardenSub:'प्रत्येक आव्हानानंतर एक पाकळी फुलेल.',noTimer:'वेळेची अट नाही · शिक्षा नाही',offline:'खाते नाही · प्रगती डिव्हाइसवर',intro:'कथा खेळा, श्लोक समजून घ्या, जीवनात वापरा.',hero:'खेळता खेळता गीता शिका',loadError:'मूळ पाठ न मिळाल्यासही शिकवण वाचता येईल.',help:'शब्द योग्य क्रमाने निवडा.',nothing:'आत्तापर्यंत पाकळ्या नाहीत — सुरुवात करा.'},
  english:{back:'Back to app',home:'All journeys',hear:'Listen',replay:'Play again',begin:'Start your journey',continue:'Continue learning',worlds:'Three learning journeys',all:'All 15 challenges',completed:'Completed',progress:'Your progress',challenge:'Challenge',choose:'What would you do?',arrange:'Tap the steps in order',check:'Check my answer',reset:'Try again',right:'Beautiful choice!',wrong:'Good try! Think once more.',next:'Next challenge',finish:'Journey complete!',verse:'Learn from the Gita',note:'These situations are learning illustrations; the original verse appears below.',source:'Original verse and meaning · app collection',missing:'Verse text is unavailable right now.',garden:'Your wisdom lotus',gardenSub:'Each completed challenge adds one petal.',noTimer:'No timer · no penalties',offline:'No account · progress saved on device',intro:'Play through stories, understand verses and apply the lesson.',hero:'Learn the Gita through play',loadError:'You can still read the lesson if the source is unavailable.',help:'Tap each phrase in the correct order.',nothing:'No petals yet — start your first challenge.'}
};
function storageGet(k,f){try{const x=localStorage.getItem(k);return x===null?f:JSON.parse(x)}catch{return f}}
function storagePut(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}
const p=storageGet(STORAGE,{completed:[]});
const progress={completed:Array.isArray(p?.completed)?[...new Set(p.completed.filter(x=>typeof x==='string'&&levels.some(l=>l.id===x)))]:[]};
const optLang=storageGet(LANG_KEY,null);
const appLang=(()=>{try{return localStorage.getItem('bg_lang')}catch{return null}})();
let lang=['hindi','marathi','english'].includes(optLang)?optLang:['hindi','marathi','english'].includes(appLang)?appLang:'hindi';
const langs=['hindi','marathi','english'];const tr=(x)=>Array.isArray(x)?x[langs.indexOf(lang)]:x;
let screen='home',current=0,answer=null,picks=[],correct=false,verseData=null,dataReady=false;
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const ui=k=>label[lang][k];
const icon=(name)=>({arrow:'→',back:'←',check:'✓',lotus:'❀',spark:'✧',voice:'♫'})[name]||'✦';
const doneCount=world=>levels.filter(v=>(world===undefined||v.world===world)&&progress.completed.includes(v.id)).length;
const nextIncomplete=(world)=>{let x=levels.findIndex(v=>(world===undefined||v.world===world)&&!progress.completed.includes(v.id));return x<0?world===undefined?0:levels.findIndex(v=>v.world===world):x};
const worldCount=(world)=>levels.filter(v=>v.world===world).length;
function save(){storagePut(STORAGE,progress)}
function hashLink(index){return '#level/'+(index+1)}
function setRoute(index,write=true){
  const n=Math.max(0,Math.min(levels.length-1,index));
  current=n;screen='level';answer=null;picks=[];correct=false;
  if(write&&location.hash!==hashLink(n))location.hash=hashLink(n);
  render();window.scrollTo({top:0,behavior:'instant'});
}
function showHome(write=true){screen='home';answer=null;picks=[];correct=false;if(write&&location.hash!=='#home')location.hash='#home';render();window.scrollTo({top:0,behavior:'instant'})}
function syncHash(){const a=location.hash.match(/^#level\/(\d+)$/);if(a){setRoute(Number(a[1])-1,false)}else{showHome(false)}}
function toggleLang(next){if(!langs.includes(next))return;lang=next;storagePut(LANG_KEY,next);document.documentElement.lang=({hindi:'hi',marathi:'mr',english:'en'})[next];render()}
function shell(inner){
 APP.innerHTML='<div class="quest-layout"><div class="top-shell"><header class="quest-header"><a class="quest-brand" href="index.html#home" aria-label="'+esc(ui('back'))+'"><img src="logo.png" alt=""><span><strong>Gita Quest</strong><small>BHAGAVAD GITA · LEARN & PLAY</small></span></a>'+
 '<div class="header-actions"><select id="lang" class="lang-select" aria-label="Language"><option value="hindi"'+(lang==='hindi'?' selected':'')+'>हिन्दी</option><option value="marathi"'+(lang==='marathi'?' selected':'')+'>मराठी</option><option value="english"'+(lang==='english'?' selected':'')+'>English</option></select>'+
 '<button id="voice" class="sound-btn" type="button" aria-label="'+esc(ui('hear'))+'">♫ <span class="sound-label">'+esc(ui('hear'))+'</span></button></div></header></div><main class="quest-content">'+inner+'</main></div>';
 document.getElementById('lang').addEventListener('change',e=>toggleLang(e.target.value));
 document.getElementById('voice').addEventListener('click',speak);
}
function btn(label,attr=''){return '<button type="button" class="big-action" '+attr+'>'+esc(label)+' <span aria-hidden="true">→</span></button>'}
function renderHome(){
 const count=doneCount();const start=nextIncomplete();
 const b='<section class="hero"><div class="hero-copy"><span class="eyebrow">✦ GITA QUEST · LEARNING ADVENTURE</span><h1>'+esc(ui('hero'))+'</h1><p>'+esc(ui('intro'))+'</p><div class="hero-footer">'+btn(count?ui('continue'):ui('begin'),'data-level="'+start+'"')+'<span class="hero-counter">'+count+' / 15 '+esc(ui('completed'))+'</span></div></div></section>'+
 '<div class="info-strip"><span class="info-pill">✺ '+esc(ui('noTimer'))+'</span><span class="info-pill">❀ '+esc(ui('offline'))+'</span><span class="info-pill">3 '+esc(ui('worlds'))+'</span></div>'+
 '<section><div class="section-title"><div><h2>'+esc(ui('worlds'))+'</h2><p>'+esc(ui('intro'))+'</p></div></div><div class="world-grid">'+W.map((w,i)=>{
 const done=doneCount(i),all=worldCount(i);
 return '<button type="button" class="world-card" data-level="'+nextIncomplete(i)+'"><span class="world-symbol">'+w.mark+'</span><span class="world-title">'+esc(tr(w.title))+'</span><span class="world-description">'+esc(tr(w.desc))+'</span><span class="world-progress"><span class="progress-track"><span class="progress-fill" style="display:block;width:'+Math.round(done/all*100)+'%"></span></span>'+done+' / '+all+'</span></button>';
 }).join('')+'</div></section>'+
 '<section><div class="section-title"><div><h2>'+esc(ui('all'))+'</h2><p>'+count+' / 15 '+esc(ui('completed'))+'</p></div></div><div class="lesson-grid">'+levels.map((v,i)=>'<button type="button" data-level="'+i+'" class="lesson-pill'+(progress.completed.includes(v.id)?' done':'')+'"><span class="lesson-number">'+(progress.completed.includes(v.id)?'✓':String(i+1).padStart(2,'0'))+'</span><span>'+esc(tr(v.title))+'</span></button>').join('')+'</div></section>'+
 '<section class="garden"><div class="garden-art" aria-hidden="true">'+(count?'❀':'✿')+'</div><div><h3>'+esc(ui('garden'))+'</h3><p>'+esc(ui('gardenSub'))+' '+count+' / 15 '+esc(ui('completed'))+'</p><div class="progress-track" style="margin-top:10px"><div class="progress-fill" style="width:'+count/15*100+'%"></div></div></div></section>'+
 '<p class="quest-foot">'+esc(ui('note'))+'<br><a href="index.html#home">'+esc(ui('back'))+'</a> · '+esc(ui('noTimer'))+'</p>';
 shell(b);APP.querySelectorAll('[data-level]').forEach(el=>el.addEventListener('click',()=>setRoute(Number(el.dataset.level))));
}
function resultBox(v){
 if(!answer)return '';
 const good=answer==='correct';
 return '<div class="feedback '+(good?'success':'')+'" role="status" aria-live="polite"><strong>'+(good?'✦ '+esc(ui('right')):'✧ '+esc(ui('wrong')))+'</strong>'+
 (good?'<p>'+esc(tr(v.lesson))+'</p>':'<p>'+esc(ui('note'))+'</p>')+
 (good?btn(current===levels.length-1?ui('finish'):ui('next'),'id="next-level"'):'<button type="button" class="mini-action" id="retry">↻ '+esc(ui('reset'))+'</button>')+
 '</div>';
}
function scripture(v){
 if(!correct)return '';
 const entry=verseData&&verseData.get(v.ref);
 return '<div class="scripture"><h3>'+esc(ui('source'))+' · BG '+esc(v.ref)+'</h3>'+
 (entry?'<p class="verse">'+esc(entry.sanskrit||'')+'</p><p class="translation">'+esc(entry[lang]||'')+'</p>':'<p class="note">'+esc(dataReady?ui('missing'):ui('loadError'))+'</p>')+
 '<p class="note">'+esc(ui('note'))+'</p></div>';
}
function renderLevel(){
 const v=levels[current],w=W[v.world];
 const index=current+1,total=levels.length;
 const progressBar=Math.round(doneCount()/total*100);
 const h='<div class="quest-play"><div class="back-row"><button class="back-btn" id="home">← '+esc(ui('home'))+'</button><span class="index">'+esc(ui('challenge'))+' '+index+' / '+total+'</span></div>'+
 '<div class="challenge-layout"><section class="challenge-card"><div class="challenge-cover"><span class="eyebrow">'+w.mark+' '+esc(tr(w.title))+' · '+index+' / '+total+'</span><h1>'+esc(tr(v.title))+'</h1><p>'+esc(tr(w.subtitle))+'</p></div>'+
 '<div class="challenge-body"><span class="chapter-reference">✺ Bhagavad Gita '+esc(v.ref)+'</span><p class="story-quote">'+esc(tr(v.story))+'</p>'+
 '<p class="challenge-instruction">'+esc(ui(v.kind==='order'?'arrange':'choose'))+'</p>'+
 (v.kind==='choice'?'<div class="answers">'+v.options.map((o,i)=>'<button type="button" class="answer'+(answer==='correct'&&i===v.correct?' correct':'')+'" data-choice="'+i+'"'+(correct?' disabled':'')+'><span class="answer-letter">'+String.fromCharCode(65+i)+'</span><span>'+esc(tr(o))+'</span></button>').join('')+'</div>':
 '<p style="font-size:12px;color:#627163;margin-bottom:10px">'+esc(ui('help'))+'</p><div class="arrange-selection">'+(picks.length?picks.map((p,i)=>'<button type="button" data-unpick="'+i+'"'+(correct?' disabled':'')+'>'+esc(tr(v.parts[p]))+' ×</button>').join(''):'<span class="empty-hint">'+esc(ui('arrange'))+'</span>')+'</div><div class="arrange-options">'+[2,0,1].filter(i=>!picks.includes(i)).map(i=>'<button type="button" class="arrange-chip" data-pick="'+i+'"'+(correct?' disabled':'')+'>'+esc(tr(v.parts[i]))+'</button>').join('')+'</div><div class="arrange-actions"><button type="button" class="big-action" id="check-order"'+(picks.length!==v.parts.length||correct?' disabled':'')+'>'+esc(ui('check'))+' →</button><button type="button" class="mini-action" id="clear-order"'+(correct?' disabled':'')+'>↻ '+esc(ui('reset'))+'</button></div>')+
 resultBox(v)+scripture(v)+'</div></section>'+
 '<aside class="aside-card"><span class="aside-mark">'+w.mark+'</span><div class="eyebrow">'+esc(ui('progress'))+'</div><h2>'+esc(tr(w.title))+'</h2><p>'+esc(tr(w.desc))+'</p><div class="progress-track"><div class="progress-fill" style="width:'+progressBar+'%"></div></div><p class="count">'+doneCount()+' / '+levels.length+' '+esc(ui('completed'))+'</p><p style="margin-top:16px;font-size:11px">'+esc(ui('noTimer'))+'</p></aside></div></div>';
 shell(h);
 document.getElementById('home').addEventListener('click',()=>showHome());
 APP.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.choice))));
 APP.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{if(correct)return;picks.push(Number(b.dataset.pick));answer=null;render()}));
 APP.querySelectorAll('[data-unpick]').forEach(b=>b.addEventListener('click',()=>{if(correct)return;picks.splice(Number(b.dataset.unpick),1);answer=null;render()}));
 const check=document.getElementById('check-order');
 if(check)check.addEventListener('click',checkOrder);
 const clear=document.getElementById('clear-order');
 if(clear)clear.addEventListener('click',()=>{picks=[];answer=null;render()});
 const retry=document.getElementById('retry');
 if(retry)retry.addEventListener('click',()=>{answer=null;picks=[];render()});
 const next=document.getElementById('next-level');
 if(next)next.addEventListener('click',()=>{current===levels.length-1?showHome():setRoute(current+1)});
}
function markCorrect(){
 correct=true;answer='correct';
 const id=levels[current].id;
 if(!progress.completed.includes(id)){progress.completed.push(id);save()}
 render();
}
function choose(i){
 if(correct)return;
 if(i===levels[current].correct)markCorrect();
 else{answer='wrong';render()}
}
function checkOrder(){
 if(correct||picks.length!==3)return;
 if(picks.every((x,i)=>x===i))markCorrect();
 else{answer='wrong';render()}
}
function speak(){
 if(!window.speechSynthesis||typeof SpeechSynthesisUtterance==='undefined'){alert(lang==='english'?'Voice reading is unavailable on this device.':'इस डिवाइस पर आवाज़ पढ़ना उपलब्ध नहीं है।');return}
 const v=levels[current],msg=screen==='home'?ui('hero')+' '+ui('intro'):tr(v.story)+' '+(correct?tr(v.lesson):ui(v.kind==='order'?'arrange':'choose'));
 try{
  window.speechSynthesis.cancel();
  const utter=new SpeechSynthesisUtterance(msg);
  utter.lang=lang==='hindi'?'hi-IN':lang==='marathi'?'mr-IN':'en-IN';
  utter.rate=.87;window.speechSynthesis.speak(utter);
 }catch{/* Optional speech never blocks game play. */}
}
function render(){document.documentElement.lang=lang==='hindi'?'hi':lang==='marathi'?'mr':'en';screen==='home'?renderHome():renderLevel()}
window.addEventListener('hashchange',()=>{if(window.speechSynthesis)window.speechSynthesis.cancel();syncHash()});
window.addEventListener('visibilitychange',()=>{if(document.hidden&&window.speechSynthesis)window.speechSynthesis.cancel()});
syncHash();
fetch(DATA_URL).then(r=>{if(!r.ok)throw new Error('Gita data unavailable');return r.json()}).then(x=>{
 if(!Array.isArray(x))throw new Error('Invalid Gita data');
 verseData=new Map(x.filter(v=>v&&typeof v.verse_id==='string').map(v=>[v.verse_id,v]));
 dataReady=true;
 if(screen==='level'&&correct)render();
}).catch(()=>{dataReady=true;if(screen==='level'&&correct)render()});
})();
