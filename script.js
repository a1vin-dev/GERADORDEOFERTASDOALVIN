let contadorFrases = 0;

const FRASES_BENEFICIOS = [
  ["Material resistente", "Longa duração", "Garantia extendida"],
  ["Design moderno", "Alta qualidade", "Prático uso"],
  ["Presente ideal para profissionais", "Perfeito para o dia a dia", "Ele vai adorar"],
  ["Tudo em um só lugar", "Economize comprando conjunto", "Organização total"],
  ["Qualidade profissional garantida", "Não fique sem este", "Item essencial"]
];

const BENEFICIOS_POR_PRODUTO = {
  "whey": ["Alto teor de proteína", "Ganho de massa muscular", "Recuperação pós-treino"],
  "creatina": ["Aumenta força e desempenho", "Explosão muscular", "Suporte para treinos intensos"],
  "ferramenta": ["Alta durabilidade", "Desempenho profissional", "Resistente a impactos"],
  "mochila": ["Conforto no transporte", "Impermeável", "Vários compartimentos"],
  "fone": ["Som de alta qualidade", "Conexão estável", "Confortável para longos usos"],
  "cadeira": ["Ergonômica", "Ajuste de altura", "Conforto prolongado"],
  "relógio": ["Resistente à água", "Bateria de longa duração", "Design sofisticado"],
  "kit": ["Completo e prático", "Perfeito para o dia a dia", "Organização total"],
  "carregador": ["Carregamento rápido", "Proteção contra curto", "Compacto e eficiente"],
  "suplemento": ["Aumenta performance", "Rico em nutrientes", "Apoio na recuperação muscular"],
  "notebook": ["Desempenho rápido", "Armazenamento eficiente", "Design leve e portátil"],
  "smartphone": ["Câmera de alta resolução", "Bateria de longa duração", "Desempenho ágil"]
};

// Evento botão gerar com IA
document.getElementById('gerarBtn').addEventListener('click', () => gerarOferta(true));
// Evento botão gerar offline
document.getElementById('gerarOfflineBtn').addEventListener('click', () => gerarOferta(false));
// Evento botão copiar
document.getElementById('copiarBtn').addEventListener('click', copiarTexto);

async function gerarOferta(usarIA = false) {
  const texto = document.getElementById('textoOriginal').value.trim();
  if (!texto) {
    alert("Cole seu texto de oferta primeiro!");
    return;
  }

  mostrarLoading(usarIA);

  const produto = extrairProduto(texto);
  const desconto = extrairDado(texto, /Desconto de (até )?(\d+%)/i, 2) || "XX%";
  const precoAntigo = extrairDado(texto, /de: ~R\$\s*([\d.,]+)~/i, 1) || "00,00";
  const precoNovo = extrairDado(texto, /por R\$\s*([\d.,]+)/i, 1) || "00,00";
  const link = extrairDado(texto, /(https?:\/\/[^\s]+)/i) || "#";

  const beneficios = await gerarBeneficios(produto, usarIA);

  const template = `📢 *Mencionei Você* ‼️😱 *NESSA PROMO ${criarNomePromo(produto)}* 🏃‍♀️💨\n\n` +
    `> *${produto.toUpperCase()}*\n` +
    `✔️ ${beneficios[0]}\n` +
    `✔️ ${beneficios[1]}\n` +
    `✔️ ${beneficios[2]}\n\n` +
    `🏷️ *DESCONTO DE ${desconto}*\n\n` +
    `❌~De R$ ${precoAntigo}~\n` +
    `🔥 *POR APENAS R$ ${precoNovo}!* 🔥\n\n` +
    `🛍️ *COMPRE AGORA:*\n` +
    `👉 [LINK DIRETO] ${link}\n\n` +
    `🎟️ *CUPONS EXCLUSIVOS:*\n` +
    `🔗 [CUPONS] https://s.shopee.com.br/2B26Ni9V1y\n\n` +
    `⏰ *ÚLTIMAS UNIDADES! Promoção pode acabar a qualquer momento!*`;

  document.getElementById('resultado').innerText = template;
  document.getElementById('copiarBtn').style.display = 'inline-block';

  esconderLoading();
}

function mostrarLoading(ativar) {
  document.getElementById('loading').style.display = ativar ? 'block' : 'none';
}

function extrairProduto(texto) {
  // Pega texto depois de ">" até quebra de linha
  const match = texto.match(/>\s*([^\n]+)/);
  return match ? match[1].replace(/[🚨‼️👉🏷️]/g, '').trim() : "PRODUTO";
}

function extrairDado(texto, regex, grupo = 1) {
  const match = texto.match(regex);
  return match ? match[grupo].trim() : null;
}

function criarNomePromo(nome) {
  const palavras = nome.replace(/[^a-zA-ZÀ-ú\s]/g, '').split(' ');
  const palavraChave = palavras.find(p => p.length > 3) || palavras[0];
  return palavraChave.substring(0, 5).toUpperCase() + "DOO";
}

async function gerarBeneficios(produto, usarIA = false) {
  if (usarIA) {
    try {
      const beneficiosIA = await gerarBeneficiosComIA(produto);
      if (beneficiosIA.length > 0) return beneficiosIA;
    } catch (e) {
      console.error("Erro IA:", e);
      alert("Erro na geração com IA. Usando benefícios offline.");
    }
  }

  const produtoLower = produto.toLowerCase();
  for (const chave in BENEFICIOS_POR_PRODUTO) {
    if (produtoLower.includes(chave)) {
      return BENEFICIOS_POR_PRODUTO[chave];
    }
  }

  const beneficios = FRASES_BENEFICIOS[contadorFrases % FRASES_BENEFICIOS.length];
  contadorFrases++;
  return beneficios;
}

async function gerarBeneficiosComIA(produto) {
  // Chamada ao backend, que chama OpenAI (aqui troca localhost para seu backend real)
  const response = await fetch('http://localhost:3000/api/beneficios', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ produto })
  });

  if (!response.ok) throw new Error("Erro na API backend");

  const data = await response.json();
  if (!data.beneficios || !Array.isArray(data.beneficios)) throw new Error("Resposta inválida");

  return data.beneficios.slice(0,3);
}

function copiarTexto() {
  const texto = document.getElementById('resultado').innerText;
  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.getElementById('copiarBtn');
    btn.textContent = '✅ COPIADO!';
    setTimeout(() => btn.textContent = '📋 COPIAR OFERTA', 2000);
  });
}
