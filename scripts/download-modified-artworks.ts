import fs from "node:fs";
import path from "node:path";

// 输入目录：你的图片存放位置
const INPUT_DIR = "./public/artworks";
const MANIFEST_PATH = "./public/artworks/manifest.json";

type ManifestItem = {
  url: string;
  title: string;
  artist: string;
  year: string;
  link: string;
  width: number;
  height: number;
};

async function main() {
  // 1. 检查文件夹是否存在
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ 错误: 找不到文件夹 "${INPUT_DIR}"，请先创建它并把图片放进去。`);
    return;
  }

  // 2. 读取文件夹中的图片文件
  const files = fs.readdirSync(INPUT_DIR);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
  const imageFiles = files.filter(file => 
    imageExtensions.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.error(`❌ 在 "${INPUT_DIR}" 中没有找到图片文件 (支持格式: ${imageExtensions.join(', ')})`);
    return;
  }

  console.log(`🖼️  发现 ${imageFiles.length} 个图片文件，开始生成清单...\n`);

  const manifest: ManifestItem[] = [];

  // 3. 遍历每个图片文件，生成配置项
  for (let i = 0; i < imageFiles.length; i++) {
    const filename = imageFiles[i];
    const filepath = path.join(INPUT_DIR, filename);
    
    let width = 800;
    let height = 600;

    const title = path.basename(filename, path.extname(filename))
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const item: ManifestItem = {
      url: `/artworks/${filename}`,
      title: title,
      artist: "Your Collection",
      year: "2024",
      link: "",
      width: width,
      height: height,
    };

    manifest.push(item);
    console.log(`  ✅ [${i + 1}/${imageFiles.length}] 已添加: ${filename}`);
  }

  // 4. 写入 manifest.json
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n🎉 成功! 已生成 ${manifest.length} 条图片记录 → ${MANIFEST_PATH}`);
}

// 运行主函数
main().catch(console.error);