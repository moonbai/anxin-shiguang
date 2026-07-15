import type { Recipe } from "./types";

// 菜谱数据：内容参考开源项目 HowToCook (https://github.com/Anduin2017/HowToCook)
// 由于 GitHub raw 存在 CORS 限制无法运行时直抓，按 HowToCook 原始 markdown 内容
// （标题 / 原料 / 步骤）整理为本地数据，保留 sourceUrl 指向 HowToCook 对应分类目录。
const HT = "https://github.com/Anduin2017/HowToCook/tree/master/dishes";

export const recipes: Recipe[] = [
  {
    id: "fanqie-chaodan",
    name: "番茄炒蛋",
    category: "vegetarian_dish",
    description: "国民家常菜，酸甜软嫩，开胃下饭，孕产期温和易消化。",
    imagePrompt:
      "home-style Chinese tomato scrambled eggs on a ceramic plate, glossy red and yellow, fresh scallion garnish, warm natural light, top-down food photography",
    ingredients: [
      { name: "番茄", role: "main" },
      { name: "鸡蛋", role: "main" },
      { name: "食用油", role: "aux" },
      { name: "盐", role: "aux" },
      { name: "葱", role: "aux" },
      { name: "白糖", role: "aux" },
    ],
    steps: [
      "番茄顶部划十字，开水烫后去皮切块；鸡蛋打散加少许盐。",
      "热锅冷油，蛋液下锅快速炒散成块盛出。",
      "底油下番茄翻炒出汁，加少许白糖中和酸味。",
      "番茄出汁后倒回鸡蛋翻匀，加盐调味，撒葱花出锅。",
    ],
    sourceUrl: `${HT}/vegetarian_dish`,
  },
  {
    id: "zheng-shuidan",
    name: "蒸水蛋",
    category: "breakfast",
    description: "滑嫩如布丁的水蒸蛋，易消化高蛋白，孕吐期也能入口。",
    imagePrompt:
      "silky steamed Chinese egg custard in a ceramic bowl, glossy smooth surface, drizzled soy oil and scallions, soft warm light, food photography",
    ingredients: [
      { name: "鸡蛋", role: "main" },
      { name: "温水", role: "aux" },
      { name: "盐", role: "aux" },
      { name: "生抽", role: "aux" },
      { name: "葱", role: "aux" },
    ],
    steps: [
      "鸡蛋打散，加入 1.5 倍温水与少许盐搅匀，过筛去泡。",
      "碗覆耐高温保鲜膜并扎几个小孔。",
      "水开后中小火蒸 10–12 分钟，关火焖 2 分钟。",
      "出锅淋少许生抽、香油，撒葱花。",
    ],
    sourceUrl: `${HT}/breakfast`,
  },
  {
    id: "xiaomi-nangua-zhou",
    name: "小米南瓜粥",
    category: "breakfast",
    description: "金黄软糯的养胃粥，温和滋补，孕期月子期皆宜。",
    imagePrompt:
      "golden millet and pumpkin congee in a stoneware bowl, creamy texture, warm morning light, rustic food photography",
    ingredients: [
      { name: "小米", role: "main" },
      { name: "南瓜", role: "main" },
      { name: "水", role: "aux" },
    ],
    steps: [
      "小米淘洗干净，南瓜去皮切小块。",
      "锅中加水烧开，下小米与南瓜。",
      "大火煮沸转小火煮 25 分钟至浓稠，期间搅动防粘底。",
      "粥面起稠即可关火，温食。",
    ],
    sourceUrl: `${HT}/breakfast`,
  },
  {
    id: "xihongshi-jidan-mian",
    name: "西红柿鸡蛋面",
    category: "staple",
    description: "酸甜汤面，一锅出餐，胃口不佳时的暖心主食。",
    imagePrompt:
      "Chinese tomato egg noodle soup in a deep bowl, red broth, soft egg ribbons, fresh noodles, steam rising, warm light, food photography",
    ingredients: [
      { name: "西红柿", role: "main" },
      { name: "鸡蛋", role: "main" },
      { name: "面条", role: "main" },
      { name: "食用油", role: "aux" },
      { name: "盐", role: "aux" },
      { name: "葱", role: "aux" },
    ],
    steps: [
      "西红柿切块，鸡蛋打散。",
      "热锅炒散鸡蛋盛出，底油炒番茄出汁。",
      "加水煮沸下面条，煮至八成熟。",
      "倒回鸡蛋，加盐调味，撒葱花出锅。",
    ],
    sourceUrl: `${HT}/staple`,
  },
  {
    id: "shanyao-paigu-tang",
    name: "山药排骨汤",
    category: "soup",
    description: "清润滋补，健脾养胃，月子期温和进补的经典汤品。",
    imagePrompt:
      "Chinese yam and pork rib soup in a clay pot, clear broth, tender ribs, white yam slices, goji berries, warm light, food photography",
    ingredients: [
      { name: "排骨", role: "main" },
      { name: "山药", role: "main" },
      { name: "姜", role: "aux" },
      { name: "枸杞", role: "aux" },
      { name: "盐", role: "aux" },
    ],
    steps: [
      "排骨冷水下锅焯水去血沫，捞出洗净。",
      "山药去皮切段泡水防氧化。",
      "排骨加姜片与足量水大火烧开，转小火炖 40 分钟。",
      "下山药再炖 20 分钟，加枸杞与盐稍煮即可。",
    ],
    sourceUrl: `${HT}/soup`,
  },
  {
    id: "yiner-lianzi-hongzao-geng",
    name: "银耳莲子红枣羹",
    category: "dessert",
    description: "胶质满满的润燥甜羹，温和补血，孕产期温和甜点。",
    imagePrompt:
      "tremella lotus seed and red date sweet soup in a ceramic bowl, glossy gelatinous texture, red dates, lotus seeds, soft warm light, food photography",
    ingredients: [
      { name: "银耳", role: "main" },
      { name: "莲子", role: "main" },
      { name: "红枣", role: "main" },
      { name: "枸杞", role: "aux" },
      { name: "冰糖", role: "aux" },
    ],
    steps: [
      "银耳冷水泡发撕小朵，莲子去芯泡软，红枣洗净。",
      "银耳加足量水大火烧开转小火炖 30 分钟出胶。",
      "下莲子、红枣再炖 20 分钟。",
      "加冰糖与枸杞煮 5 分钟至浓稠。",
    ],
    sourceUrl: `${HT}/dessert`,
  },
  {
    id: "qingchao-xilanhua",
    name: "清炒西兰花",
    category: "vegetarian_dish",
    description: "翠绿爽脆，富含叶酸与纤维，孕期补充叶酸的轻食。",
    imagePrompt:
      "stir-fried Chinese broccoli florets on a white plate, vibrant green, glossy, garlic slices, warm light, food photography",
    ingredients: [
      { name: "西兰花", role: "main" },
      { name: "蒜", role: "aux" },
      { name: "食用油", role: "aux" },
      { name: "盐", role: "aux" },
    ],
    steps: [
      "西兰花掰小朵，淡盐水浸泡 10 分钟洗净。",
      "沸水加点盐与油焯水 30 秒捞出。",
      "热锅爆香蒜片，下西兰花大火快炒。",
      "加盐调味，淋少许水翻匀出锅。",
    ],
    sourceUrl: `${HT}/vegetarian_dish`,
  },
  {
    id: "jiucai-jidan",
    name: "韭菜炒鸡蛋",
    category: "vegetarian_dish",
    description: "经典韭菜炒蛋，孕期可食，哺乳期月子妈妈需注意回奶。",
    imagePrompt:
      "Chinese chive and egg stir-fry on a ceramic plate, vibrant green chives and golden egg, warm light, home-style food photography",
    ingredients: [
      { name: "韭菜", role: "main" },
      { name: "鸡蛋", role: "main" },
      { name: "食用油", role: "aux" },
      { name: "盐", role: "aux" },
    ],
    steps: [
      "韭菜洗净切段，鸡蛋打散。",
      "热锅炒散鸡蛋盛出。",
      "底油下韭菜大火快炒 30 秒。",
      "倒回鸡蛋翻匀，加盐调味出锅。",
    ],
    sourceUrl: `${HT}/vegetarian_dish`,
  },
  {
    id: "hongshao-rou",
    name: "红烧肉",
    category: "meat_dish",
    description: "浓油赤酱的经典红烧肉，孕产期建议以姜葱去腥，减少大料。",
    imagePrompt:
      "Chinese braised pork belly (hong shao rou) in a clay pot, glossy caramel sauce, tender meat, scallion garnish, warm light, food photography",
    ingredients: [
      { name: "五花肉", role: "main" },
      { name: "冰糖", role: "aux" },
      { name: "生抽", role: "aux" },
      { name: "老抽", role: "aux" },
      { name: "八角", role: "aux" },
      { name: "桂皮", role: "aux" },
      { name: "姜", role: "aux" },
      { name: "葱", role: "aux" },
    ],
    steps: [
      "五花肉切块冷水下锅焯水，捞出洗净。",
      "锅中小火炒冰糖至琥珀色，下肉翻炒上色。",
      "加生抽、老抽、姜片、葱段、八角、桂皮与热水没过肉。",
      "大火烧开转小火炖 50 分钟，大火收汁即可。",
    ],
    sourceUrl: `${HT}/meat_dish`,
  },
  {
    id: "yimi-hongdou-shui",
    name: "薏米红豆水",
    category: "drink",
    description: "去湿利水的红豆薏米水，孕期需避免薏米，月子期少量可饮。",
    imagePrompt:
      "adzuki bean and barley water drink in a glass, warm reddish brown liquid, red beans and barley grains, soft light, beverage photography",
    ingredients: [
      { name: "薏米", role: "main" },
      { name: "红豆", role: "main" },
      { name: "水", role: "aux" },
      { name: "冰糖", role: "aux" },
    ],
    steps: [
      "薏米、红豆分别洗净浸泡 2 小时。",
      "锅中加水煮沸下薏米红豆。",
      "转小火煮 40 分钟至豆软烂。",
      "加冰糖调味，滤出饮用。",
    ],
    sourceUrl: `${HT}/drink`,
  },
  {
    id: "guiyuan-hongzao-cha",
    name: "桂圆红枣茶",
    category: "drink",
    description: "温润甜茶，孕产期体质虚寒者少量可饮，热性体质慎用。",
    imagePrompt:
      "longan and red date tea in a glass teapot, warm amber liquid, dried longan and red dates, soft light, beverage photography",
    ingredients: [
      { name: "桂圆", role: "main" },
      { name: "红枣", role: "main" },
      { name: "枸杞", role: "aux" },
      { name: "水", role: "aux" },
    ],
    steps: [
      "红枣洗净去核，桂圆取肉。",
      "加水大火煮沸转小火煮 20 分钟。",
      "加枸杞再煮 5 分钟即可饮用。",
    ],
    sourceUrl: `${HT}/drink`,
  },
  {
    id: "shanzha-wumei-yin",
    name: "山楂乌梅饮",
    category: "drink",
    description: "酸甜开胃的消食饮，孕期需限量，月子期少量开胃生津。",
    imagePrompt:
      "sour plum and hawthorn drink in a glass, deep red brown liquid, ice cubes, soft light, beverage photography",
    ingredients: [
      { name: "山楂", role: "main" },
      { name: "乌梅", role: "main" },
      { name: "冰糖", role: "aux" },
      { name: "水", role: "aux" },
    ],
    steps: [
      "山楂、乌梅洗净。",
      "加水大火煮沸转小火煮 25 分钟。",
      "加冰糖煮至融化，滤渣饮用。",
    ],
    sourceUrl: `${HT}/drink`,
  },
  {
    id: "danggui-shengjiang-yangrou-tang",
    name: "当归生姜羊肉汤",
    category: "soup",
    description: "温经补血的经典月子汤，孕期禁用当归，月子期是调理佳品。",
    imagePrompt:
      "Chinese angelica ginger lamb soup in a clay pot, clear golden broth, tender lamb pieces, ginger slices, warm light, food photography",
    ingredients: [
      { name: "羊肉", role: "main" },
      { name: "当归", role: "main" },
      { name: "生姜", role: "aux" },
      { name: "盐", role: "aux" },
    ],
    steps: [
      "羊肉切块冷水下锅焯水，捞出洗净。",
      "当归用纱布包好，生姜切片。",
      "羊肉、当归、姜片加水大火烧开转小火炖 1 小时。",
      "取出去当归包，加盐调味即成。",
    ],
    sourceUrl: `${HT}/soup`,
  },
  {
    id: "zui-ji",
    name: "醉鸡",
    category: "meat_dish",
    description: "酒香浸鸡的传统冷盘，含酒精，孕期月子期均不宜。",
    imagePrompt:
      "Chinese drunken chicken cold dish on a plate, sliced pale chicken with herb garnish, warm light, food photography",
    ingredients: [
      { name: "鸡肉", role: "main" },
      { name: "料酒", role: "main" },
      { name: "姜", role: "aux" },
      { name: "葱", role: "aux" },
      { name: "盐", role: "aux" },
    ],
    steps: [
      "整鸡冷水下锅加姜片葱段煮熟，捞出过冰水。",
      "料酒加盐、姜片调成酒卤。",
      "鸡肉浸入酒卤冷藏入味 4 小时。",
      "取出斩件装盘。",
    ],
    sourceUrl: `${HT}/meat_dish`,
  },
];

export const recipeById = new Map<string, Recipe>(
  recipes.map((r) => [r.id, r]),
);

// HowToCook 分类映射
export const categoryLabels: Record<Recipe["category"], string> = {
  breakfast: "早餐",
  staple: "主食",
  meat_dish: "荤菜",
  vegetarian_dish: "素菜",
  soup: "汤羹",
  drink: "饮品",
  dessert: "甜品",
};

// 分类列表（用于导航）
export const categoryList: Array<Recipe["category"]> = [
  "breakfast",
  "staple",
  "meat_dish",
  "vegetarian_dish",
  "soup",
  "drink",
  "dessert",
];
