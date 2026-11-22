// The page in English and Georgian.
//
// English lives in the HTML. Georgian lives here, keyed by the elements' data-i18n names, and
// reuses the app's own Georgian wherever the app already says the same thing
// (Resources/Localizable.xcstrings). Georgian copy follows the app's rules: the polite plural,
// nouns singular after numbers, „…“ quotes, no reliance on capitals, and no dash or hyphen.

export const LANGS = ['en', 'ka'];
const STORE_KEY = 'neiro.lang';

export const KA = {
  // Page
  'meta.title': 'Neiro · ტვინის ვარჯიში, დღეში ხუთი წუთი',
  'meta.desc': 'Neiro ტვინის სავარჯიშო აპია iPhone ტელეფონისთვის. დღეში სამი მოკლე, თქვენზე მორგებული თამაში შვიდი უნარისთვის: მეხსიერება, ყურადღება, სისწრაფე, აზროვნების მოქნილობა, პრობლემის გადაჭრა, მათემატიკა და სიტყვები.',
  'skip': 'გადასვლა შინაარსზე',
  'brand.top': 'Neiro, ზემოთ დაბრუნება',
  'nav.sections': 'ნაწილები',
  'nav.day': 'დღე',
  'nav.games': 'თამაშები',
  'nav.try': 'სცადეთ',
  'nav.how': 'როგორ მუშაობს',
  'nav.faq': 'კითხვები',
  'nav.download': 'ჩამოტვირთვა',
  'nav.lang': 'ენა',
  'appstore.aria': 'ჩამოტვირთეთ Neiro App Store მაღაზიიდან',

  // Hero
  'hero.pill': 'ტვინის ვარჯიში iPhone ტელეფონისთვის',
  'hero.title': 'ავარჯიშეთ გონება, <em>დღეში ხუთი წუთით.</em>',
  'hero.lead': 'ყოველდღე სამი მოკლე თამაში, თქვენთვის შერჩეული შვიდი უნარის 28 თამაშიდან. ყოველი თამაში თქვენს ნეირონს ზრდის, ყოველი დასრულებული დღე კი ვარსკვლავს ანთებს.',
  'hero.try': 'სცადეთ თამაში აქვე',
  'hero.facts': 'მოკლედ',
  'hero.fact1': 'ადაპტური თამაში',
  'hero.fact2': 'გონებრივი უნარი',
  'hero.fact3': 'თამაში დღეში',
  'hero.skills': 'შვიდი უნარი',
  'shot.home': 'Neiro მთავარი ეკრანი: დღის ვარჯიშის ბარათი სამი თამაშით, დღის თავსატეხი, დღის გამოწვევა და Neiro ქულა 609.',

  // A day
  'day.eyebrow': 'ერთი დღე Neiro აპში',
  'day.title': 'სამი თამაში. <em>დაახლოებით ხუთი წუთი.</em>',
  'day.lead': 'ყველაზე კარგად ყოველდღიური მცირე ვარჯიში მუშაობს. ამიტომ ყოველ დღეს თავისი ფორმა აქვს: სამი მოკლე თამაში, თავსატეხი და გამოწვევა, თუ მეტი გსურთ, ბოლოს კი ვარსკვლავი.',
  'day.s1.title': 'სამი თამაში, შერჩეული თქვენთვის',
  'day.s1.body': 'ყოველდღე Neiro სამ თამაშს გეგმავს სამი სხვადასხვა უნარიდან. პირველ რიგში ის უნარები მოდის, რომელთა გაუმჯობესებაც გსურთ, მაგრამ ბოლო ორ დღეში ნავარჯიში უნარი თავის რიგს ელოდება, ასე რომ, ერთ კვირაში შვიდივე უნარს ივარჯიშებთ.',
  'day.s1.aside': 'ყოველი თამაში პირველად საცდელი რაუნდით იწყება, ასე რომ, თამაშისას ისწავლით.',
  'shot.adaptive': 'ფრენა, ყურადღების თამაში: პლანერი მწვანე რგოლებში მიფრინავს ღამის ხეობაზე, ოქროს ვარსკვლავებისკენ.',
  'day.s2.title': 'თავსატეხი ყველასთვის, გამოწვევა თქვენთვის',
  'day.s2.body': 'დღეში ერთი თავსატეხი, ყველასთვის ერთი და იგივე დაფა: ორშაბათს მარტივი, კვირას ყველაზე რთული. ზედ კი ერთი პატარა გამოწვევა, მაგალითად, ზედიზედ ექვსი სწორი პასუხი ან თამაში, რომელიც დღის სამეულში არ არის.',
  'day.s2.aside': 'თავსატეხი გასართობი დაგეგმვაა. ის თქვენს დონეს ემატება, უნარების ქულებს კი არ ცვლის.',
  'shot.puzzle': 'დღის თავსატეხი: ბურთულა ყინულოვან ტბაზე ქვებს შორის და ოქროს ვარსკვლავი, რომელსაც უნდა მიაღწიოს.',
  'day.s3.title': 'ვარსკვლავი, სერია და მზარდი ნეირონი',
  'day.s3.body': 'დღის ბოლოს თქვენი ნეირონი ყოველ თამაშზე ერთი კვანძით იზრდება. შემდეგ სერია გრძელდება და ამაღამ თქვენს ცაზე ვარსკვლავი აინთება, შვიდი ერთ თანავარსკვლავედში.',
  'day.s3.aside': 'ზედიზედ ყოველი შვიდი დღე სერიის დაცვას გაძლევთ იმ დღისთვის, როცა ვერ მოიცლით.',
  'shot.streak': 'ვარჯიშის დღის დასასრული: ნეირონი გაიზარდა, კვირის ალები ანთია და ახალი ვარსკვლავი კასიოპეას ემატება.',

  // Games
  'games.eyebrow': 'თამაშები',
  'games.title': '28 თამაში <em>შვიდი უნარისთვის.</em>',
  'games.lead': 'ყოველი თამაში იმ ამოცანის მოკლე, სათამაშო ვერსიაა, რომლითაც მეცნიერები გონებას სწავლობენ. ყოველი მათგანი თქვენ გერგებათ და ერთი ყოველდღიური წინადადებით გეუბნებათ, რას ავარჯიშებს.',
  'games.wall': 'ყველა 28 თამაში, დალაგებული უნარების მიხედვით',
  'games.note': 'შვიდი თამაში თავიდანვე ღიაა, თითო ყოველი უნარისთვის. ყოველი ახალი დონე კიდევ ერთს ხსნის, ოცდამეორე დონეზე კი 28 თამაშივე თქვენია. <span class="wall-hint">აირჩიეთ ნებისმიერი თამაში და ნახეთ, რას ავარჯიშებს.</span>',
  'craft.eyebrow': 'დეტალებზე ზრუნვით',
  'craft.title': 'თამაშები, რომლებიც <em>პატარა სამყაროებს ჰგავს.</em>',
  'craft.art.title': 'ცოცხალი ილუსტრაციები',
  'craft.art.body': 'ყოველ თამაშს საკუთარი მოძრავი ილუსტრაცია აქვს, კოდით დახატული, მის ბარათზე და შესავალ გვერდზე. დღის სამი თამაში მთავარი ეკრანის ზედა ნაწილს თავის ფერებში ღებავს.',
  'craft.3d.title': 'ექვსი თამაში სამ განზომილებაში',
  'craft.3d.body': 'განძი, ტრიალი, ფრენა, სიგნალი, ნავიგატორი და მუხრუჭი სამ განზომილებაშია დახატული აპის საკუთარი პატარა რენდერერით.',
  'craft.sound.title': 'ხმა და შეხება',
  'craft.sound.body': 'ყოველი ხმა სინთეზირებულია: მინისებრი ჟღერადობა და პენტატონიკური გამა ექოსთვის. ყოველ პასუხზე ნაზი ვიბრაცია.',
  'shot.games': 'თამაშების ბარათების რიგები უნარების მიხედვით, რომლებიც გვერდულად გადაადგილდება, თითოეული თავისი ილუსტრაციით, სირთულითა და რეკორდით.',
  'shot.3d': 'ტრიალი სამ განზომილებაში: კუბებისგან აწყობილი ოთხი ფიგურა და კითხვა, რომელი ემთხვევა ნიმუშს.',
  'gd.close': 'დახურვა',
  'gd.basis': 'საფუძველი',
  'gd.format': 'ერთი სესია',
  'gd.level': 'იხსნება',
  'gd.prev': '‹ წინა',
  'gd.next': 'შემდეგი ›',
  'gd.prevAria': 'წინა თამაში',
  'gd.nextAria': 'შემდეგი თამაში',

  // Try it
  'try.eyebrow': 'სცადეთ აქვე',
  'try.title': 'ორი თამაში, <em>პირდაპირ ბრაუზერში.</em>',
  'try.lead': 'აპის ორი თამაშის მოკლე ვერსია, აპის საკუთარი წესებით. ნახეთ, როგორ რთულდება, როცა სწორად პასუხობთ, და მარტივდება, როცა გიჭირთ.',
  'try.c.chip': 'მეხსიერება',
  'try.c.title': 'თანავარსკვლავედი',
  'try.c.body': 'ღამის ცაზე ვარსკვლავები აინთება. შეეხეთ იქ, სადაც იყვნენ.',
  'try.c.sky': 'ღამის ცა',
  'try.i.chip': 'აზროვნების მოქნილობა',
  'try.i.title': 'მელანი',
  'try.i.body': 'შეეხეთ მელნის ფერს და არა სიტყვას.',
  'hud.score': 'ქულა',
  'hud.diff': 'სირთულე',
  'hud.round': 'რაუნდი',
  'hud.time': 'დრო',
  'try.fine': 'აპში ყოველი თამაში უფრო გრძელია, თქვენი უნარების ქულას ემატება, ნეირონს ზრდის და გასახურებლად ერთი საფეხურით დაბლა იწყება, ვიდრე წინა ჯერზე დაასრულეთ.',

  // How it works
  'how.eyebrow': 'როგორ მუშაობს',
  'how.title': 'ყოველთვის <em>შესაძლებლობების ზღვარზე.</em>',
  'how.lead': 'ყოველი თამაში რთულდება, როცა კარგად გამოგდით, და მარტივდება, როცა გიჭირთ. ასე ყოველთვის თქვენი შესაძლებლობების ზღვარზე ვარჯიშობთ, სადაც ვარჯიში ყველაზე კარგად მუშაობს.',
  'how.right': 'სწორი',
  'how.missed': 'შეცდომა',
  'how.foot': 'იგივე იდეა ყველა თამაშშია: <strong>კიბის მეთოდი</strong>, ნასესხები იქიდან, როგორ ზომავენ მკვლევრები აღქმას. ყველა იქ ჩერდება, სადაც ვარჯიში ყველაზე რთულია, მაგრამ ჯერ კიდევ მოსაგებია.',
  'shot.progress': 'პროგრესის ფურცელი: Neiro ქულა 609 თორმეტკვირიანი გრაფიკით და ქულა შვიდივე უნარისთვის.',
  'how.p1.title': 'რეალურ კვლევებზე დაფუძნებული',
  'how.p1.body': 'ყოველი თამაში იმ ამოცანის მოკლე, სათამაშო ვერსიაა, რომლითაც მეცნიერები გონებას სწავლობენ. მაგალითად, ექო ეფუძნება კორსის ბლოკების ტესტს, კომპასი ფლანკერის ამოცანას, კოშკები კი ლონდონის კოშკს.',
  'how.p2.title': 'ქულა, რომელიც მხოლოდ თქვენზეა',
  'how.p2.body': 'ყოველი უნარის ქულა ნულიდან ათასამდეა და ეფუძნება ბოლო თამაშებში მიღწეულ სირთულესა და სიზუსტეს. ის მხოლოდ თქვენს თავს გადარებთ.',
  'how.p3.title': 'დონე ძალისხმევისთვის და არა ჭკუისთვის',
  'how.p3.body': 'თქვენი დონე აჩვენებს, რამდენი ივარჯიშეთ, და არასდროს იმას, რამდენად ჭკვიანი ხართ. გამოცდილება თამაშიდან მოდის და არა ქულებიდან, ყოველი დონე კი ახალ თამაშს ხსნის.',
  'how.research': 'საიდან მოდის თამაშები',

  // Neuron
  'neuron.eyebrow': 'თქვენი ნეირონი',
  'neuron.title': 'მთელი თქვენი ვარჯიშის <em>სურათი.</em>',
  'neuron.lead': 'მას შვიდი ტოტი აქვს, ყოველი უნარისთვის ერთი. ყოველი თამაში თავისი უნარის ტოტს ერთი კვანძით ზრდის, ასე რომ, ხედავთ, რას ავარჯიშებთ ყველაზე ხშირად და რას სჭირდება მეტი ყურადღება.',
  'neuron.play': 'ითამაშეთ თამაში',
  'neuron.countBefore': 'ნათამაშები თამაში: ',
  'neuron.countAfter': '',
  'neuron.week': 'ითამაშეთ ერთი კვირა',
  'neuron.seed': 'გაზარდეთ სხვა',
  'neuron.reset': 'თავიდან დაწყება',
  'neuron.note': 'აქ ის აპის იმავე წესებით იზრდება. ყოველი მოთამაშის ნეირონი საკუთარი საწყისი რიცხვიდან იზრდება, ამიტომ ორი ერთნაირი არ არსებობს.',
  'neuron.canvas': 'ინტერაქტიული ნეირონი შვიდი ფერადი ტოტით',

  // Sky
  'sky.eyebrow': 'თქვენი ცა',
  'sky.title': 'ყოველი დასრულებული დღე <em>ვარსკვლავს ანთებს.</em>',
  'sky.lead': 'შვიდი ვარსკვლავი ერთ თანავარსკვლავედს ქმნის, სულ თორმეტია, ნამდვილი ფიგურების მიხედვით დახატული. გამოტოვებული დღე ვარსკვლავს არ გართმევთ, შემდეგი უბრალოდ დაგელოდებათ.',
  'sky.days': 'ვარჯიშის დღეები',
  'sky.n1.title': 'სერია, რომლის შენარჩუნებაც ღირს',
  'sky.n1.body': 'სამი თამაში სერიას აგრძელებს. ის მომდევნო დღის ბოლომდე ძლებს, ასე რომ, საუზმისას არ დაიკარგება.',
  'sky.n2.title': 'დაცვა დატვირთული დღეებისთვის',
  'sky.n2.body': 'ყოველი შვიდი ზედიზედ დღისთვის სერიის ერთ დაცვას იღებთ და ორამდე შეგიძლიათ შეინახოთ. თუ დღეს გამოტოვებთ, დაცვა სერიას შეგინარჩუნებთ.',
  'sky.n3.title': 'არაფერი წაგერთმევათ',
  'sky.n3.body': 'თქვენი ცა იმ დღეებიდან გამოითვლება, როცა ივარჯიშეთ. გამოტოვებული დღე უკვე ანთებულ ვარსკვლავს არ ჩააქრობს.',

  // Puzzle and duels
  'daily.eyebrow': 'ყოველდღე და მეგობრებთან ერთად',
  'daily.title': 'ერთი თავსატეხი ყველასთვის. <em>დუელი ორისთვის.</em>',
  'puzzle.chip': 'დღის თავსატეხი',
  'puzzle.title': 'მიიყვანეთ ბურთულა <em>ვარსკვლავამდე.</em>',
  'puzzle.body': 'ბურთულა ყინულოვან ტბაზე სრიალებს, სანამ ქვა ან კიდე არ გააჩერებს, ვარსკვლავი კი მას იჭერს. მიიყვანეთ რაც შეიძლება ცოტა სვლით. ერთსა და იმავე დღეს ყველა ერთსა და იმავე დაფას თამაშობს, დღის პირველი ამოხსნები კი ერთ ცხრილში ხვდება, რომელსაც Game Center ინახავს.',
  'puzzle.ladder': 'სვლების მინიმუმი კვირის დღეების მიხედვით',
  'puzzle.mon': 'ორშ',
  'puzzle.tue': 'სამ',
  'puzzle.wed': 'ოთხ',
  'puzzle.thu': 'ხუთ',
  'puzzle.fri': 'პარ',
  'puzzle.sat': 'შაბ',
  'puzzle.sun': 'კვი',
  'puzzle.cap': 'სვლების მინიმუმი, ორშაბათიდან კვირამდე.',
  'puzzle.try': 'სცადეთ ერთი',
  'puzzle.board': 'პატარა თავსატეხი. ბურთულის გასასრიალებლად გამოიყენეთ ისრიანი ღილაკები ან გაუსვით თითი.',
  'puzzle.up': 'ზემოთ გასრიალება',
  'puzzle.left': 'მარცხნივ გასრიალება',
  'puzzle.down': 'ქვემოთ გასრიალება',
  'puzzle.right': 'მარჯვნივ გასრიალება',
  'puzzle.reset': 'თავიდან',
  'duel.chip': 'დუელები',
  'duel.title': 'იგივე თამაში. <em>იგივე რაუნდები.</em>',
  'duel.body': 'აირჩიეთ თამაში და ითამაშეთ პირველმა. მეგობარს იგივე რაუნდები შეხვდება იმავე სირთულით, მერე კი ქულებს შეადარებთ. არც ანგარიში, არც სერვერი: მთელი დუელი იმ ბმულშია, რომელსაც აგზავნით.',
  'duel.t1': 'თითო ცდა, თავიდან დაწყების გარეშე',
  'duel.t2': 'გაუგზავნეთ ჯგუფს და ნახეთ ყველა პასუხი',
  'duel.t3': 'რევანში თამაშს თავიდან არიგებს',
  'shot.duel': 'მეგობრის დუელი მელანში: ნინოს 1240 ქულა, რომელიც უნდა აჯობოთ, სირთულე 4.',

  // Details
  'details.eyebrow': 'დეტალები',
  'details.title': 'პატარა რამეები, <em>ზრუნვით გაკეთებული.</em>',
  'f.practice.title': 'საცდელი რაუნდები',
  'f.practice.body': 'როცა თამაშს პირველად თამაშობთ, საცდელი რაუნდი გასწავლით. ის ყველაზე მარტივი სირთულით იწყება და არსად ითვლება.',
  'f.widgets.title': 'ვიჯეტები',
  'f.widgets.body': 'თქვენი სერია, ნეირონი და დღის სამი თამაში მთავარ ეკრანზე და დაბლოკილ ეკრანზე.',
  'f.siri.title': 'Siri და Shortcuts',
  'f.siri.body': 'დაიწყეთ დღის ვარჯიში Siri ასისტენტით, Spotlight ძიებით, Shortcuts აპით ან Action ღილაკით.',
  'f.icloud.title': 'iCloud სარეზერვო ასლი',
  'f.icloud.body': 'თქვენი პროგრესის ასლი თქვენს საკუთარ iCloud ანგარიშში ინახება, ასე რომ, ახალი ტელეფონი იქიდან გააგრძელებს, სადაც გაჩერდით.',
  'f.reminder.title': 'ერთი ნაზი შეხსენება',
  'f.reminder.body': 'დღეში ერთი შეხსენება, თქვენ მიერ არჩეულ დროს. ის შეიძლება თქვენს სერიას ან დღის გამოწვევას ახსენებდეს.',
  'f.badges.title': 'ოცი სამკერდე ნიშანი',
  'f.badges.body': 'ეტაპები გზაზე, მაგალითად, „პირველი ნაპერწკალი“ და „მთელი ცა“.',
  'f.theme.title': 'ნათელი და მუქი',
  'f.theme.body': 'მელანი თბილ ქაღალდზე ან ცარცი ფიქალზე. ინტერფეისი მშვიდია, რომ ფერი შვიდ უნარს ეკუთვნოდეს.',
  'f.lang.title': 'ქართული და ინგლისური',
  'f.lang.body': 'ენა აპშივე იცვლება, გადატვირთვის გარეშე. სიტყვების თამაშები თითოეული ენისთვის ცალკეა დაწერილი და არა თარგმნილი.',
  'f.private.title': 'კონფიდენციალურობა თავიდანვე',
  'f.private.body': 'არც ანგარიში, არც თვალთვალი. თქვენი პროგრესი თქვენს ტელეფონზე ინახება და თქვენს საკუთარ iCloud ანგარიშში, თუ სარეზერვო ასლს ჩართულს დატოვებთ. <a class="inline-link" href="privacy.html">კონფიდენციალურობის პოლიტიკა</a>',

  // What to expect
  'promise.eyebrow': 'რას უნდა ელოდოთ',
  'promise.quote': 'ამ თამაშებში აუცილებლად გაუმჯობესდებით. <em>ამაზე მეტს არ დაგპირდებით.</em>',
  'promise.c1.title': 'გულწრფელად მეცნიერებაზე',
  'promise.c1.body': 'კვლევები აჩვენებს, რომ ნავარჯიში უნარების ზრდა რეალურია. რამდენად გადადის ეს ყოველდღიურ ცხოვრებაში, ჯერ კიდევ საკამათოა, ამიტომ Neiro არაფრის თავიდან აცილებას ან განკურნებას არ გპირდებათ.',
  'promise.c2.title': 'დანარჩენიც მნიშვნელოვანია',
  'promise.c2.body': 'ძილი, მოძრაობა, ურთიერთობები და ახლის სწავლა ტვინისთვის ძალიან მნიშვნელოვანია. Neiro მათ დამატებად განიხილეთ: დღეში რამდენიმე წუთი ფოკუსირებული ვარჯიში.',

  // FAQ
  'faq.eyebrow': 'კითხვები',
  'faq.title': 'კარგია, <em>თუ იცით.</em>',
  'faq.lead': 'სხვა რამე? აპის გვერდი <em>როგორ მუშაობს Neiro</em>, პარამეტრებში, მის ყველა ნაწილს ხსნის.',
  'faq.q1': 'რამდენ დროს მოითხოვს ყოველდღე?',
  'faq.a1': 'დაახლოებით ხუთ წუთს დღის ვარჯიშისთვის, რომელიც სამი მოკლე თამაშია. დღის თავსატეხი და გამოწვევა იმისთვისაა, თუ ცოტა მეტი გსურთ.',
  'faq.q2': 'რომელ უნარებს ავარჯიშებს Neiro?',
  'faq.a2': 'შვიდს: მეხსიერებას, ყურადღებას, სისწრაფეს, აზროვნების მოქნილობას, პრობლემის გადაჭრას, მათემატიკასა და სიტყვებს. თითოეულს ოთხი თამაში აქვს, დღის გეგმა კი კვირის განმავლობაში შვიდივეს მოიცავს და თქვენ მიერ არჩეული უნარებისკენ იხრება.',
  'faq.q3': 'უფრო ჭკვიანი გავხდები?',
  'faq.a3': 'Neiro ამას არ ამტკიცებს. თამაშებში აუცილებლად გაუმჯობესდებით და კვლევები აჩვენებს, რომ ნავარჯიში უნარების ზრდა რეალურია. რამდენად გადადის ეს ყოველდღიურ ცხოვრებაში, ჯერ კიდევ საკამათოა, ამიტომ Neiro არაფრის თავიდან აცილებას ან განკურნებას არ გპირდებათ.',
  'faq.q4': 'მეცნიერებას ეფუძნება თამაშები?',
  'faq.a4': 'თითოეული იმ ამოცანის მოკლე, სათამაშო ვერსიაა, რომლითაც მკვლევრები გონებას სწავლობენ, მაგალითად, კორსის ბლოკების ტესტი, ფლანკერის ამოცანა, სტრუპის ამოცანა ან ლონდონის კოშკი. ყოველი თამაშის ბარათზე წერია, რომელ ამოცანას ეფუძნება.',
  'faq.q5': 'რა ხდება, თუ თამაში ძალიან რთული ან ძალიან მარტივია?',
  'faq.a5': 'ასე დიდხანს არ დარჩება. ყოველი თამაში სწორი პასუხების შემდეგ რთულდება და შეცდომების შემდეგ მარტივდება, ასე რომ, იქ ჩერდება, სადაც გამოწვევაა, მაგრამ დაახლოებით ნახევარ შემთხვევაში მაინც იგებთ. ყოველი სესია გასახურებლად ერთი საფეხურით დაბლა იწყება, ვიდრე წინა ჯერზე დაასრულეთ.',
  'faq.q6': 'რა მოხდება, თუ დღეს გამოვტოვებ?',
  'faq.a6': 'სერია ბოლო ვარჯიშის მომდევნო დღის ბოლომდე ძლებს, გამოტოვებულ დღეს კი სერიის დაცვა გადაფარავს. დაცვას ზედიზედ ყოველი შვიდი დღე გაძლევთ, ორამდე. თქვენი ცა ვარსკვლავს არასდროს კარგავს: შემდეგი უბრალოდ დაგელოდებათ.',
  'faq.q7': 'ანგარიში მჭირდება?',
  'faq.a7': 'არა. Neiro არც ანგარიშს ითხოვს და არც თვალთვალს იყენებს. თქვენი პროგრესი ტელეფონზე ინახება და მისი ასლი თქვენს საკუთარ iCloud ანგარიშშია. დღის თავსატეხის ცხრილი Game Center სერვისს იყენებს, მხოლოდ თუ თავად შეუერთდებით, დუელები კი თქვენ მიერ გაგზავნილ ბმულებში მოგზაურობს. დაწვრილებით: <a class="inline-link" href="privacy.html">კონფიდენციალურობის პოლიტიკა</a>.',
  'faq.q8': 'რა მჭირდება სათამაშოდ?',
  'faq.a8': 'iPhone ტელეფონი iOS 17 ან უფრო ახალი ვერსიით. Neiro ქართულად და ინგლისურად არის, ნათელ და მუქ რეჟიმში, ენის შეცვლა კი აპშივე შეგიძლიათ.',

  // Final call and footer
  'final.icon': 'Neiro აპის ხატულა: ნეირონი შვიდი ფერადი ტოტით ღამის ცაზე.',
  'final.title': 'პირველი ვარჯიში <em>მზადაა.</em>',
  'final.lead': 'სამი მოკლე თამაში, დაახლოებით ხუთი წუთი. თითოეული საცდელი რაუნდით იწყება, ასე რომ, თამაშისას ისწავლით.',
  'final.meta': 'iPhone ტელეფონისთვის · iOS 17 ან უფრო ახალი · ქართული და English',
  'footer.nav': 'ქვედა მენიუ',
  'footer.games': 'თამაშები',
  'footer.how': 'როგორ მუშაობს',
  'footer.promise': 'რას უნდა ელოდოთ',
  'footer.faq': 'კითხვები',
  'footer.privacy': 'კონფიდენციალურობა',
  'footer.small': 'Neiro ტვინის სავარჯიშო თამაშია. ის სამედიცინო პროდუქტი არ არის და არც ერთ მდგომარეობას არ ადგენს, არ მკურნალობს და არ აცილებს თავიდან.<br>Apple, Apple ლოგო, iPhone და App Store კომპანია Apple Inc. სავაჭრო ნიშნებია. © 2026 Factory Labs.',

  // Privacy page
  'privacy.title': 'კონფიდენციალურობის პოლიტიკა · Neiro',
  'privacy.desc': 'როგორ ეპყრობა Neiro თქვენს მონაცემებს: არც ანგარიში, არც თვალთვალი, არც რეკლამა. თქვენი ვარჯიში თქვენს iPhone ტელეფონზე რჩება.',
  'privacy.back': 'მთავარ გვერდზე',
};

// Strings that scripts put on the page.
const UI = {
  en: {
    'toast.grew': '{skill} grew a node',
    'tile.aria': '{name}, a {skill} game. {tagline}',
    'gd.three': ' · Drawn in 3D',
    'gd.start': 'From the start',
    'gd.atLevel': 'At level {n}',
    'grow.aria': 'Play a {skill} game',
    'lang.fallback': 'Screens shown in Georgian for now, one of Neiro\'s two languages. The app is in English and Georgian, and switches between them without a restart.',
    'lang.match': 'Neiro is in English and Georgian, and switches between them without a restart.',
    'demo.start.c': 'Play Constellation',
    'demo.start.i': 'Play Ink',
    'demo.again': 'Play again',
    'c.cell': 'Point {r}, {c}',
    'c.intro': 'Six rounds. Remember where the stars light up.',
    'c.watch': 'Watch: {n} stars.',
    'c.turned': 'The sky turned. Find them as a shape.',
    'c.recall': 'Now tap where they were.',
    'c.allUp': 'All of them. One more star next time.',
    'c.all': 'All of them.',
    'c.missed': 'Not quite. The rings show where they were.',
    'c.result': 'You recalled <b>{right} of 6</b> skies and reached difficulty <b>{best}</b>. In the app a game runs twelve rounds.',
    'i.intro': 'Thirty seconds. Framed words ask for what the word says.',
    'i.tapInk': 'Tap the colour of the ink.',
    'i.tapWord': 'Framed: tap what the word says.',
    'i.slow': 'Too slow. A new word is coming.',
    'i.framedMiss': 'That one was framed: it asked for the word.',
    'i.inkWas': 'The ink was {color}.',
    'i.word': '{word} printed in {ink}{framed}',
    'i.framed': ', framed',
    'i.result': '<b>{right} of {total}</b> right, and you reached difficulty <b>{best}</b>. Your run is drawn under How it works.',
    'stairs.example': 'An example game of Ink',
    'stairs.mine': 'Your game of Ink',
    'stairs.rule': 'Four right in a row step it up. Two misses step it down.',
    'stairs.mineSub': '{right} of {total} right, up to difficulty {best}. Four right in a row step it up; two misses step it down.',
    'stairs.first': 'First answer',
    'stairs.last': 'Answer {n}',
    'sky.zero': 'Finish your first day of training to light your first star.',
    'sky.all': 'The whole sky, twelve constellations. Then it begins again.',
    'sky.toGo': '{name}: {n} {stars} to go.',
    'sky.star': 'star',
    'sky.stars': 'stars',
    'sky.finished': 'Finished',
    'sky.of7': '{n} of 7',
    'sky.waiting': 'Waiting',
    'sky.left': '{n} more {days} of training to finish it.',
    'sky.day': 'day',
    'sky.days': 'days',
    'glide.moves': '<b id="glide-moves">0</b> moves · fewest <b>{n}</b>',
    'glide.intro': 'Swipe, use the arrow keys, or tap the arrows.',
    'glide.keep': 'Keep sliding toward the star.',
    'glide.solved': 'Solved in {n}.',
    'glide.fewest': 'That\'s the fewest it can be done in.',
    'glide.canDo': 'It can be done in {n}.',
  },
  ka: {
    'toast.grew': '{skillGen} ტოტი გაიზარდა',
    'tile.aria': '{name}, {skillGen} თამაში. {tagline}',
    'gd.three': ' · სამ განზომილებაში',
    'gd.start': 'თავიდანვე',
    'gd.atLevel': 'დონე {n}',
    'grow.aria': 'ითამაშეთ {skillGen} თამაში',
    'lang.fallback': 'Neiro ქართულად და ინგლისურად არის და ენას აპშივე, გადატვირთვის გარეშე ცვლის.',
    'lang.match': 'Neiro ქართულად და ინგლისურად არის და ენას აპშივე, გადატვირთვის გარეშე ცვლის.',
    'demo.start.c': 'თამაშის დაწყება',
    'demo.start.i': 'თამაშის დაწყება',
    'demo.again': 'კიდევ ითამაშეთ',
    'c.cell': 'წერტილი: რიგი {r}, სვეტი {c}',
    'c.intro': 'ექვსი რაუნდი. დაიმახსოვრეთ, სად აინთება ვარსკვლავები.',
    'c.watch': 'უყურეთ: {n} ვარსკვლავი.',
    'c.turned': 'ცა შებრუნდა. იპოვეთ ისინი, როგორც ფიგურა.',
    'c.recall': 'ახლა შეეხეთ იქ, სადაც იყვნენ.',
    'c.allUp': 'ყველა იპოვეთ. შემდეგ ჯერზე ერთი ვარსკვლავით მეტი.',
    'c.all': 'ყველა იპოვეთ.',
    'c.missed': 'ცოტა დაგაკლდათ. რგოლები აჩვენებს, სად იყვნენ.',
    'c.result': 'გაიხსენეთ <b>{right} ცა ექვსიდან</b> და მიაღწიეთ სირთულეს <b>{best}</b>. აპში თამაში თორმეტ რაუნდს გრძელდება.',
    'i.intro': 'ოცდაათი წამი. ჩარჩოში მოქცეული სიტყვა იმას ითხოვს, რასაც ამბობს.',
    'i.tapInk': 'შეეხეთ მელნის ფერს.',
    'i.tapWord': 'ჩარჩო: შეეხეთ იმას, რასაც სიტყვა ამბობს.',
    'i.slow': 'ძალიან ნელა. ახალი სიტყვა მოდის.',
    'i.framedMiss': 'ეს სიტყვა ჩარჩოში იყო: ის სიტყვას ითხოვდა.',
    'i.inkWas': 'მელნის ფერი: {color}.',
    'i.word': '{word}, მელნის ფერი: {ink}{framed}',
    'i.framed': ', ჩარჩოში',
    'i.result': '<b>{right} სწორი {total} პასუხიდან</b>, მიღწეული სირთულე <b>{best}</b>. თქვენი თამაში „როგორ მუშაობს“ ნაწილშია დახატული.',
    'stairs.example': 'მელნის თამაშის მაგალითი',
    'stairs.mine': 'თქვენი თამაში მელანში',
    'stairs.rule': 'ზედიზედ ოთხი სწორი პასუხი სირთულეს ზრდის, ორი შეცდომა ამცირებს.',
    'stairs.mineSub': '{right} სწორი {total} პასუხიდან, მიღწეული სირთულე {best}. ზედიზედ ოთხი სწორი პასუხი სირთულეს ზრდის, ორი შეცდომა ამცირებს.',
    'stairs.first': 'პირველი პასუხი',
    'stairs.last': 'პასუხი {n}',
    'sky.zero': 'დაასრულეთ ვარჯიშის პირველი დღე და პირველი ვარსკვლავი აინთება.',
    'sky.all': 'მთელი ცა, თორმეტი თანავარსკვლავედი. შემდეგ ყველაფერი თავიდან იწყება.',
    'sky.toGo': '{name}: დასრულებამდე დარჩა {n} ვარსკვლავი.',
    'sky.star': '',
    'sky.stars': '',
    'sky.finished': 'დასრულდა',
    'sky.of7': '{n} შვიდიდან',
    'sky.waiting': 'ჯერ წინაა',
    'sky.left': 'დასრულებამდე დარჩა ვარჯიშის {n} დღე.',
    'sky.day': '',
    'sky.days': '',
    'glide.moves': '<b id="glide-moves">0</b> სვლა · მინიმუმი <b>{n}</b>',
    'glide.intro': 'გაუსვით თითი, გამოიყენეთ ისრიანი ღილაკები ან შეეხეთ ისრებს.',
    'glide.keep': 'განაგრძეთ ვარსკვლავისკენ.',
    'glide.solved': 'ამოხსნილია {n} სვლით.',
    'glide.fewest': 'ნაკლები სვლით მისი ამოხსნა შეუძლებელია.',
    'glide.canDo': 'მისი ამოხსნა {n} სვლითაც შეიძლება.',
  },
};

const INK_NAMES = {
  en: ['Red', 'Blue', 'Green', 'Yellow'],
  ka: ['წითელი', 'ლურჯი', 'მწვანე', 'ყვითელი'],
};

export function inkName(index, lang = currentLang()) {
  return INK_NAMES[lang][index];
}

export function currentLang() {
  return document.documentElement.lang === 'ka' ? 'ka' : 'en';
}

export function t(key, vars = {}, lang = currentLang()) {
  const s = UI[lang][key] ?? UI.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
}

// The English in the page, kept the first time an element is translated, so switching back
// needs no reload.
const english = new WeakMap();
const keep = (el, name, value) => {
  const saved = english.get(el) || {};
  if (!(name in saved)) saved[name] = value;
  english.set(el, saved);
  return saved[name];
};

export function applyStatic(lang = currentLang(), root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const en = keep(el, 'html', el.innerHTML);
    const ka = KA[el.dataset.i18n];
    el.innerHTML = lang === 'ka' && ka != null ? ka : en;
  });
  for (const [data, attr] of [['i18nAlt', 'alt'], ['i18nAria', 'aria-label'], ['i18nContent', 'content']]) {
    const sel = `[data-${data.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}]`;
    root.querySelectorAll(sel).forEach((el) => {
      const en = keep(el, attr, el.getAttribute(attr) || '');
      const ka = KA[el.dataset[data]];
      el.setAttribute(attr, lang === 'ka' && ka != null ? ka : en);
    });
  }
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  document.querySelectorAll('[data-lang-block]').forEach((b) => { b.hidden = b.dataset.langBlock !== lang; });
}

export function setLang(lang, { remember = true } = {}) {
  if (!LANGS.includes(lang)) return;
  document.documentElement.lang = lang;
  if (remember) {
    try { localStorage.setItem(STORE_KEY, lang); } catch { /* Private browsing: the link still carries it. */ }
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }
  applyStatic(lang);
  // Links to the other page keep the language.
  document.querySelectorAll('a[data-keep-lang], a[href^="privacy.html"], a[href^="index.html"]').forEach((a) => {
    const url = new URL(a.getAttribute('href'), location.href);
    url.searchParams.set('lang', lang);
    a.href = url.pathname.split('/').pop() + url.search + url.hash;
  });
  document.dispatchEvent(new CustomEvent('neiro:lang', { detail: { lang } }));
}

export function mountLangSwitch() {
  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
  setLang(currentLang(), { remember: false });
  document.documentElement.classList.remove('lang-pending');
}
