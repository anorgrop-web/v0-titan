// ------------------------------------------------------------------
//  migrar.mjs
//  Baixa as 25 midias do Vercel Blob e sobe pro Cloudflare R2 (bucket "anor").
//  As chaves no R2 ficam IDENTICAS ao caminho usado no codigo (pasta "Tabua/"),
//  entao depois e so trocar o dominio no codigo. Nada e apagado do Blob.
//
//  Como rodar (dentro da pasta _migracao):
//     1) npm install
//     2) node --env-file=.env migrar.mjs
// ------------------------------------------------------------------

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ----- Configuracao do R2 (ja preenchida pra sua conta) -----
const ACCOUNT_ID = "42328fa594a5ed245b3fe84be544cec5";
const BUCKET     = "anor";
const BLOB_HOST  = "https://dxy4adpuoflk7uxq.public.blob.vercel-storage.com";
const URL_PUBLICA = "https://anorcorp.com";

const accessKeyId     = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error("\n[ERRO] Faltam as credenciais. Abra o arquivo .env e cole o");
  console.error("       R2_ACCESS_KEY_ID e o R2_SECRET_ACCESS_KEY do seu token R2.\n");
  process.exit(1);
}

// ----- Os 25 arquivos (caminho codificado, exatamente como esta no codigo) -----
const PATHS = [
  "Tabua/ChatGPT%20Image%2026%20de%20ago.%20de%202025%2C%2022_45_27.png",
  "Tabua/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2010_50_13.png",
  "Tabua/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2011_01_50.png",
  "Tabua/ChatGPT%20Image%2027%20de%20ago.%20de%202025%2C%2011_04_04.png",
  "Tabua/Depoimento%20katuchef%201.mp4",
  "Tabua/Depoimento%20katuchef%202.mp4",
  "Tabua/Group%201058.png",
  "Tabua/Kit%20de%20T%C3%A1buas%20de%20Corte.png",
  "Tabua/M19Kb2huLUwuanBn-w_120-h_120-fit_crop.jpg",
  "Tabua/MV9MaXNhLmpwZw-w_120-h_120-fit_crop.jpg",
  "Tabua/Ml9BbWFuZGEtVi5qcGc-w_120-h_120-fit_crop.jpg",
  "Tabua/Q2hyaXN0aWUtSy5qcGc-w_120-h_120-fit_crop.jpg",
  "Tabua/depoimento%20katuchef%203.mp4",
  "Tabua/download%20%281%29.jpg",
  "Tabua/image%20813.png",
  "Tabua/image_processing20220315-7853-ucio4g.jpeg",
  "Tabua/images.jpg",
  "Tabua/madeira1.jpg",
  "Tabua/pg1edt.gif",
  "Tabua/plastc.jpg",
  "Tabua/premium_photo-1664910471865-d2b3ac59a2e0.jpg",
  "Tabua/video%20p%C3%A1gina%201.mp4",
  "Tabua/video%20pg2.mp4",
  "Tabua/video%20pg3.mp4",
  "Tabua/vidro%2C%20pedra.jpg",
];

const MIME = {
  jpg: "image/jpeg", jpeg: "image/jpeg", jfif: "image/jpeg", png: "image/png",
  gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", mp4: "video/mp4",
};

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

console.log(`\nMigrando ${PATHS.length} arquivos do Vercel Blob para o R2 (bucket "${BUCKET}")...\n`);

let ok = 0, fail = 0;
const falhas = [];

for (const encoded of PATHS) {
  const key = decodeURIComponent(encoded);          // chave real no R2 (com espacos/acentos)
  const url = `${BLOB_HOST}/${encoded}`;            // URL pra baixar do Blob
  const ext = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
  process.stdout.write(`-> ${key}\n   baixando... `);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ao baixar do Blob`);
    const body = Buffer.from(await res.arrayBuffer());
    process.stdout.write(`${(body.length / 1048576).toFixed(2)} MB -> subindo pro R2... `);
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: MIME[ext] || "application/octet-stream",
    }));
    console.log("OK");
    ok++;
  } catch (e) {
    console.log(`FALHOU (${e.message})`);
    falhas.push(key);
    fail++;
  }
}

console.log(`\n--------------------------------------------------`);
console.log(`Resumo: ${ok} enviados | ${fail} falharam | ${PATHS.length} no total.`);
if (falhas.length) {
  console.log(`Falharam:`);
  falhas.forEach(f => console.log(`   - ${f}`));
}
console.log(`\nConfira um exemplo no navegador:`);
console.log(`   ${URL_PUBLICA}/Tabua/madeira1.jpg`);
console.log(`--------------------------------------------------\n`);
