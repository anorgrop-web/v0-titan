// ------------------------------------------------------------------
//  migrar2.mjs
//  Migra TODOS os 112 arquivos do blob store "AnorDB"
//  (host mk6n6kinhajxg1fp) para o Cloudflare R2 (bucket "anor"),
//  mantendo os caminhos identicos. Nada e apagado do Blob.
//
//  Como rodar: de dois cliques no  migrar2.bat
//  (ou, no terminal desta pasta:  node --env-file=.env migrar2.mjs)
// ------------------------------------------------------------------

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ACCOUNT_ID  = "42328fa594a5ed245b3fe84be544cec5";
const BUCKET      = "anor";
const BLOB_HOST   = "https://mk6n6kinhajxg1fp.public.blob.vercel-storage.com";
const URL_PUBLICA = "https://anorcorp.com";

const accessKeyId     = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error("\n[ERRO] Faltam as credenciais no arquivo .env\n");
  process.exit(1);
}

// ----- Os 112 arquivos (caminhos exatos, como estao no Blob) -----
const PATHS = [
  "Comum /Group 1102.png",
  "Comum /amex.Csr7hRoy.svg",
  "Comum /card-discover.svg",
  "Comum /card-mastercard.svg",
  "Comum /card-pix.svg",
  "Comum /card-visa.svg",
  "Comum /codigorastreamento.png",
  "Comum /correios.png",
  "Comum /dadosseguros.png",
  "Comum /image 956 (1).png",
  "Comum /jadlog.png",
  "Comum /modern-diverse-business-team-meeting-professional-.jpg",
  "Comum /notasfiscais.png",
  "Digitais/guia-completo-rosas-do-deserto-jardim-da-cida.pdf",
  "Firmage/LP/Aplicando o creme.mp4",
  "Firmage/LP/Flacidez e perda de contorno.png",
  "Firmage/LP/Group 1108.png",
  "Firmage/LP/Group 1109.png",
  "Firmage/LP/Lavando o rosto.mp4",
  "Firmage/LP/Oferta 1.jpeg",
  "Firmage/LP/Oferta 2.jpeg",
  "Firmage/LP/Oferta 3.jpeg",
  "Firmage/LP/Procedimentos invasivos.png",
  "Firmage/LP/Product_comparison_Firmage_202603271839.jpeg",
  "Firmage/LP/Product_credibility_image_202603271839.jpeg",
  "Firmage/LP/Resultados da aplicação.mp4",
  "Firmage/LP/Rugas e linhas finas.png",
  "Firmage/LP/Skincare_product_with_202603271839.jpeg",
  "Firmage/LP/Skincare_products_on_202604042016.jpeg",
  "Firmage/LP/Three_women_holding_202603271839.jpeg",
  "Firmage/LP/Woman_in_navy_202603290854.jpeg",
  "Firmage/LP/Woman_showing_skincare_202603271839.jpeg",
  "Firmage/LP/carross1.webp",
  "Firmage/LP/image 970.png",
  "Firmage/LP/image 971.png",
  "Firmage/LP/image 972.png",
  "Firmage/LP/image 973.png",
  "Firmage/LP/image 974.png",
  "Firmage/LP/tecnologia tensor.jpeg",
  "Firmage/LP/video pg firmage.mp4",
  "RD/Group 1105.png",
  "RD/Oferta 1.png",
  "RD/RD amarela.png",
  "RD/RD branca.png",
  "RD/RD negra.png",
  "RD/RD roxa.png",
  "RD/RD vermelha.png",
  "RD/Section de beneficios.png",
  "RD/foto floricultura.jpeg",
  "RD/imagem hero.png",
  "RD/mosaico (1).webp",
  "RD/section de benecios.png",
  "Titanchef USA/Carrossel 1/carrossel ingles 1.png",
  "Titanchef USA/Carrossel 1/carrossel ingles 2.png",
  "Titanchef USA/modal/Frame 8940547.png",
  "Titanchef USA/modal/Titanchef Large.png",
  "Titanchef USA/modal/Titanchef medium.png",
  "Titanchef USA/modal/titanchef small.png",
  "Versia/Group 1087.png",
  "Versia/_prompt_professional_2k_202602241415.jpeg",
  "Versia/vg1.png",
  "Versia/vg10.png",
  "Versia/vg11.png",
  "Versia/vg12.png",
  "Versia/vg2.png",
  "Versia/vg3.png",
  "Versia/vg5.png",
  "Versia/vg6.png",
  "Versia/vg7.png",
  "Versia/vg8.png",
  "Versia/vg9.png",
  "kat/Faca orderbump redimensionada.png",
  "kat/Imagem orderbump.png",
  "kat/Kit de Tábuas de Corte (1).png",
  "kat/imgkatucheckout.png",
  "kat/katu123.jfif",
  "kat/logo_titanchef 1.png",
  "kat/lp/1_Wood_Bamboo (1).svg",
  "kat/lp/2_Plastic_Epicurean (1).svg",
  "kat/lp/3_Glass_Stone_Steel (1).svg",
  "kat/lp/Designsemnome_82_400x (1).webp",
  "kat/lp/RXhwZXJ0LTUuanBn.jpg",
  "kat/lp/katu12d.jfif",
  "kat/lp/modal/ChatGPT Image 27 de ago. de 2025, 10_50_13 (2).png",
  "kat/lp/modal/ChatGPT Image 27 de ago. de 2025, 11_01_50 (1).png",
  "kat/lp/modal/ChatGPT Image 27 de ago. de 2025, 11_04_04 (2).png",
  "kat/lp/modal/Kit de Tábuas de Corte (2).png",
  "kat/lp/s1/titanium-cutting-board-close-up.png",
  "kat/lp/s3/3_Antibacterial-and-Non.svg",
  "kat/lp/s3/4_Heat-Proof.svg",
  "kat/lp/s3/5_Double-Sided.svg",
  "kat/lp/s3/6_Modern.svg",
  "kat/lp/s3/7_Built-to-Last-a.svg",
  "kat/lp/s3/8_Resistant-to-Odors-and.svg",
  "kat/lp/s3/facasvg (1).svg",
  "kat/lp/s3/svgt1 (1).svg",
  "kat/lp/s4/1_Versatile-for-Any-Occasion (1).svg",
  "kat/lp/s4/2_Built-to-Last (1).svg",
  "kat/lp/s4/3_No-Upkeep-Needed (1).svg",
  "kat/lp/s4/section3gif1.gif",
  "kat/lp/s4/section3gif2.gif",
  "kat/lp/s4/section3gif3.png",
  "kat/lp/s4/section3imagemkatu.png",
  "kat/lp/s5/1_Antibacterial-and-Non-Toxic.svg",
  "kat/lp/s5/2_Knife-Friendly.svg",
  "kat/lp/s5/3_Scratch-Resistance-and.svg",
  "kat/lp/s5/4_Dual-Sided.svg",
  "kat/lp/s5/Comparing-Our-Product_cutting.svg",
  "kat/lp/s5/titanium-cutting-board-clean-modern.png",
  "kat/lp/section2plasticos.jpg",
  "kat/lp/tabuadetitanio (1).png",
  "kat/lp/titanium-cutting-board-with-vegetables.png",
];

const MIME = {
  jpg: "image/jpeg", jpeg: "image/jpeg", jfif: "image/jpeg", png: "image/png",
  gif: "image/gif", webp: "image/webp", svg: "image/svg+xml", mp4: "video/mp4",
  pdf: "application/pdf",
};

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

console.log(`\nMigrando ${PATHS.length} arquivos do Blob (AnorDB) para o R2 (bucket "${BUCKET}")...\n`);

let ok = 0, fail = 0;
const falhas = [];

for (const key of PATHS) {
  const url = BLOB_HOST + "/" + key.split("/").map(encodeURIComponent).join("/");
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
console.log(`\nExemplo pra conferir no navegador:`);
console.log(`   ${URL_PUBLICA}/Comum%20/correios.png`);
console.log(`--------------------------------------------------\n`);
