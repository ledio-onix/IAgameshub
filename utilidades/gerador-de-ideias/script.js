const styleButtons = document.querySelectorAll('.style-option');
const genreSelect = document.getElementById('genreSelect');
const topicSelect = document.getElementById('topicSelect');
const genreCustomWrap = document.getElementById('genreCustomWrap');
const topicCustomWrap = document.getElementById('topicCustomWrap');
const genreCustom = document.getElementById('genreCustom');
const topicCustom = document.getElementById('topicCustom');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');

let selectedStyle = '2D';

function setSelectedStyle(value) {
  selectedStyle = value;
  styleButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.value === value);
  });
}

styleButtons.forEach((button) => {
  button.addEventListener('click', () => setSelectedStyle(button.dataset.value));
});

function toggleCustom(inputSelect, customWrap, inputEl) {
  const shouldShow = inputSelect.value === 'Personalizado';
  customWrap.classList.toggle('hidden', !shouldShow);
  if (shouldShow) {
    inputEl.focus();
  }
}

genreSelect.addEventListener('change', () => toggleCustom(genreSelect, genreCustomWrap, genreCustom));
topicSelect.addEventListener('change', () => toggleCustom(topicSelect, topicCustomWrap, topicCustom));

function getGenreValue() {
  return genreSelect.value === 'Personalizado'
    ? (genreCustom.value.trim() || 'gênero original')
    : genreSelect.value;
}

function getTopicValue() {
  return topicSelect.value === 'Personalizado'
    ? (topicCustom.value.trim() || 'tema original')
    : topicSelect.value;
}

function buildPitch(style, genre, topic) {
  const genreLower = genre.toLowerCase();
  const topicLower = topic.toLowerCase();

  return {
    hook: `Um jogo ${genreLower} com ${style} que coloca o jogador em ${topicLower}, onde cada decisão redefine o mundo e a trajetória do protagonista.`,
    loop: `O loop principal combina exploração, combate ou resolução de desafios, upgrades constantes e pequenas vitórias que aumentam a sensação de progresso.`,
    fantasy: `A fantasia do jogador é dominar o ambiente, superar ameaças, descobrir segredos e transformar uma situação aparentemente impossível em uma história de sobrevivência e conquista.`,
    art: `A estética usa contraste visual forte, iluminação dramática, efeitos de movimento e elementos de mundo que reforçam a identidade do jogo sem perder clareza funcional.`
  };
}

function getPrompt() {
  const genre = getGenreValue();
  const topic = getTopicValue();
  const style = selectedStyle;
  const pitch = buildPitch(style, genre, topic);

  const prompt = [
    `Título sugerido: ${genre} em ${topic} no estilo ${style}`,
    '',
    `Visão geral: ${pitch.hook}`,
    `Estrutura de gameplay: ${pitch.loop}`,
    `Fantasy do jogador: ${pitch.fantasy}`,
    `Direção artística: ${pitch.art}`,
    '',
    `Objetivo principal: crie um jogo ${genre.toLowerCase()} com foco em ${topic.toLowerCase()}, mantendo o ritmo envolvente, a progressão clara e a sensação de descoberta constante.`,
    `Mecânicas: inclua encontros importantes, tomada de decisão, upgrades ou recursos, momentos de tensão, sistemas de recompensa e um ciclo de exploração que produza variedade ao longo da partida.`,
    `Progresso do jogador: cada conquista deve ampliar o poder do personagem, expandir o mapa, desbloquear novas rotas e criar oportunidades para novas estratégias.`,
    `Atmosfera: o mundo deve parecer vivo, misterioso e memorável, com personagens, locais e ameaças que reforcem a identidade do projeto e sua proposta de diversão.`,
    `Entrega final: proponha uma ideia completa, original, jogável e comercialmente atraente, com conceito claro, público-alvo, dinâmicas principais, objetivos e uma visão visual que realmente chame atenção.`,
    '',
    `Prompt final para IA: Crie um jogo de ${genre.toLowerCase()} no estilo ${style}, ambientado em ${topic.toLowerCase()}. O jogo deve ter uma proposta visual forte, mecânicas envolventes, progressão satisfatória, narrativa e identidade marcante, com foco em diversão, atmosfera e replayability. O jogador deve sentir que cada decisão importa, cada conquista traz avanço e cada momento do jogo oferece uma mistura de desafio, curiosidade e recompensa.`
  ].join('\n');

  return prompt;
}

function generatePrompt() {
  output.value = getPrompt();
}

async function copyPrompt() {
  if (!output.value.trim()) {
    generatePrompt();
  }

  try {
    await navigator.clipboard.writeText(output.value);
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => {
      copyBtn.textContent = 'Copiar';
    }, 1200);
  } catch (error) {
    output.focus();
    output.select();
    copyBtn.textContent = 'Selecione e copie';
  }
}

generateBtn.addEventListener('click', generatePrompt);
copyBtn.addEventListener('click', copyPrompt);

generatePrompt();
