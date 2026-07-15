import { writeFileSync, mkdirSync, rmSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OWNER = "Anduin2017";
const REPO = "HowToCook";
const TARBALL_URL = `https://github.com/${OWNER}/${REPO}/archive/refs/heads/master.tar.gz`;
const TMP_DIR = join(process.cwd(), ".tmp-howtocook");

const CATEGORIES = [
  { key: "breakfast", label: "早餐" },
  { key: "staple", label: "主食" },
  { key: "meat_dish", label: "荤菜", dir: "meat_dish" },
  { key: "vegetarian_dish", label: "素菜", dir: "vegetable_dish" },
  { key: "soup", label: "汤羹" },
  { key: "drink", label: "饮品" },
  { key: "dessert", label: "甜品" },
  { key: "aquatic", label: "水产" },
];

const EMOJI_POOL = [
  "🍳", "🥘", "🍲", "🍜", "🍝", "🍛", "🍚", "🍙",
  "🥗", "🥙", "🌮", "🥟", "🍱", "🥡", "🍢", "🍡",
  "🍧", "🍨", "🍮", "🍯", "🥤", "🧋", "🍵", "☕",
  "🥦", "🥕", "🌽", "🥔", "🍠", "🍆", "🥒", "🌶️",
  "🍗", "🥩", "🐟", "🦐", "🦞", "🐓", "🦆", "🥚",
  "🐑", "🐄", "🍖", "🍤", "🦀", "🐙", "🦑", "🦪",
];

const GRADIENT_POOL = [
  "from-red-400 to-orange-300",
  "from-orange-400 to-yellow-300",
  "from-yellow-400 to-amber-300",
  "from-amber-400 to-orange-300",
  "from-green-400 to-emerald-300",
  "from-emerald-400 to-teal-300",
  "from-teal-400 to-cyan-300",
  "from-cyan-400 to-blue-300",
  "from-blue-400 to-indigo-300",
  "from-indigo-400 to-purple-300",
  "from-purple-400 to-pink-300",
  "from-pink-400 to-rose-300",
  "from-rose-400 to-red-300",
  "from-lime-400 to-green-300",
  "from-stone-400 to-amber-300",
  "from-rose-300 to-pink-200",
  "from-sky-400 to-cyan-300",
];

function pickEmoji(index) {
  return EMOJI_POOL[index % EMOJI_POOL.length];
}

function pickGradient(index) {
  return GRADIENT_POOL[index % GRADIENT_POOL.length];
}

function toPinyinSlug(name) {
  const map = {
    "西红柿炒鸡蛋": "xihongshi-chaodan", "番茄炒蛋": "fanqie-chaodan",
    "鸡蛋羹": "zheng-shuidan", "蒸水蛋": "zheng-shuidan",
    "小米粥": "xiaomi-zhou",
    "西红柿鸡蛋挂面": "xihongshi-jidan-mian",
    "排骨山药玉米汤": "shanyao-paigu-tang", "山药排骨汤": "shanyao-paigu-tang",
    "银耳莲子粥": "yiner-lianzi-hongzao-geng",
    "蒜蓉西兰花": "qingchao-xilanhua", "清炒西兰花": "qingchao-xilanhua",
    "韭菜炒蛋": "jiucai-jidan", "韭菜炒鸡蛋": "jiucai-jidan",
    "简易红烧肉": "hongshao-rou", "红烧肉": "hongshao-rou",
    "酸梅汤": "suanmei-tang",
    "桂圆红枣粥": "guiyuan-hongzao-cha",
    "羊肉汤": "danggui-shengjiang-yangrou-tang",
    "清蒸南瓜": "qing-zheng-nangua",
    "菠菜炒鸡蛋": "bocai-chaodan",
  };
  if (map[name]) return map[name];
  const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
  return `r-${hash.toString(36)}-${name.length}`;
}

function parseRecipeMarkdown(md, category) {
  const lines = md.split("\n");
  let name = "";
  let description = "";
  const ingredients = [];
  const steps = [];
  let inIngredients = false;
  let inSteps = false;
  let foundFirstHeading = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("# ") && !name) {
      name = line.replace(/^#\s+/, "").trim();
      name = name.replace(/的做法$/, "").trim();
      foundFirstHeading = true;
      continue;
    }

    if (foundFirstHeading && !description && !line.startsWith("#") && line.length > 10) {
      description = line;
      if (description.length > 120) description = description.substring(0, 120) + "...";
    }

    if (/^##/.test(line)) {
      const heading = line.replace(/^#+\s*/, "").trim();
      if (/^(必备原料|原料|食材|用料|配料|材料|计算)/.test(heading)) {
        inIngredients = true;
        inSteps = false;
        continue;
      }
      if (/^(操作|做法|步骤|流程|制作|烹饪步骤|实践)/.test(heading)) {
        inSteps = true;
        inIngredients = false;
        continue;
      }
      inIngredients = false;
      inSteps = false;
      continue;
    }

    if (inIngredients) {
      const m = line.match(/^[-*]\s*(.+)/);
      if (m) {
        let ingName = m[1].trim();
        if (/^#/.test(ingName)) continue;
        ingName = ingName.replace(/[:：].*$/, "").trim();
        ingName = ingName.replace(/（.*?）/g, "").trim();
        ingName = ingName.replace(/\(.*?\)/g, "").trim();
        ingName = ingName.replace(/^\d+.*$/, "").trim();
        ingName = ingName.replace(/[。，、；].*$/, "").trim();
        ingName = ingName.trim();
        if (ingName && ingName.length < 20 && ingName.length > 1) {
          if (!ingredients.some((x) => x.name === ingName)) {
            ingredients.push({ name: ingName, role: "main" });
          }
        }
      }
    }

    if (inSteps) {
      if (/^###/.test(line)) continue;
      const bulletM = line.match(/^[-*]\s*(.+)/);
      const numM = line.match(/^\d+[.、\)]\s*(.+)/);
      const m = bulletM || numM;
      if (m) {
        const step = m[1].trim();
        if (step && step.length > 3 && step.length < 200) {
          steps.push(step);
        }
      }
    }
  }

  if (!name) return null;
  if (ingredients.length === 0 || steps.length === 0) return null;
  if (ingredients.length > 30) ingredients.length = 30;
  if (steps.length > 20) steps.length = 20;

  return {
    id: toPinyinSlug(name),
    name,
    category,
    description: description || `${name}，来自 HowToCook 开源菜谱。`,
    ingredients,
    steps,
    sourceUrl: "",
  };
}

function walkDir(dir, out = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkDir(full, out);
    } else if (entry.endsWith(".md") && entry !== "README.md") {
      out.push(full);
    }
  }
  return out;
}

async function downloadAndExtract() {
  console.log("下载 HowToCook 仓库 tarball...");
  const response = await fetch(TARBALL_URL);
  if (!response.ok) throw new Error(`下载失败: HTTP ${response.status}`);

  mkdirSync(TMP_DIR, { recursive: true });
  const tarPath = join(TMP_DIR, "repo.tar.gz");
  const buf = Buffer.from(await response.arrayBuffer());
  writeFileSync(tarPath, buf);
  console.log(`下载完成: ${(buf.length / 1024 / 1024).toFixed(2)} MB`);

  console.log("解压中...");
  const { execSync } = await import("node:child_process");
  execSync(`tar -xzf "${tarPath}" -C "${TMP_DIR}"`, { stdio: "pipe" });

  const extracted = readdirSync(TMP_DIR).find((d) => d.startsWith("HowToCook-"));
  if (!extracted) throw new Error("未找到解压目录");
  const repoDir = join(TMP_DIR, extracted);
  console.log(`解压完成: ${repoDir}`);
  return repoDir;
}

function escapeStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

async function main() {
  console.log("开始同步 HowToCook 菜谱...\n");

  const repoDir = await downloadAndExtract();
  const dishesDir = join(repoDir, "dishes");

  const allRecipes = [];
  const allCovers = {};
  let idx = 0;

  for (const cat of CATEGORIES) {
    const dirName = cat.dir || cat.key;
    const catDir = join(dishesDir, dirName);

    console.log(`\n分类: ${cat.label} (${cat.key})`);

    try {
      const mdFiles = walkDir(catDir);
      console.log(`  找到 ${mdFiles.length} 个菜谱文件`);

      let okCount = 0;
      for (const filePath of mdFiles) {
        try {
          const md = readFileSync(filePath, "utf-8");
          const recipe = parseRecipeMarkdown(md, cat.key);
          if (recipe) {
            const relPath = relative(repoDir, filePath);
            recipe.sourceUrl = `https://github.com/${OWNER}/${REPO}/blob/master/${relPath}`;
            allRecipes.push(recipe);
            allCovers[recipe.id] = {
              emoji: pickEmoji(idx),
              gradient: pickGradient(idx),
            };
            idx++;
            okCount++;
          }
        } catch (e) {
          console.log(`  ✗ 解析失败: ${filePath} - ${e.message}`);
        }
      }
      console.log(`  成功: ${okCount} / ${mdFiles.length}`);
    } catch (e) {
      console.log(`  ✗ 读取失败: ${e.message}`);
    }
  }

  console.log(`\n\n总计获取 ${allRecipes.length} 道菜谱`);

  const seen = new Set();
  const uniqueRecipes = allRecipes.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  console.log(`去重后: ${uniqueRecipes.length} 道菜谱`);

  const tsContent = `import type { Recipe, RecipeCategory } from "./types";

// 菜谱数据：同步自开源项目 HowToCook (https://github.com/Anduin2017/HowToCook)
// 共 ${uniqueRecipes.length} 道菜谱，自动同步脚本：scripts/sync-howtocook.mjs
export const recipes: Recipe[] = [
${uniqueRecipes
  .map(
    (r) => `  {
    id: "${escapeStr(r.id)}",
    name: "${escapeStr(r.name)}",
    category: "${r.category}" as RecipeCategory,
    description: "${escapeStr(r.description)}",
    ingredients: [
${r.ingredients
  .map((i) => `      { name: "${escapeStr(i.name)}", role: "${i.role}" },`)
  .join("\n")}
    ],
    steps: [
${r.steps.map((s) => `      "${escapeStr(s)}",`).join("\n")}
    ],
    sourceUrl: "${escapeStr(r.sourceUrl)}",
  },`,
  )
  .join("\n")}
];

export const recipeById = new Map<string, Recipe>(
  recipes.map((r) => [r.id, r]),
);

export const categoryLabels: Record<Recipe["category"], string> = {
${CATEGORIES.map((c) => `  ${c.key}: "${c.label}",`).join("\n")}
};

export const categoryList: Array<Recipe["category"]> = [
${CATEGORIES.map((c) => `  "${c.key}",`).join("\n")}
];
`;

  mkdirSync(join(process.cwd(), "src", "data"), { recursive: true });
  writeFileSync(join(process.cwd(), "src", "data", "recipes.ts"), tsContent, "utf-8");
  console.log(`\n已写入 src/data/recipes.ts`);

  const coversContent = `// 菜谱封面：emoji + 渐变色块（参考 HowToCook Dashboard 风格）
// 由 scripts/sync-howtocook.mjs 自动生成
export const recipeCoverMap: Record<string, { emoji: string; gradient: string }> = {
${Object.entries(allCovers)
  .map(([id, c]) => `  "${id}": { emoji: "${c.emoji}", gradient: "${c.gradient}" },`)
  .join("\n")}
};

export const defaultCover = { emoji: "🍽️", gradient: "from-clay/40 to-sage/30" };

export const getRecipeCover = (recipeId: string) =>
  recipeCoverMap[recipeId] || defaultCover;
`;

  writeFileSync(join(process.cwd(), "src", "data", "recipeCovers.ts"), coversContent, "utf-8");
  console.log(`已写入 src/data/recipeCovers.ts (${Object.keys(allCovers).length} 个封面)`);

  rmSync(TMP_DIR, { recursive: true, force: true });
  console.log("\n同步完成！临时文件已清理。");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
