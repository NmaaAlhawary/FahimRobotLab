// UI strings, chapters (concepts) and missions. Arabic + English.

const STRINGS = {
  en: {
    title: 'Fahim Robot Lab',
    subtitle: 'Discover how real robots work: motors, servos, gears and sensors. Then drive Fahim in the lab!',
    start: 'Enter the lab ▶', continue: 'Continue ▶', langBtn: 'عربي', map: '⬅ Lab', learn: 'What is it?',
    hint: '💡 Hint', reset: '↺ Reset', run: '▶ Run', next: 'Next mission ▶', replay: '↺ Play again', toMap: 'Back to lab',
    win: 'Mission complete! 🎉', learned: 'You learned: {c}!', inLife: 'In real life', inKit: 'In the Fahim kit',
    teacherTip: '🧑‍🏫 Teacher tip (hands-on activity)', letsGo: "Let's go!", allDone: 'All missions done! You are a robot engineer 🏆',
    monitor: '📟 Sensor monitor', mistakes: 'Mistakes: {n}', round: 'Round {n} of {m}',
    // parts
    sense: 'Sense', think: 'Think', act: 'Act', power: 'Power',
    senseD: 'sensors: inputs', thinkD: 'the brain', actD: 'outputs', powerD: 'energy',
    pickPart: 'Tap a part, then tap the box where it belongs.',
    wrongBin: 'Not quite. Ask yourself: does it collect information, decide, do something, or give energy?',
    // motors
    leftMotor: 'Left motor', rightMotor: 'Right motor', stopMotors: '■ Stop motors', resetBot: '↺ Reset robot',
    st_stop: 'Fahim is stopped.', st_fwd: 'Both wheels forward at the same speed → straight ahead.',
    st_back: 'Both wheels backward → reversing.', st_spinL: 'Wheels in opposite directions → spinning left on the spot.',
    st_spinR: 'Wheels in opposite directions → spinning right on the spot.',
    st_curveL: 'Right wheel faster → curving left.', st_curveR: 'Left wheel faster → curving right.',
    st_pivotL: 'Only the right wheel turns → pivoting left around the left wheel.',
    st_pivotR: 'Only the left wheel turns → pivoting right around the right wheel.',
    bump: 'Bump! Fahim hit a wall.', leftCircle: 'Fahim left the circle. Spin on the spot: one wheel forward, one backward.',
    stopHere: 'STOP here', holdAim: 'Point the orange nose at the glowing lantern…',
    // servo
    servoAngle: 'Servo angle', fire: '🎯 Launch', servoNow: 'Servo is at {a}° → going to {b}°', miss: 'Missed! Read the angle on the protractor and try again.',
    // gears
    motorGear: 'Motor gear (small engine side)', wheelGear: 'Wheel gear', teeth: '{n} teeth', ratio: 'Gear ratio',
    speed: 'Speed', strength: 'Strength', test: '▶ Test drive', notStrong: 'Too weak! The car could not climb. Try a gear that gives more strength.',
    tooSlow: 'Too slow! Time {s}s, limit {l}s. Try a gear that gives more speed.', timeLbl: 'Time: {s}s',
    // distance
    ifDist: 'IF distance <', thenStop: 'cm THEN stop', thenTurn: 'cm THEN turn 90°', left: 'left', right: 'right',
    distance: 'Distance', crash: 'Crash! Fahim hit the wall.', parkShort: 'Fahim stopped {d} cm from the wall. The green zone is 8–14 cm.',
    coastNote: 'Notice: a moving robot cannot stop instantly; it slides a little. Faster = slides more!',
    timeout: 'Time is up! Fahim never reached the goal.', parked: 'Parked at {d} cm. Perfect!',
    // line
    rulesTitle: 'Rules: what should Fahim do?', s_both: 'both on line', s_left: 'only left on line', s_right: 'only right on line', s_none: 'no line',
    a_fwd: '⬆ forward', a_left: '↖ turn left', a_right: '↗ turn right', a_spinL: '↺ spin left', a_spinR: '↻ spin right', a_stop: '■ stop',
    lost: 'Fahim lost the line! Check your rules.', stopped: 'Fahim stopped and did not finish the lap.',
    lapTime: 'Lap time limit: {l}s', checks: 'Checkpoints: {n} / {m}',
    // light
    wiring: 'Wiring: sensors → motors', straight: 'Straight', crossed: 'Crossed', straightD: 'left sensor → left motor', crossedD: 'left sensor → right motor',
    powerOn: '⚡ Power on', powerOff: '■ Power off', dragLight: 'Drag the flashlight 🔦 around the lab. Fahim reacts to the light!',
    lightL: 'Left light', lightR: 'Right light',
  },
  ar: {
    title: 'مختبر فهيم للروبوتات',
    subtitle: 'اكتشف كيف تعمل الروبوتات الحقيقية: المحركات والسيرفو والتروس والحساسات. ثم قُد فهيم في المختبر!',
    start: 'ادخل المختبر ▶', continue: 'تابع ▶', langBtn: 'English', map: 'المختبر ⬅', learn: 'ما هذا؟',
    hint: '💡 تلميح', reset: '↺ إعادة', run: '▶ شغّل', next: 'المهمة التالية ▶', replay: '↺ العب مجددًا', toMap: 'العودة للمختبر',
    win: 'أنجزت المهمة! 🎉', learned: 'تعلّمت: {c}!', inLife: 'في الحياة', inKit: 'في حقيبة فهيم',
    teacherTip: '🧑‍🏫 نصيحة للمعلّم (نشاط عملي)', letsGo: 'هيا بنا!', allDone: 'أنهيت كل المهمات! أنت مهندس روبوتات 🏆',
    monitor: '📟 شاشة الحساسات', mistakes: 'الأخطاء: {n}', round: 'الجولة {n} من {m}',
    sense: 'يستشعر', think: 'يفكّر', act: 'يتحرّك', power: 'الطاقة',
    senseD: 'الحساسات: المدخلات', thinkD: 'الدماغ', actD: 'المخرجات', powerD: 'الطاقة',
    pickPart: 'اضغط على قطعة، ثم اضغط على الصندوق المناسب لها.',
    wrongBin: 'ليس تمامًا. اسأل نفسك: هل تجمع معلومات، أم تقرّر، أم تفعل شيئًا، أم تعطي طاقة؟',
    leftMotor: 'المحرك الأيسر', rightMotor: 'المحرك الأيمن', stopMotors: '■ أوقف المحركات', resetBot: '↺ أعد الروبوت',
    st_stop: 'فهيم متوقف.', st_fwd: 'العجلتان للأمام بنفس السرعة ← إلى الأمام مباشرة.',
    st_back: 'العجلتان للخلف ← يرجع للخلف.', st_spinL: 'العجلتان باتجاهين متعاكسين ← يدور يسارًا في مكانه.',
    st_spinR: 'العجلتان باتجاهين متعاكسين ← يدور يمينًا في مكانه.',
    st_curveL: 'العجلة اليمنى أسرع ← ينعطف يسارًا.', st_curveR: 'العجلة اليسرى أسرع ← ينعطف يمينًا.',
    st_pivotL: 'العجلة اليمنى فقط تدور ← يلتف يسارًا حول العجلة اليسرى.',
    st_pivotR: 'العجلة اليسرى فقط تدور ← يلتف يمينًا حول العجلة اليمنى.',
    bump: 'طاخ! اصطدم فهيم بالجدار.', leftCircle: 'خرج فهيم من الدائرة. دُر في مكانك: عجلة للأمام وعجلة للخلف.',
    stopHere: 'توقّف هنا', holdAim: 'وجّه الأنف البرتقالي نحو الفانوس المضيء…',
    servoAngle: 'زاوية السيرفو', fire: '🎯 أطلق', servoNow: 'السيرفو عند {a}° ← يتجه إلى {b}°', miss: 'أخطأت! اقرأ الزاوية على المنقلة وحاول مجددًا.',
    motorGear: 'ترس المحرك', wheelGear: 'ترس العجلة', teeth: '{n} سنًّا', ratio: 'نسبة التروس',
    speed: 'السرعة', strength: 'القوة', test: '▶ جرّب القيادة', notStrong: 'ضعيف جدًا! لم تستطع السيارة الصعود. جرّب تروسًا تعطي قوة أكبر.',
    tooSlow: 'بطيء جدًا! الزمن {s} ث، والحد {l} ث. جرّب تروسًا تعطي سرعة أكبر.', timeLbl: 'الزمن: {s} ث',
    ifDist: 'إذا كانت المسافة <', thenStop: 'سم عندها توقّف', thenTurn: 'سم عندها استدر 90°', left: 'يسارًا', right: 'يمينًا',
    distance: 'المسافة', crash: 'اصطدام! ضرب فهيم الجدار.', parkShort: 'توقّف فهيم على بعد {d} سم من الجدار. المنطقة الخضراء من 8 إلى 14 سم.',
    coastNote: 'لاحظ: الروبوت المتحرك لا يتوقف فورًا، بل ينزلق قليلًا. كلما كان أسرع انزلق أكثر!',
    timeout: 'انتهى الوقت! لم يصل فهيم إلى الهدف.', parked: 'توقّف على بعد {d} سم. ممتاز!',
    rulesTitle: 'القواعد: ماذا يفعل فهيم؟', s_both: 'كلاهما على الخط', s_left: 'الأيسر فقط على الخط', s_right: 'الأيمن فقط على الخط', s_none: 'لا يوجد خط',
    a_fwd: '⬆ للأمام', a_left: '↖ انعطف يسارًا', a_right: '↗ انعطف يمينًا', a_spinL: '↺ دُر يسارًا', a_spinR: '↻ دُر يمينًا', a_stop: '■ توقّف',
    lost: 'أضاع فهيم الخط! راجع قواعدك.', stopped: 'توقّف فهيم ولم يُكمل اللفة.',
    lapTime: 'الحد الزمني للّفة: {l} ث', checks: 'نقاط التفتيش: {n} / {m}',
    wiring: 'التوصيل: الحساسات ← المحركات', straight: 'مستقيم', crossed: 'متقاطع', straightD: 'الحساس الأيسر ← المحرك الأيسر', crossedD: 'الحساس الأيسر ← المحرك الأيمن',
    powerOn: '⚡ شغّل', powerOff: '■ أطفئ', dragLight: 'اسحب المصباح 🔦 في المختبر. فهيم يتفاعل مع الضوء!',
    lightL: 'الضوء الأيسر', lightR: 'الضوء الأيمن',
  },
};

const CHAPTERS = [
  {
    id: 'parts', icon: '🤖', color: '#2563EB',
    name: { en: 'Robot Parts', ar: 'أجزاء الروبوت' },
    what: {
      en: 'Every robot does three things, again and again: it SENSES the world with sensors, THINKS with its brain (a tiny computer), and ACTS with motors, lights and sounds. A battery gives power to everything.',
      ar: 'كل روبوت يفعل ثلاثة أشياء مرة بعد مرة: يستشعر العالم بالحساسات، ويفكّر بدماغه (حاسوب صغير)، ويتحرّك بالمحركات والأضواء والأصوات. والبطارية تعطي الطاقة للجميع.',
    },
    life: { en: 'You do it too! Your eyes see the ball (sense), your brain decides (think), your leg kicks (act).', ar: 'أنت تفعل ذلك أيضًا! عيناك تريان الكرة (تستشعر)، ودماغك يقرّر (يفكّر)، وقدمك تركل (تتحرّك).' },
    kit: { en: "Fahim's brain is an ESP32 board. Sensors plug into its inputs and motors plug into its outputs.", ar: 'دماغ فهيم لوحة ESP32. الحساسات تتصل بمداخلها والمحركات تتصل بمخارجها.' },
    tip: {
      en: 'Play "Human Robot" in groups of three: the Sensor (eyes open), the Brain, and the Motors (eyes closed). The Sensor whispers to the Brain, and the Brain gives orders to the Motors.',
      ar: 'العبوا «الروبوت البشري» في مجموعات من ثلاثة: الحساس (عيناه مفتوحتان)، والدماغ، والمحركات (عيناه مغمضتان). يهمس الحساس للدماغ، ويعطي الدماغ الأوامر للمحركات.',
    },
  },
  {
    id: 'motors', icon: '⚙️', color: '#F26A1B',
    name: { en: 'DC Motors & Wheels', ar: 'المحركات والعجلات' },
    what: {
      en: 'A DC motor spins when it gets power: more power, faster spin; reverse the power and it spins backwards. Fahim has one motor per wheel. Same speed = straight. Different speeds = turn. Opposite directions = spin on the spot.',
      ar: 'المحرك الكهربائي يدور عندما يأخذ طاقة: طاقة أكثر تعني دورانًا أسرع، واعكس الطاقة فيدور للخلف. لفهيم محرك لكل عجلة. نفس السرعة = إلى الأمام. سرعتان مختلفتان = انعطاف. اتجاهان متعاكسان = دوران في المكان.',
    },
    life: { en: 'Like rowing a boat: row harder on one side and the boat turns.', ar: 'مثل التجديف في قارب: جدّف بقوة أكبر على جهة واحدة فيستدير القارب.' },
    kit: { en: "Fahim's brain sends a number from -100 to 100 to a motor driver chip, which powers each motor.", ar: 'يرسل دماغ فهيم رقمًا من -100 إلى 100 إلى شريحة تشغيل المحركات، فتعطي كل محرك طاقته.' },
    tip: {
      en: 'Two kids stand shoulder to shoulder as the "wheels". Both walk = straight. One walks slower = turn. One forward and one backward = spin.',
      ar: 'يقف طالبان كتفًا بكتف كأنهما «العجلتان». إذا مشيا معًا = للأمام. إذا أبطأ أحدهما = انعطاف. إذا تقدّم أحدهما ورجع الآخر = دوران.',
    },
  },
  {
    id: 'servo', icon: '🦾', color: '#7C3AED',
    name: { en: 'Servo Motors', ar: 'محركات السيرفو' },
    what: {
      en: 'A servo is a motor that moves to an exact angle, from 0° to 180°, and holds it there. A DC motor spins and spins; a servo points. Inside, a sensor checks the position and keeps correcting it. That is called feedback.',
      ar: 'السيرفو محرك يتحرّك إلى زاوية محددة بين 0° و180° ويثبت عندها. المحرك العادي يدور ويدور، أما السيرفو فيشير. بداخله حساس يتحقق من موقعه ويصحّحه باستمرار، وهذا يسمّى التغذية الراجعة.',
    },
    life: { en: 'Like your arm pointing at a friend, or the hand of a clock pointing at a number.', ar: 'مثل ذراعك عندما تشير إلى صديق، أو عقرب الساعة عندما يشير إلى رقم.' },
    kit: { en: 'The launcher kit aims with a servo, and the football robot arm is a servo too.', ar: 'حقيبة القاذف تصوّب بسيرفو، وذراع روبوت كرة القدم سيرفو أيضًا.' },
    tip: {
      en: 'Make a big paper protractor on the board. Call out an angle and kids point their arm to it like a servo.',
      ar: 'ارسم منقلة كبيرة على اللوح. نادِ زاوية فيشير الطلاب بذراعهم إليها مثل السيرفو.',
    },
  },
  {
    id: 'gears', icon: '🔩', color: '#0EA5A4',
    name: { en: 'Gears', ar: 'التروس' },
    what: {
      en: 'Gears pass the turning from the motor to the wheel. A small gear turning a big gear = slower but stronger (for hills and heavy loads). A big gear turning a small gear = faster but weaker (for racing). You can’t have both!',
      ar: 'التروس تنقل الدوران من المحرك إلى العجلة. ترس صغير يدير ترسًا كبيرًا = أبطأ لكن أقوى (للمرتفعات والأحمال). ترس كبير يدير ترسًا صغيرًا = أسرع لكن أضعف (للسباق). لا يمكنك أن تحصل على الاثنين معًا!',
    },
    life: { en: 'Bicycle gears: an easy gear to climb hills, a hard gear to go fast on a flat road.', ar: 'تروس الدراجة: ترس سهل لصعود التلال، وترس صعب للسرعة على الطريق المستوي.' },
    kit: { en: "Fahim's yellow motors have a gearbox inside. That is why the wheels turn slowly but strongly.", ar: 'محركات فهيم الصفراء فيها علبة تروس، لذلك تدور العجلات ببطء لكن بقوة.' },
    tip: {
      en: 'Flip a bicycle upside down. Turn the pedal once and count how many times the back wheel turns in different gears.',
      ar: 'اقلب دراجة. أدر الدواسة دورة واحدة وعُدّ كم مرة تدور العجلة الخلفية في تروس مختلفة.',
    },
  },
  {
    id: 'distance', icon: '📡', color: '#DC2626',
    name: { en: 'Distance Sensor', ar: 'حساس المسافة' },
    what: {
      en: 'An ultrasonic sensor sends a sound too high for us to hear and listens for the echo. The longer the echo takes, the farther away the object is. The robot gets a number in cm and uses it to decide: stop, turn, or keep going.',
      ar: 'الحساس فوق الصوتي يرسل صوتًا حادًّا لا نسمعه ثم ينتظر الصدى. كلما تأخّر الصدى كان الشيء أبعد. يحصل الروبوت على رقم بالسنتيمتر ويستخدمه ليقرّر: يتوقف أم يستدير أم يستمر.',
    },
    life: { en: 'Bats and dolphins find things with echoes. Car parking sensors beep faster as you get closer.', ar: 'الخفافيش والدلافين تجد الأشياء بالصدى. وحساسات ركن السيارة تصفّر أسرع كلما اقتربت.' },
    kit: { en: "Fahim's front \"eyes\" are an HC-SR04 ultrasonic sensor that measures from 2 to 400 cm.", ar: '«عينا» فهيم الأماميتان حساس HC-SR04 فوق صوتي يقيس من 2 إلى 400 سم.' },
    tip: {
      en: 'Stand far from a wall and clap. Talk about echoes. Then guess distances in the classroom and check with a tape measure.',
      ar: 'قفوا بعيدًا عن جدار وصفّقوا وتحدّثوا عن الصدى. ثم خمّنوا مسافات في الصف وتحقّقوا بشريط القياس.',
    },
  },
  {
    id: 'line', icon: '⚫', color: '#334155',
    name: { en: 'Line Sensors', ar: 'حساسات الخط' },
    what: {
      en: 'An IR line sensor shines invisible light at the floor. White floor reflects a lot, a black line reflects very little. With two sensors, Fahim knows if the line is under his left side, right side, both, or none, and steers to stay on it.',
      ar: 'حساس الخط يرسل ضوءًا غير مرئي نحو الأرض. الأرض البيضاء تعكس كثيرًا والخط الأسود يعكس قليلًا جدًا. بحساسين يعرف فهيم إن كان الخط تحت جهته اليسرى أو اليمنى أو تحت الاثنين أو لا شيء، فيوجّه نفسه ليبقى عليه.',
    },
    life: { en: 'Like walking along a painted line while looking only at your feet.', ar: 'مثل المشي على خط مرسوم وأنت تنظر إلى قدميك فقط.' },
    kit: { en: 'The Fahim and football robot bodies have two IR sensors under the front for line following.', ar: 'جسما روبوت فهيم وروبوت كرة القدم فيهما حساسان للخط تحت المقدمة.' },
    tip: {
      en: 'Make a black tape track on the floor. A blindfolded "robot" feels the tape with two feet and follows the class rules.',
      ar: 'اصنعوا مسارًا بشريط أسود على الأرض. «روبوت» معصوب العينين يتحسس الشريط بقدميه ويتبع قواعد الصف.',
    },
  },
  {
    id: 'light', icon: '🔦', color: '#CA8A04',
    name: { en: 'Light Sensors', ar: 'حساسات الضوء' },
    what: {
      en: 'A light sensor measures how bright it is, from 0 (dark) to 100 (very bright). How you WIRE the sensors to the motors gives the robot its personality: it can chase the light or run away from it!',
      ar: 'حساس الضوء يقيس شدة الإضاءة من 0 (مظلم) إلى 100 (ساطع جدًا). طريقة توصيل الحساسات بالمحركات تعطي الروبوت شخصيته: قد يلاحق الضوء أو يهرب منه!',
    },
    life: { en: 'Sunflowers turn to face the sun, and street lights switch on when it gets dark.', ar: 'زهرة عبّاد الشمس تتجه نحو الشمس، وأضواء الشوارع تشتعل عندما يحلّ الظلام.' },
    kit: { en: 'Fahim can read light sensors (LDRs) on its analog input pins.', ar: 'يستطيع فهيم قراءة حساسات الضوء (LDR) على مداخله التناظرية.' },
    tip: {
      en: 'Darken the room and use a flashlight. Kids are "moths" that walk toward the light. Then swap the rule so they become shy bugs that hide.',
      ar: 'أطفئوا الأنوار واستخدموا مصباحًا. الطلاب «فراشات» تمشي نحو الضوء. ثم اعكسوا القاعدة ليصبحوا حشرات خجولة تختبئ.',
    },
  },
];

const PARTS = [
  { id: 'ultra', icon: '📡', bin: 'sense', name: { en: 'Ultrasonic sensor', ar: 'حساس فوق صوتي' }, fact: { en: 'Measures how far things are using echoes.', ar: 'يقيس بُعد الأشياء باستخدام الصدى.' } },
  { id: 'ir', icon: '⚫', bin: 'sense', name: { en: 'IR line sensor', ar: 'حساس الخط' }, fact: { en: 'Tells if the floor underneath is black or white.', ar: 'يعرف إن كانت الأرض تحته سوداء أم بيضاء.' } },
  { id: 'ldr', icon: '☀️', bin: 'sense', name: { en: 'Light sensor', ar: 'حساس الضوء' }, fact: { en: 'Measures how bright it is.', ar: 'يقيس شدة الإضاءة.' } },
  { id: 'touch', icon: '🔘', bin: 'sense', name: { en: 'Touch button', ar: 'زر لمس' }, fact: { en: 'Knows when it is pressed, like a bumper.', ar: 'يعرف متى يُضغط، مثل المصدّ.' } },
  { id: 'mic', icon: '🎤', bin: 'sense', name: { en: 'Microphone', ar: 'ميكروفون' }, fact: { en: 'Hears claps and voices.', ar: 'يسمع التصفيق والأصوات.' } },
  { id: 'cam', icon: '📷', bin: 'sense', name: { en: 'Camera', ar: 'كاميرا' }, fact: { en: 'Takes pictures so AI can recognise faces and objects.', ar: 'تلتقط صورًا ليتعرّف الذكاء الاصطناعي على الوجوه والأشياء.' } },
  { id: 'brain', icon: '🧠', bin: 'think', name: { en: 'Fahim brain (ESP32)', ar: 'دماغ فهيم (ESP32)' }, fact: { en: 'A tiny computer that runs your program and makes decisions.', ar: 'حاسوب صغير يشغّل برنامجك ويتخذ القرارات.' } },
  { id: 'dc', icon: '⚙️', bin: 'act', name: { en: 'DC motor', ar: 'محرك كهربائي' }, fact: { en: 'Spins the wheels round and round.', ar: 'يدير العجلات باستمرار.' } },
  { id: 'servo', icon: '🦾', bin: 'act', name: { en: 'Servo motor', ar: 'محرك سيرفو' }, fact: { en: 'Turns to an exact angle, like an arm.', ar: 'يتحرّك إلى زاوية محددة مثل الذراع.' } },
  { id: 'led', icon: '💡', bin: 'act', name: { en: 'LED light', ar: 'ضوء LED' }, fact: { en: 'Lights up to show colours and signals.', ar: 'يضيء ليُظهر الألوان والإشارات.' } },
  { id: 'buzz', icon: '🔊', bin: 'act', name: { en: 'Buzzer', ar: 'جرس صوتي' }, fact: { en: 'Beeps and plays tunes.', ar: 'يصفّر ويعزف ألحانًا.' } },
  { id: 'screen', icon: '🖥️', bin: 'act', name: { en: 'Small screen', ar: 'شاشة صغيرة' }, fact: { en: 'Shows faces, words and numbers.', ar: 'تعرض وجوهًا وكلمات وأرقامًا.' } },
  { id: 'bat', icon: '🔋', bin: 'power', name: { en: 'Battery', ar: 'بطارية' }, fact: { en: 'Gives energy to all the other parts.', ar: 'تعطي الطاقة لكل القطع الأخرى.' } },
];

const MISSIONS = [
  {
    id: 'parts', chapter: 'parts', type: 'parts',
    title: { en: 'Build-a-Bot Sort', ar: 'رتّب قطع الروبوت' },
    goal: { en: 'Sort every robot part into the right box: Sense, Think, Act, or Power.', ar: 'ضع كل قطعة في الصندوق الصحيح: يستشعر، يفكّر، يتحرّك، أو الطاقة.' },
    hint: { en: 'Sensors collect information (like eyes and ears). Things that move, light up or make sound are outputs (Act).', ar: 'الحساسات تجمع المعلومات (مثل العينين والأذنين). كل ما يتحرّك أو يضيء أو يصدر صوتًا هو مُخرج (يتحرّك).' },
  },
  {
    id: 'm1', chapter: 'motors', type: 'drive', variant: 'straight',
    title: { en: 'Straight Line', ar: 'خط مستقيم' },
    goal: { en: 'Set both motors to drive Fahim into the green zone, then STOP the motors inside it.', ar: 'اضبط المحركين لتقود فهيم إلى المنطقة الخضراء، ثم أوقف المحركين داخلها.' },
    hint: { en: 'Give both motors the same positive number. When Fahim is in the zone, press "Stop motors".', ar: 'أعطِ المحركين نفس الرقم الموجب. عندما يدخل فهيم المنطقة اضغط «أوقف المحركات».' },
  },
  {
    id: 'm2', chapter: 'motors', type: 'drive', variant: 'curve',
    title: { en: 'Around the Wall', ar: 'حول الجدار' },
    goal: { en: 'The wall is in the way! Steer around it by giving the wheels different speeds, and stop in the green zone.', ar: 'الجدار في الطريق! التفّ حوله بإعطاء العجلتين سرعتين مختلفتين، وتوقّف في المنطقة الخضراء.' },
    hint: { en: 'Right motor faster = curve left. Left motor faster = curve right. Make small changes while Fahim drives.', ar: 'المحرك الأيمن أسرع = انعطاف يسارًا. الأيسر أسرع = انعطاف يمينًا. غيّر قليلًا أثناء القيادة.' },
  },
  {
    id: 'm3', chapter: 'motors', type: 'drive', variant: 'spin',
    title: { en: 'Lighthouse Spin', ar: 'دوران المنارة' },
    goal: { en: 'Stay inside the circle and spin on the spot to point at each glowing lantern in turn.', ar: 'ابقَ داخل الدائرة ودُر في مكانك لتشير إلى كل فانوس مضيء بالدور.' },
    hint: { en: 'Spinning on the spot = one motor forward and the other backward, like 40 and -40.', ar: 'الدوران في المكان = محرك للأمام والآخر للخلف، مثل 40 و -40.' },
  },
  {
    id: 's1', chapter: 'servo', type: 'servo',
    title: { en: 'Balloon Launcher', ar: 'قاذف البالونات' },
    goal: { en: 'Set the servo angle to aim the launcher, then launch to pop all 3 balloons 🎈.', ar: 'اضبط زاوية السيرفو لتصوّب القاذف، ثم أطلق لتفجّر البالونات الثلاثة 🎈.' },
    hint: { en: '0° points right, 90° points straight up, 180° points left. Read the numbers on the protractor under each balloon.', ar: '0° تشير لليمين، و90° للأعلى، و180° لليسار. اقرأ الأرقام على المنقلة تحت كل بالون.' },
  },
  {
    id: 'g1', chapter: 'gears', type: 'gears',
    title: { en: 'Gear Garage', ar: 'ورشة التروس' },
    goal: { en: 'Pick the motor gear and wheel gear for each challenge: a steep hill, a race, and a heavy delivery.', ar: 'اختر ترس المحرك وترس العجلة لكل تحدٍّ: تلّة شديدة، وسباق، وتوصيل حمولة ثقيلة.' },
    hint: { en: 'Small gear → big gear = strong and slow. Big gear → small gear = fast and weak. The ratio is wheel teeth ÷ motor teeth.', ar: 'ترس صغير ← ترس كبير = قوي وبطيء. ترس كبير ← ترس صغير = سريع وضعيف. النسبة = أسنان ترس العجلة ÷ أسنان ترس المحرك.' },
  },
  {
    id: 'd1', chapter: 'distance', type: 'park',
    title: { en: 'Robot Parking', ar: 'ركن الروبوت' },
    goal: { en: 'Choose when Fahim should stop so he parks in the green zone (8–14 cm from the wall). Round 2 is faster!', ar: 'اختر متى يتوقف فهيم ليركن في المنطقة الخضراء (8 إلى 14 سم من الجدار). الجولة الثانية أسرع!' },
    hint: { en: 'Fahim slides a bit after stopping: about 2 cm when slow and about 18 cm when fast. Add that to the zone.', ar: 'ينزلق فهيم قليلًا بعد التوقف: حوالي 2 سم عندما يكون بطيئًا وحوالي 18 سم عندما يكون سريعًا. أضِفها إلى المنطقة.' },
  },
  {
    id: 'd2', chapter: 'distance', type: 'avoid',
    title: { en: 'Wall Dodger', ar: 'مراوغ الجدران' },
    goal: { en: 'Write the rule that gets Fahim through the corridor to the goal 🏁 without crashing.', ar: 'اكتب القاعدة التي توصل فهيم عبر الممر إلى الهدف 🏁 دون اصطدام.' },
    hint: { en: 'Look at the map: which way does the corridor bend at each wall? Then pick a distance like 10 cm.', ar: 'انظر إلى الخريطة: إلى أي اتجاه ينعطف الممر عند كل جدار؟ ثم اختر مسافة مثل 10 سم.' },
  },
  {
    id: 'l1', chapter: 'line', type: 'line', track: 'oval', fixedSpeed: 100, limit: 60,
    title: { en: 'Line Follower', ar: 'متتبّع الخط' },
    goal: { en: 'Set the 4 rules so Fahim follows the black line for a full lap.', ar: 'اضبط القواعد الأربع ليتبع فهيم الخط الأسود لفة كاملة.' },
    hint: { en: 'If only the LEFT sensor sees the line, the line is on the left, so turn left. Same idea for the right.', ar: 'إذا رأى الحساس الأيسر فقط الخط، فالخط على اليسار، فانعطف يسارًا. ونفس الفكرة لليمين.' },
  },
  {
    id: 'l2', chapter: 'line', type: 'line', track: 'wavy', limit: 14,
    title: { en: 'Speed Challenge', ar: 'تحدّي السرعة' },
    goal: { en: 'Finish the wavy lap before time runs out. Too slow and you run out of time; too fast and Fahim can’t react in time!', ar: 'أنهِ اللفة المتموّجة قبل انتهاء الوقت. البطء الشديد يُضيع الوقت، والسرعة الشديدة تمنع فهيم من التفاعل في الوقت المناسب!' },
    hint: { en: "Fahim's brain checks the sensors 20 times a second. A fast robot also needs more room to turn, so on tight curves it slides off. Try a speed around 130.", ar: 'دماغ فهيم يفحص الحساسات 20 مرة في الثانية. والروبوت السريع يحتاج مساحة أكبر ليستدير، فيخرج عن المنحنيات الضيقة. جرّب سرعة حوالي 130.' },
  },
  {
    id: 'li1', chapter: 'light', type: 'light',
    title: { en: 'Moth Robot', ar: 'الروبوت الفراشة' },
    goal: { en: 'Wire the light sensors to the motors so Fahim chases your flashlight. Then lead him to all 3 stars ⭐.', ar: 'وصّل حساسات الضوء بالمحركات ليلاحق فهيم مصباحك. ثم قُده إلى النجوم الثلاث ⭐.' },
    hint: { en: 'To turn toward the light on the left, the RIGHT wheel must go faster. So the left sensor should power the right motor.', ar: 'لكي يستدير نحو الضوء على اليسار يجب أن تسرع العجلة اليمنى. إذن الحساس الأيسر يجب أن يشغّل المحرك الأيمن.' },
  },
];
