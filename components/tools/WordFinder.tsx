"use client";

import { useState, useMemo } from "react";

// Common English words 3-8 letters, curated for crossword relevance
const WORD_LIST = [
  // 3-letter
  "ACE","ACT","ADD","AGE","AGO","AID","AIM","AIR","ALE","ALL","AND","ANT","APE","ARC","ARE","ARK","ARM","ART","ASH","ATE","AWE","AXE",
  "BAD","BAG","BAN","BAR","BAT","BAY","BED","BET","BIG","BIT","BOW","BOX","BOY","BUD","BUG","BUN","BUS","BUT","BUY",
  "CAB","CAN","CAP","CAR","CAT","COP","COT","COW","CRY","CUB","CUP","CUR","CUT",
  "DAM","DAY","DEN","DEW","DID","DIG","DIM","DIP","DOC","DOE","DOG","DOT","DRY","DUB","DUE","DUG","DUN","DUO","DYE",
  "EAR","EAT","EEL","EGG","ELF","ELK","ELM","EMU","END","ERA","ERR","EVE","EWE","EYE",
  "FAN","FAR","FAT","FAX","FED","FEE","FEN","FEW","FIG","FIN","FIR","FIT","FIX","FLU","FLY","FOB","FOE","FOG","FOP","FOR","FOX","FRY","FUN","FUR",
  "GAB","GAG","GAP","GAS","GAY","GEL","GEM","GET","GIG","GIN","GNU","GOB","GOD","GOT","GUM","GUN","GUT","GUY","GYM",
  "HAD","HAM","HAS","HAT","HAY","HEN","HER","HEW","HID","HIM","HIP","HIS","HIT","HOB","HOD","HOG","HOP","HOT","HOW","HUB","HUE","HUG","HUM","HUT",
  "ICE","ICY","ILL","IMP","INK","INN","ION","IRE","IRK","ITS","IVY",
  "JAB","JAG","JAM","JAR","JAW","JAY","JET","JIG","JOB","JOG","JOT","JOY","JUG","JUT",
  "KEG","KEN","KEY","KID","KIN","KIT",
  "LAB","LAD","LAG","LAP","LAW","LAY","LEA","LED","LEG","LET","LID","LIE","LIP","LIT","LOG","LOT","LOW",
  "MAD","MAN","MAP","MAR","MAT","MAW","MAY","MEN","MET","MID","MIX","MOB","MOD","MOP","MOW","MUD","MUG","MUM","MUN",
  "NAB","NAG","NAP","NET","NEW","NIL","NIT","NOB","NOD","NOR","NOT","NOW","NUB","NUN","NUT",
  "OAK","OAR","OAT","ODD","ODE","OFF","OFT","OIL","OLD","ONE","OPT","ORB","ORE","OUR","OUT","OWE","OWL","OWN",
  "PAD","PAL","PAN","PAP","PAR","PAT","PAW","PAY","PEA","PEG","PEN","PER","PET","PEW","PIE","PIG","PIN","PIT","PLY","POD","POP","POT","POW","PRY","PUB","PUG","PUN","PUP","PUS","PUT",
  "RAG","RAM","RAN","RAP","RAT","RAW","RAY","RED","REF","RIB","RID","RIG","RIM","RIP","ROB","ROD","ROE","ROT","ROW","RUB","RUG","RUM","RUN","RUT","RYE",
  "SAC","SAD","SAG","SAP","SAT","SAW","SAY","SEA","SET","SEW","SHE","SHY","SIN","SIP","SIR","SIS","SIT","SIX","SKI","SKY","SLY","SOB","SOD","SON","SOP","SOT","SOW","SOY","SPA","SPY","STY","SUB","SUM","SUN","SUP",
  "TAB","TAD","TAG","TAN","TAP","TAR","TAT","TAX","TEA","TEN","THE","TIE","TIN","TIP","TOE","TON","TOO","TOP","TOT","TOW","TOY","TRY","TUB","TUG","TUN","TWO",
  "URN","USE",
  "VAN","VAT","VET","VEX","VIA","VIE","VOW",
  "WAD","WAG","WAR","WAS","WAX","WAY","WEB","WED","WET","WHO","WIG","WIN","WIT","WOE","WOK","WON","WOO","WOW",
  "YAK","YAM","YAP","YAW","YEA","YES","YET","YEW","YOU","YOW",
  "ZAP","ZEN","ZIP","ZIT","ZOO",
  // 4-letter
  "ABLE","ACHE","ACID","ACRE","AGED","AIDE","AISLE","ALOE","ALSO","ARCH","AREA","ARIA","ARMY","ARTS","AXLE",
  "BADE","BAIT","BAKE","BALD","BALE","BALM","BAND","BANE","BANK","BARE","BARK","BARN","BASE","BATH","BEAD","BEAM","BEAN","BEAR","BEAT","BELL","BELT","BEND","BEST","BIKE","BIND","BIRD","BITE","BLADE","BLOT","BLOW","BLUE","BLUR","BOAR","BOAT","BOLD","BOLT","BOMB","BOND","BONE","BOOK","BOOM","BOOT","BORE","BORN","BOSS","BOTH","BOWL","BRIM","BULK","BULL","BURN","BUST",
  "CAFE","CAGE","CAKE","CALF","CALL","CALM","CAME","CAMP","CANE","CAPE","CARD","CARE","CART","CASE","CASH","CAST","CAVE","CHAR","CHIN","CHIP","CHOP","CITE","CITY","CLAD","CLAM","CLAN","CLAP","CLAW","CLAY","CLIP","CLOD","CLOT","CLUB","CLUE","COAL","COAT","CODE","COIL","COIN","COLD","COLT","COMB","COME","CONE","COOK","COOL","COPE","COPY","CORD","CORE","CORK","CORN","COST","COSY","COUP","COVE","CRAB","CREW","CROP","CROW","CUBE","CULT","CURB","CURE","CURL","CUTE",
  "DALE","DAME","DAMP","DARE","DARK","DARN","DART","DASH","DATA","DATE","DAWN","DEAD","DEAF","DEAL","DEAR","DEBT","DECK","DEED","DEEM","DEEP","DEER","DEFT","DENY","DESK","DICE","DIET","DINE","DIRE","DIRT","DISC","DISH","DOCK","DOES","DOME","DONE","DOOM","DOOR","DOSE","DOTE","DOWN","DOZE","DRAB","DRAG","DRAW","DREW","DRIP","DROP","DRUM","DUAL","DUEL","DULL","DUMB","DUMP","DUNE","DUSK","DUST","DUTY",
  "EACH","EARL","EARN","EASE","EAST","EASY","ECHO","EDGE","EDIT","EIRE","ELSE","EMIT","EPIC","EVEN","EVER","EVIL","EXAM","EXIT","EYED","EYRE",
  "FACE","FACT","FADE","FAIL","FAIR","FAKE","FALL","FAME","FANG","FARE","FARM","FAST","FATE","FAWN","FEAR","FEAT","FEED","FEEL","FELL","FELT","FERN","FEST","FILE","FILL","FILM","FIND","FINE","FIRE","FIRM","FISH","FIST","FLAG","FLAME","FLAP","FLAT","FLAW","FLEA","FLED","FLEW","FLIP","FLIT","FLOG","FLOW","FOAM","FOCI","FOIL","FOLD","FOLK","FOND","FONT","FOOD","FOOL","FOOT","FORD","FORE","FORK","FORM","FORT","FOUL","FOUR","FOWL","FREE","FROG","FROM","FUEL","FULL","FUME","FUND","FUSE","FUSS",
  "GAIT","GALE","GAME","GANG","GAPE","GARB","GATE","GAVE","GAZE","GEAR","GENE","GIFT","GILD","GILT","GIRL","GIST","GIVE","GLAD","GLEN","GLOW","GLUE","GLUM","GNAT","GNAW","GOAL","GOAT","GOES","GOLD","GOLF","GONE","GOOD","GORE","GRAB","GRAM","GRAY","GREW","GRID","GRIM","GRIN","GRIP","GRIT","GROG","GROW","GULF","GUST","GUTS",
  "HACK","HAIL","HAIR","HALE","HALF","HALL","HALT","HAND","HANG","HARE","HARM","HARP","HART","HASH","HAST","HATE","HAUL","HAVE","HAWK","HAZE","HAZY","HEAD","HEAL","HEAP","HEAR","HEAT","HEED","HEEL","HELD","HELM","HELP","HERB","HERD","HERE","HERO","HIDE","HIGH","HIKE","HILL","HILT","HIND","HINT","HIRE","HOLD","HOLE","HOME","HONE","HOOD","HOOF","HOOK","HOPE","HORN","HOST","HOUR","HOWL","HUGE","HULL","HUMP","HUNG","HUNT","HURL","HURT","HUSH","HYMN",
  "ICON","IDEA","IDLE","IDOL","INCH","INTO","IRON","ISLE","ITEM",
  "JADE","JAIL","JAKE","JAMB","JAPE","JAVA","JAZZ","JEST","JILT","JOBS","JOIN","JOKE","JOLT","JOWL","JUDO","JUKE","JUMP","JUNE","JURY","JUST","JUTE",
  "KALE","KEEN","KEEP","KELP","KEPT","KERN","KILT","KIND","KING","KINK","KITE","KNACK","KNEE","KNEW","KNIT","KNOB","KNOT","KNOW",
  "LACE","LACK","LACY","LAID","LAIR","LAKE","LAME","LAMP","LAND","LANE","LANK","LARD","LARK","LASH","LASS","LAST","LATE","LATH","LAWN","LAZY","LEAD","LEAF","LEAK","LEAN","LEAP","LEFT","LEND","LENS","LENT","LESS","LEST","LEVY","LIAR","LICE","LICK","LIED","LIEU","LIFE","LIFT","LIKE","LIMB","LIME","LIMP","LINE","LINK","LINT","LION","LIST","LIVE","LOAD","LOAF","LOAM","LOAN","LOBE","LOCK","LODE","LOFT","LOGO","LONE","LONG","LOOK","LOOM","LOOP","LOOT","LORD","LORE","LOSE","LOSS","LOST","LOTS","LOUD","LOVE","LUCK","LULL","LUMP","LURE","LURK","LUSH","LUTE",
  "MACE","MADE","MAID","MAIL","MAIN","MAKE","MALE","MALT","MANE","MANY","MARE","MARK","MARS","MASH","MASK","MASS","MAST","MATE","MAZE","MEAD","MEAL","MEAN","MEAT","MEEK","MEET","MELD","MELT","MEMO","MEND","MENU","MERE","MESH","MESS","MICE","MILD","MILE","MILK","MILL","MIME","MIND","MINE","MINT","MIRE","MISS","MIST","MITE","MOAT","MOCK","MODE","MOLE","MOLT","MONK","MOOD","MOON","MOOR","MORE","MOSS","MOST","MOTH","MOVE","MUCH","MUCK","MULE","MULL","MUSE","MUSH","MUST","MUTE",
  "NAIL","NAME","NAVE","NAVY","NEAR","NEAT","NECK","NEED","NEST","NEWS","NEXT","NICE","NINE","NODE","NONE","NOON","NORM","NOSE","NOTE","NOUN","NUDE","NULL",
  "OATH","OBEY","ODOR","OGLE","OGRE","OINK","OMEN","OMIT","ONCE","ONLY","ONTO","OOZE","OPEN","OPUS","ORAL","ORCA","OVAL","OVEN","OVER","OWED","OXEN",
  "PACE","PACK","PACT","PAGE","PAID","PAIL","PAIN","PAIR","PALE","PALM","PANE","PANG","PARK","PART","PASS","PAST","PATH","PAVE","PAWN","PEAK","PEAL","PEAR","PEAT","PECK","PEEL","PEER","PELT","PEND","PENT","PERK","PEST","PICK","PIER","PIKE","PILE","PILL","PINE","PINK","PINT","PIPE","PITY","PLAN","PLAY","PLEA","PLOD","PLOT","PLOW","PLOY","PLUG","PLUM","PLUS","POCK","POEM","POET","POKE","POLE","POLL","POLO","POMP","POND","PONY","POOL","POOR","POPE","PORE","PORK","PORT","POSE","POSH","POST","POUR","PRAY","PREY","PRIG","PRIM","PROD","PROP","PROW","PRYS","PUCK","PULL","PULP","PUMP","PUNK","PURE","PUSH",
  "QUIT","QUIZ",
  "RACE","RACK","RAFT","RAGE","RAID","RAIL","RAIN","RAKE","RAMP","RANG","RANK","RANT","RARE","RASH","RASP","RATE","RAVE","READ","REAL","REAM","REAP","REAR","REED","REEF","REEL","REIN","RELY","REND","RENT","REST","RICH","RIDE","RIFT","RILE","RILL","RIME","RIND","RING","RIOT","RISE","RISK","ROAD","ROAM","ROAR","ROBE","ROCK","RODE","ROLE","ROLL","ROOF","ROOM","ROOT","ROPE","ROSE","ROSY","ROUT","ROVE","RUDE","RUIN","RULE","RUNG","RUSE","RUSH","RUST",
  "SACK","SAFE","SAGE","SAID","SAIL","SAKE","SALE","SALT","SAME","SAND","SANE","SANG","SANK","SASH","SAVE","SCAN","SCAR","SEAL","SEAM","SEAR","SEAT","SECT","SEED","SEEK","SEEM","SEEN","SELF","SELL","SEMI","SEND","SENT","SEPT","SERE","SHED","SHIN","SHIP","SHOE","SHOO","SHOP","SHOT","SHOW","SHUN","SHUT","SICK","SIDE","SIGH","SIGN","SILK","SILL","SILO","SILT","SINE","SING","SINK","SIRE","SITE","SIZE","SLAB","SLAG","SLAM","SLAP","SLAT","SLAW","SLED","SLEW","SLID","SLIM","SLIP","SLIT","SLOB","SLOP","SLOT","SLOW","SLUG","SLUM","SLUR","SMOG","SNAP","SNIP","SNOB","SNOW","SNUB","SNUG","SOAK","SOAP","SOAR","SOCK","SODA","SOFA","SOFT","SOIL","SOLD","SOLE","SOLO","SOME","SONG","SOON","SOOT","SORE","SORT","SOUL","SOUR","SPAN","SPAR","SPEC","SPED","SPIN","SPIT","SPOT","SPUR","STAB","STAG","STAR","STAY","STEM","STEP","STEW","STIR","STOP","STOW","STUB","STUD","STUN","SWAY","SWIM",
  "TACK","TACT","TAIL","TAKE","TALE","TALK","TALL","TAME","TANG","TANK","TAPE","TAPS","TARN","TART","TASK","TAXI","TEAK","TEAL","TEAM","TEAR","TELL","TEMP","TEND","TENT","TERM","TEST","TEXT","THAN","THAT","THEM","THEN","THEY","THIN","THIS","THOU","THUD","THUS","TICK","TIDE","TIDY","TIED","TIER","TILE","TILL","TILT","TIME","TINE","TINY","TIRE","TOAD","TOIL","TOLD","TOLL","TOMB","TOME","TONE","TOOK","TOOL","TOPS","TORE","TORN","TORT","TOSS","TOUR","TOWN","TRAP","TRAY","TREE","TREK","TRIM","TRIO","TRIP","TROD","TROT","TRUE","TUBE","TUCK","TUFT","TUNA","TUNE","TURF","TURN","TUSK","TUTU","TWIN","TYPE",
  "UGLY","UNDO","UNIT","UNTO","UPON","URGE","USED","USER",
  "VAIN","VALE","VANE","VARY","VASE","VAST","VEER","VEIL","VEIN","VENT","VERB","VERY","VEST","VETO","VICE","VIEW","VILE","VINE","VISA","VOID","VOLT","VOTE",
  "WADE","WAGE","WAIL","WAIT","WAKE","WALK","WALL","WAND","WANT","WARD","WARM","WARN","WARP","WART","WARY","WASH","WASP","WAVE","WAVY","WAXY","WEAK","WEAN","WEAR","WEED","WEEK","WEEP","WELD","WELL","WENT","WERE","WEST","WHAT","WHEN","WHIM","WHIP","WHOM","WICK","WIDE","WIFE","WILD","WILL","WILT","WILY","WIMP","WIND","WINE","WING","WINK","WIPE","WIRE","WISE","WISH","WISP","WITH","WOKE","WOLF","WOMB","WOOD","WOOL","WORD","WORE","WORK","WORM","WORN","WOVE","WRAP","WREN","WRIT",
  "YANK","YARD","YARN","YEAR","YELL","YOGA","YOKE","YOUR",
  "ZEAL","ZERO","ZEST","ZINC","ZONE","ZOOM",
  // 5-letter
  "ABIDE","ABOUT","ABOVE","ABUSE","ADMIT","ADOPT","ADORE","ADULT","AGENT","AGILE","AGING","AGREE","AHEAD","AISLE","ALARM","ALBUM","ALERT","ALIEN","ALIGN","ALIVE","ALLEY","ALLOW","ALLOY","ALONE","ALONG","ALTER","AMPLE","ANGEL","ANGER","ANGLE","ANGRY","ANIME","ANKLE","ANNEX","ANTIC","APART","APPLY","ARENA","ARGUE","ARISE","ARMOR","AROMA","AROSE","ASIDE","ASSET","ATONE","AUDIO","AVAIL","AVOID","AWAIT","AWAKE","AWARD","AWARE","AWFUL",
  "BADGE","BASIN","BASIS","BATCH","BEACH","BEARD","BEAST","BEGIN","BEING","BELOW","BENCH","BIBLE","BIRTH","BLACK","BLADE","BLAME","BLAND","BLANK","BLAST","BLAZE","BLEAK","BLEED","BLEND","BLESS","BLIND","BLINK","BLISS","BLOCK","BLOND","BLOOM","BLOWN","BOARD","BOAST","BONUS","BOOST","BOOTH","BOUND","BRAVE","BREAD","BREAK","BREED","BRICK","BRIDE","BRIEF","BRING","BROAD","BROKE","BROOK","BROWN","BRUSH","BUILD","BUNCH","BURST","BUYER",
  "CABIN","CABLE","CANDY","CARGO","CARRY","CATCH","CATER","CAUSE","CHAIN","CHAIR","CHALK","CHAMP","CHAOS","CHARM","CHART","CHASE","CHEAP","CHEAT","CHECK","CHEEK","CHEER","CHESS","CHEST","CHIEF","CHILD","CHINA","CHOIR","CHORD","CHOSE","CHUNK","CLAIM","CLASH","CLASS","CLEAN","CLEAR","CLERK","CLIFF","CLIMB","CLING","CLOCK","CLONE","CLOSE","CLOTH","CLOUD","COACH","COAST","COLOR","COMET","COMIC","CORAL","COUNT","COURT","COVER","CRACK","CRAFT","CRANE","CRASH","CRAWL","CRAZY","CREAM","CREST","CRIME","CRISP","CROSS","CROWD","CROWN","CRUDE","CRUEL","CRUSH","CURVE","CYCLE",
  "DAILY","DANCE","DEATH","DEBUT","DELAY","DELTA","DEMON","DEPOT","DEPTH","DERBY","DEVIL","DIGIT","DIRTY","DOUBT","DOUGH","DRAFT","DRAIN","DRAKE","DRAMA","DRANK","DRAWN","DREAM","DRESS","DRIED","DRIFT","DRILL","DRINK","DRIVE","DROWN","EAGER","EARTH","EIGHT","ELECT","ELITE","EMBED","EMOTE","EMPTY","ENDOW","ENEMY","ENJOY","ENTER","ENTRY","EQUAL","EQUIP","ERASE","ERROR","EVENT","EVERY","EVOKE","EXACT","EXILE","EXIST","EXPEL","EXTRA",
  "FABLE","FACET","FAITH","FALSE","FANCY","FATAL","FAULT","FEAST","FERRY","FEVER","FIBER","FIELD","FIFTY","FIGHT","FINAL","FLAME","FLASH","FLEET","FLESH","FLOAT","FLOCK","FLOOD","FLOOR","FLORA","FLOUR","FLUID","FLUSH","FOCAL","FOCUS","FORCE","FORGE","FORTH","FORUM","FOUND","FRAME","FRANK","FRAUD","FRESH","FRONT","FROST","FRUIT","FULLY","FUNDS",
  "GIANT","GIVEN","GLARE","GLASS","GLEAM","GLOBE","GLOOM","GLORY","GLOSS","GLOVE","GRACE","GRADE","GRAIN","GRAND","GRANT","GRAPE","GRAPH","GRASP","GRASS","GRAVE","GRAVEL","GREAT","GREEN","GREET","GRIEF","GRILL","GRIND","GROAN","GROOM","GROSS","GROUP","GROVE","GROWN","GUARD","GUESS","GUEST","GUIDE","GUILD","GUILT",
  "HAVEN","HEART","HEAVY","HEDGE","HELLO","HENCE","HONOR","HORSE","HOTEL","HOUSE","HUMAN","HUMOR",
  "IDEAL","IMAGE","IMPLY","INDEX","INDIE","INFER","INNER","INPUT","INTER","IRATE","ISSUE","IVORY",
  "JEWEL","JOINT","JUDGE","JUICE","KNACK","KNEEL","KNIFE","KNOCK","KNOLL",
  "LABEL","LABOR","LANCE","LARGE","LASER","LATER","LAUGH","LAYER","LEARN","LEASE","LEGAL","LEMON","LEVEL","LEVER","LIGHT","LIMIT","LINEN","LIVER","LOCAL","LODGE","LOGIC","LOOSE","LOVER","LOWER","LOYAL","LUNAR","LYING",
  "MAGIC","MAJOR","MANOR","MAPLE","MARCH","MARSH","MATCH","MAYOR","MEDAL","MEDIA","MERCY","MERGE","MERIT","METAL","METER","MIGHT","MINOR","MINUS","MIXED","MODEL","MONEY","MONTH","MORAL","MOTOR","MOUNT","MOUSE","MOUTH","MOVED","MOVIE","MUSIC","MYTHS",
  "NAVAL","NERVE","NEVER","NEWLY","NIGHT","NOBLE","NOISE","NORTH","NOTED","NOVEL","NURSE","NYLON",
  "OASIS","OCCUR","OCEAN","OFFER","OFTEN","OLIVE","ONSET","OPERA","ORBIT","ORDER","ORGAN","OTHER","OUGHT","OUTER","OVERT","OWNER",
  "PANEL","PANIC","PAPER","PARTY","PASTE","PATCH","PAUSE","PEACE","PEACH","PEARL","PEDAL","PENNY","PHASE","PHOTO","PIANO","PIECE","PILOT","PINCH","PITCH","PIXEL","PLACE","PLAIN","PLANE","PLANT","PLATE","PLEAD","PLAZA","PLUMB","PLUME","PLUMP","PLUNGE","POINT","POLAR","POUND","POWER","PRESS","PRICE","PRIDE","PRIME","PRINT","PRIOR","PROBE","PRONE","PROOF","PROSE","PROUD","PROVE","PROXY","PULSE","PUNCH","PUPIL","PURSE",
  "QUEEN","QUEST","QUEUE","QUICK","QUIET","QUOTA","QUOTE",
  "RADAR","RADIO","RAISE","RALLY","RANGE","RAPID","RATIO","REACH","REACT","READY","REALM","REBEL","REFER","REIGN","RELAX","RELAY","RENAL","RENEW","REPLY","RIDER","RIDGE","RIFLE","RIGHT","RIGID","RISKY","RIVAL","RIVER","ROBIN","ROBOT","ROCKY","ROGUE","ROMAN","ROUGE","ROUGH","ROUND","ROUTE","ROYAL","RUGBY","RULER","RURAL",
  "SAINT","SALAD","SCALE","SCARE","SCENE","SCOPE","SCORE","SCOUT","SENSE","SERVE","SEVEN","SHADE","SHAFT","SHALL","SHAME","SHAPE","SHARE","SHARK","SHARP","SHEAR","SHELF","SHELL","SHIFT","SHIRE","SHIRT","SHOCK","SHORE","SHORT","SHOUT","SIGHT","SINCE","SIXTY","SIZED","SKATE","SKILL","SKULL","SLAVE","SLEEP","SLICE","SLIDE","SLOPE","SMALL","SMART","SMELL","SMILE","SMOKE","SOLAR","SOLID","SOLVE","SOUTH","SPACE","SPARE","SPARK","SPEAK","SPEAR","SPEED","SPELL","SPEND","SPENT","SPICE","SPIKE","SPINE","SPITE","SPLIT","SPOKE","SPOON","SPORT","SPRAY","SQUAD","STAFF","STAGE","STAIN","STAIR","STAKE","STALE","STALK","STALL","STAMP","STAND","STARE","START","STATE","STEAL","STEAM","STEEL","STEEP","STEER","STERN","STICK","STIFF","STILL","STING","STOCK","STOLE","STONE","STOOD","STOOL","STORE","STORM","STORY","STOVE","STRAP","STRAW","STRAY","STRIP","STUCK","STUDY","STUFF","STUMP","STYLE","SUITE","SURGE","SWAMP","SWARM","SWEAR","SWEEP","SWEET","SWEPT","SWIFT","SWING","SWIRL","SWORD",
  "TABLE","TASTE","TEACH","TEETH","TEMPO","THANK","THEFT","THEME","THERE","THICK","THIEF","THING","THINK","THIRD","THOSE","THREE","THREW","THROW","THUMB","TIDAL","TIGER","TIGHT","TIRED","TITLE","TODAY","TOKEN","TOPIC","TOTAL","TOUCH","TOUGH","TOWER","TOXIC","TRACE","TRACK","TRADE","TRAIL","TRAIN","TRAIT","TRASH","TREAT","TREND","TRIAL","TRIBE","TRICK","TROOP","TROUT","TRUCK","TRULY","TRUMP","TRUNK","TRUST","TRUTH","TULIP","TWICE","TWIST",
  "ULTRA","UNCLE","UNDER","UNION","UNITE","UNITY","UNTIL","UPPER","UPSET","URBAN","USAGE","USUAL","UTTER",
  "VAGUE","VALID","VALUE","VAPOR","VAULT","VERSE","VIDEO","VIGOR","VINYL","VIRAL","VIRUS","VISIT","VITAL","VIVID","VOCAL","VOICE","VOTER",
  "WASTE","WATCH","WATER","WEARY","WEAVE","WEDGE","WHEAT","WHEEL","WHERE","WHICH","WHILE","WHITE","WHOLE","WHOSE","WIDTH","WITCH","WOMAN","WORLD","WORRY","WORSE","WORST","WORTH","WOUND","WRECK","WRITE","WRONG","WROTE",
  "YACHT","YIELD","YOUNG","YOUTH","ZEBRA",
];

function matchesPattern(word: string, pattern: string): boolean {
  const clean = pattern.toUpperCase().replace(/[^A-Z?]/g, "");
  if (clean.length !== word.length) return false;
  for (let i = 0; i < clean.length; i++) {
    if (clean[i] !== "?" && clean[i] !== word[i]) return false;
  }
  return true;
}

export default function WordFinder() {
  const [wordLength, setWordLength] = useState(5);
  const [letters, setLetters] = useState<string[]>(Array(5).fill(""));

  const pattern = letters.map((l) => (l || "?")).join("");

  const results = useMemo(() => {
    const hasInput = letters.some((l) => l !== "");
    if (!hasInput) return [];
    return WORD_LIST.filter((w) => w.length === wordLength && matchesPattern(w, pattern)).slice(0, 60);
  }, [wordLength, pattern, letters]);

  const hasInput = letters.some((l) => l !== "");

  function handleLengthChange(len: number) {
    setWordLength(len);
    setLetters(Array(len).fill(""));
  }

  function handleLetterChange(index: number, value: string) {
    const char = value.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
    const next = [...letters];
    next[index] = char;
    setLetters(next);

    // Auto-focus next input
    if (char && index < wordLength - 1) {
      const nextInput = document.getElementById(`wf-${index + 1}`);
      nextInput?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !letters[index] && index > 0) {
      const prev = document.getElementById(`wf-${index - 1}`);
      prev?.focus();
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <h2 className="font-heading text-lg font-bold text-foreground">Word Finder</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter known letters in their positions. Leave squares empty for unknown letters.
      </p>

      <div className="mt-4">
        <label htmlFor="wf-length" className="mb-1 block text-xs font-medium text-muted-foreground">
          Word length
        </label>
        <div className="flex gap-1.5">
          {[3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleLengthChange(n)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                wordLength === n
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: wordLength }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <input
              id={`wf-${i}`}
              type="text"
              maxLength={1}
              value={letters[i] || ""}
              onChange={(e) => handleLetterChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-11 w-11 rounded-lg border-2 border-border bg-background text-center font-mono text-lg font-bold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:h-12 sm:w-12"
              aria-label={`Letter ${i + 1}`}
            />
            <span className="text-[10px] text-muted-foreground">{i + 1}</span>
          </div>
        ))}
      </div>

      {hasInput && (
        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">
            {results.length === 0
              ? "No matches found."
              : `${results.length}${results.length === 60 ? "+" : ""} match${results.length !== 1 ? "es" : ""}`}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {results.map((word) => (
              <span
                key={word}
                className="rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-sm font-medium text-foreground"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {!hasInput && (
        <p className="mt-4 text-xs text-muted-foreground">
          Type a known letter into any square to start searching. For example, put A in position 2 and E in position 4 to find words matching ?A?E?.
        </p>
      )}
    </div>
  );
}
