export interface ApiFunction {
  name: string
  alias?: string[]
  source: string
}

export interface ApiCategory {
  name: string
  functions: ApiFunction[]
}

function parseLine(line: string): ApiFunction | null {
  const match = line.match(/^-\s+(.+?)\s+--\s+(\S+)$/)
  if (!match) return null
  let [, namePart, source] = match
  const aliasMatch = namePart.match(/^(.+?)\s+\[alias:\s*(.+?)\]$/)
  if (aliasMatch) {
    const [, name, aliasRaw] = aliasMatch
    return {
      name: name.trim(),
      alias: aliasRaw.split(",").map((a) => a.trim()),
      source,
    }
  }
  return { name: namePart.trim(), source }
}

const RAW_CATEGORIES: { name: string; lines: string[] }[] = [
  {
    name: "Reflection",
    lines: [
      "- get_callback_member  [alias: getcallbackmember]  --  reflection.cpp:1174",
      "- get_callback_value  --  reflection.cpp:1172",
      "- get_hidden_prop  [alias: gethiddenprop]  --  reflection.cpp:1158",
      "- get_hidden_properties  [alias: gethiddenproperties]  --  reflection.cpp:1166",
      "- get_hidden_property  [alias: gethiddenproperty]  --  reflection.cpp:1156",
      "- get_properties  [alias: getproperties]  --  reflection.cpp:1169",
      "- getcallbackmember  [alias: get_callback_member]  --  reflection.cpp:1173",
      "- gethiddenprop  --  reflection.cpp:1157",
      "- gethiddenproperties  --  reflection.cpp:1165",
      "- gethiddenproperty  --  reflection.cpp:1155",
      "- getpcd  --  reflection.cpp:1147",
      "- getproperties  --  reflection.cpp:1168",
      "- is_scriptable  [alias: isscriptable]  --  reflection.cpp:1150",
      "- isscriptable  --  reflection.cpp:1148",
      "- set_callback_member  [alias: setcallbackmember]  --  reflection.cpp:1179",
      "- set_callback_value  [alias: setcallbackvalue]  --  reflection.cpp:1177",
      "- set_hidden_prop  [alias: sethiddenprop]  --  reflection.cpp:1163",
      "- set_hidden_property  [alias: sethiddenproperty]  --  reflection.cpp:1161",
      "- set_scriptable  [alias: setscriptable]  --  reflection.cpp:1153",
      "- setcallbackmember  --  reflection.cpp:1178",
      "- setcallbackvalue  --  reflection.cpp:1176",
      "- sethiddenprop  --  reflection.cpp:1162",
      "- sethiddenproperty  --  reflection.cpp:1160",
      "- setscriptable  --  reflection.cpp:1152",
    ],
  },
  {
    name: "Input",
    lines: [
      "- getclipboard  --  input.cpp:247",
      "- gethwid  --  input.cpp:252",
      "- isgameactive  --  input.cpp:254",
      "- isrbxactive  --  input.cpp:253",
      "- iswindowactive  --  input.cpp:255",
      "- keyclick  --  input.cpp:258",
      "- keypress  --  input.cpp:257",
      "- keyrelease  --  input.cpp:260",
      "- keytap  --  input.cpp:259",
      "- messagebox  --  input.cpp:250",
      "- mouse1click  --  input.cpp:262",
      "- mouse1press  --  input.cpp:263",
      "- mouse1release  --  input.cpp:264",
      "- mouse2click  --  input.cpp:265",
      "- mouse2press  --  input.cpp:266",
      "- mouse2release  --  input.cpp:267",
      "- mousemoveabs  --  input.cpp:269",
      "- mousemoverel  --  input.cpp:268",
      "- mousescroll  --  input.cpp:270",
      "- setclipboard  --  input.cpp:245",
      "- setrbxclipboard  --  input.cpp:246",
      "- toclipboard  --  input.cpp:248",
    ],
  },
  {
    name: "Script",
    lines: [
      "- checkcaller  --  script.cpp:1522",
      "- dumpstring  --  script.cpp:1535",
      "- getallthreads  --  script.cpp:1536",
      "- getcallingscript  --  script.cpp:1527",
      "- getgc  --  script.cpp:1528",
      "- getloadedmodules  --  script.cpp:1520",
      "- getmenv  --  script.cpp:1530",
      "- getrenv  --  script.cpp:1525",
      "- getrunningscripts  --  script.cpp:1521",
      "- getscriptbytecode  --  script.cpp:1534",
      "- getscriptclosure  --  script.cpp:1531",
      "- getscriptfromthread  --  script.cpp:1523",
      "- getscriptfunction  --  script.cpp:1532",
      "- getscripthash  --  script.cpp:1526",
      "- getscripts  --  script.cpp:1524",
      "- getscriptthread  --  script.cpp:1533",
      "- getsenv  --  script.cpp:1529",
    ],
  },
  {
    name: "Signals",
    lines: [
      "- cansignalreplicate  --  signals.cpp:2365",
      "- defersignal  --  signals.cpp:2369",
      "- fireclickdetector  --  signals.cpp:2354",
      "- fireproximityprompt  --  signals.cpp:2353",
      "- firesignal  --  signals.cpp:2360",
      "- firetouchinterest  --  signals.cpp:2355",
      "- get_signal_cons  --  signals.cpp:2358",
      "- getconnection  --  signals.cpp:2359",
      "- getconnections  [alias: get_connection, getcons]  --  signals.cpp:2356",
      "- getfriends  --  signals.cpp:2357",
      "- getproximitypromptduration  --  signals.cpp:2363",
      "- getrendersteppedlist  --  signals.cpp:2368",
      "- getsignalarguments  --  signals.cpp:2367",
      "- getsignalargumentsinfo  --  signals.cpp:2366",
      "- getsignalwhitelist  --  signals.cpp:2364",
      "- replicatesignal  --  signals.cpp:2361",
      "- setproximitypromptduration  --  signals.cpp:2362",
    ],
  },
  {
    name: "Filesystem",
    lines: [
      "- appendfile  --  filesystem.cpp:466",
      "- delfile  --  filesystem.cpp:471",
      "- delfolder  --  filesystem.cpp:472",
      "- dofile  --  filesystem.cpp:474",
      "- getcustomasset  --  filesystem.cpp:475",
      "- isfile  --  filesystem.cpp:468",
      "- isfolder  --  filesystem.cpp:469",
      "- listfiles  --  filesystem.cpp:467",
      "- loadfile  --  filesystem.cpp:473",
      "- makefolder  --  filesystem.cpp:470",
      "- readfile  --  filesystem.cpp:464",
      "- writefile  --  filesystem.cpp:465",
    ],
  },
  {
    name: "Debug",
    lines: [
      "- getconstant  --  debug.cpp:989",
      "- getconstants  --  debug.cpp:991",
      "- getinfo  --  debug.cpp:997",
      "- getproto  --  debug.cpp:992",
      "- getprotos  --  debug.cpp:993",
      "- getstack  --  debug.cpp:988",
      "- getupvalue  --  debug.cpp:994",
      "- getupvalues  --  debug.cpp:996",
      "- setconstant  --  debug.cpp:990",
      "- setstack  --  debug.cpp:987",
      "- setupvalue  --  debug.cpp:995",
    ],
  },
  {
    name: "Instance",
    lines: [
      "- cloneref  [alias: clonereference]  --  instance.cpp:509",
      "- clonereference  --  instance.cpp:510",
      "- getinstancecache  --  instance.cpp:517",
      "- getinstances  --  instance.cpp:511",
      "- getnilinstances  --  instance.cpp:508",
      "- getsimulationradius  --  instance.cpp:515",
      "- getspecialinfo  --  instance.cpp:513",
      "- getthreads  --  instance.cpp:514",
      "- isnetworkowner  --  instance.cpp:512",
      "- setsimulationradius  --  instance.cpp:516",
    ],
  },
  {
    name: "Metatable",
    lines: [
      "- getnamecallmethod  --  metatable.cpp:210",
      "- getrawmetatable  --  metatable.cpp:213",
      "- hookmetamethod  --  metatable.cpp:209",
      "- isreadonly  --  metatable.cpp:212",
      "- makereadonly  --  metatable.cpp:215",
      "- makewriteable  --  metatable.cpp:216",
      "- setrawmetatable  --  metatable.cpp:214",
      "- setreadonly  --  metatable.cpp:211",
    ],
  },
  {
    name: "Miscellaneous",
    lines: [
      "- decompile  --  miscellaneous.cpp:946",
      "- getexecutorname  --  miscellaneous.cpp:949",
      "- getfpscap  --  miscellaneous.cpp:953",
      "- getgenv  --  miscellaneous.cpp:945",
      "- GetObjects  --  miscellaneous.cpp:954",
      "- identifyexecutor  --  miscellaneous.cpp:948",
      "- saveinstance  --  miscellaneous.cpp:947",
      "- setfpscap  --  miscellaneous.cpp:952",
    ],
  },
  {
    name: "Crypt",
    lines: [
      "- base64_decode  [alias: base64decode]  --  crypt.cpp:901",
      "- base64_encode  [alias: base64encode]  --  crypt.cpp:900",
      "- base64decode  --  crypt.cpp:899",
      "- base64encode  --  crypt.cpp:898",
      "- getfunctionhash  --  crypt.cpp:897",
      "- lz4compress  --  crypt.cpp:902",
      "- lz4decompress  --  crypt.cpp:903",
    ],
  },
  {
    name: "FileDialog",
    lines: [
      "- openfiledialog  --  filedialog.cpp:122",
      "- openfilesdialog  --  filedialog.cpp:123",
      "- openfolderdialog  --  filedialog.cpp:124",
      "- savefiledialog  --  filedialog.cpp:125",
    ],
  },
  {
    name: "Drawing",
    lines: [
      "- cleardrawcache  --  drawing.cpp:914",
      "- getrenderproperty  --  drawing.cpp:916",
      "- isrenderobj  --  drawing.cpp:915",
      "- setrenderproperty  --  drawing.cpp:917",
    ],
  },
  {
    name: "Networking",
    lines: [
      "- add_receive_hook  --  raknet.cpp:1100",
      "- add_send_hook  --  raknet.cpp:1098",
      "- remove_receive_hook  --  raknet.cpp:1101",
      "- remove_send_hook  --  raknet.cpp:1099",
    ],
  },
  { name: "HTTP", lines: ["- HttpGet  --  http.cpp:684", "- HttpPost  --  http.cpp:685", "- request  --  http.cpp:686"] },
  {
    name: "Threading",
    lines: [
      "- getactorstates  --  luastateproxy.cpp:344",
      "- getgamestate  --  luastateproxy.cpp:343",
      "- getluastate  --  luastateproxy.cpp:342",
    ],
  },
  { name: "Cache", lines: ["- compareinstances  --  cache.cpp:116", "- getreg  --  cache.cpp:115"] },
  { name: "Other", lines: ["- trampoline_call  --  oth.cpp:883"] },
]

export const API_CATEGORIES: ApiCategory[] = RAW_CATEGORIES.map((cat) => ({
  name: cat.name,
  functions: cat.lines.map(parseLine).filter((f): f is ApiFunction => f !== null),
}))

export const API_TOTAL_FUNCTIONS = API_CATEGORIES.reduce((sum, c) => sum + c.functions.length, 0)
