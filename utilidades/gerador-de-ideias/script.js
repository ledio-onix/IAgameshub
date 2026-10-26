const styleSelect = document.getElementById('styleSelect');
const genreSelect = document.getElementById('genreSelect');
const topicSelect = document.getElementById('topicSelect');
const genreCustomWrap = document.getElementById('genreCustomWrap');
const topicCustomWrap = document.getElementById('topicCustomWrap');
const genreCustom = document.getElementById('genreCustom');
const topicCustom = document.getElementById('topicCustom');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const output = document.getElementById('output');

function toggleCustomField(selectEl, customWrap, inputEl) {
  const isCustom = selectEl.value === 'Personalizado';
  customWrap.classList.toggle('hidden', !isCustom);

  if (isCustom) {
    inputEl.focus();
  }
}

function getGenreValue() {
  if (genreSelect.value === 'Personalizado') {
    return genreCustom.value.trim() || 'gênero personalizado';
  }
  return genreSelect.value;
}

function getTopicValue() {
  if (topicSelect.value === 'Personalizado') {
    return topicCustom.value.trim() || 'tema personalizado';
  }
  return topicSelect.value;
}

function getPrompt() {
  const style = styleSelect.value;
  const genre = getGenreValue();
  const topic = getTopicValue();
  const title = `${genre} em ${topic} no estilo ${style}`;

  return [
    `Título sugerido: ${title}`,
    `Estilo visual: ${style}`,
    `Gênero principal: ${genre}`,
    `Tema central: ${topic}`,
    'Premissa: um grupo de jogadores precisa explorar um mundo em constante mudança, tomando decisões que afetam a narrativa e o progresso do jogo.',
    'Mecânicas: foco em exploração, recompensas, progressão, desafios de curto prazo e encontros memoráveis.',
    'Atmosfera: visual marcante, som envolvente, narrativa forte e sensações de descoberta e tensão.',
    'Objetivo do prompt para IA: criar uma ideia original de jogo com protagonista claro, objetivos principais, sistemas de progressão, desafios e proposta comercial.',
    'Prompt final: Crie um jogo do gênero ' + genre + ' com visual ' + style + ', ambientado em ' + topic + '. O jogo deve ter ritmo envolvente, mecânicas memoráveis, progressão satisfatória e uma proposta visual e narrativa forte, com foco em diversão e replayability.'
  ].join('\n');
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
      copyBtn.textContent = 'Copiar prompt';
    }, 1200);
  } catch (error) {
    output.focus();
    output.select();
    copyBtn.textContent = 'Selecione e copie';
  }
}

genreSelect.addEventListener('change', () => {
  toggleCustomField(genreSelect, genreCustomWrap, genreCustom);
});

topicSelect.addEventListener('change', () => {
  toggleCustomField(topicSelect, topicCustomWrap, topicCustom);
});

generateBtn.addEventListener('click', generatePrompt);
copyBtn.addEventListener('click', copyPrompt);

generatePrompt();
