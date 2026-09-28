// Narrative supports observation; clinical answers remain in the reviewed item bank.
export const chapters = [
  { place: 'Começo do plantão', title: 'Cada escolha inicia um cuidado', badge: 'Olhar atento',
    intro: 'Olá! Eu sou a Nery. Vamos acompanhar os materiais que passam pelo hospital? Nossa primeira missão é reconhecer cada item antes de escolher seu destino.',
    lines: [
      'Olá! Eu sou a Nery, educadora aqui do HU. Hoje você vai acompanhar um plantão comigo.',
      'Em um hospital, cada material usado tem um destino. No lugar certo, ele protege pacientes, colegas, a equipe da coleta e o meio ambiente.',
      'Nossa primeira missão é reconhecer cada item antes de escolher. Leia o nome e a condição com atenção.'
    ],
    focus: 'Leia o nome e a condição. O que é reutilizável também precisa do destino certo.',
    tips: ['Leia a condição antes de escolher.', 'Sem pressa: aqui não tem cronômetro.', 'O nome diz o que é; a condição diz como está.'],
    closing: 'Você deu o primeiro passo: observar antes de escolher. Esse cuidado acompanha você no próximo desafio.' },
  { place: 'Durante o cuidado', title: 'Um detalhe muda a decisão', badge: 'Atenção aos detalhes',
    intro: 'O plantão continua. Dois objetos parecidos podem precisar de caminhos diferentes. Vamos investigar o material, o uso e a condição de cada um?',
    lines: [
      'O plantão continua e o movimento aumentou!',
      'Agora aparecem objetos parecidos que seguem caminhos diferentes. O material, o uso e a presença de sangue mudam tudo.',
      'Vamos investigar cada detalhe antes de decidir?'
    ],
    focus: 'Não decida só pela aparência. Compare o que a descrição diz sobre uso e contaminação.',
    tips: ['Está limpo, usado ou contaminado?', 'Plástico ou vidro? O material muda o risco.', 'Compare com o item anterior: o que mudou?'],
    closing: 'Você investigou detalhes que fazem diferença. Agora vamos reunir esses aprendizados no plantão completo.' },
  { place: 'Plantão completo', title: 'Conecte tudo o que aprendeu', badge: 'Cuidado em equipe',
    intro: 'Chegamos ao último capítulo! Cada decisão faz parte de uma rede de cuidado. Use o que aprendeu e explique para si: qual detalhe justifica esta escolha?',
    lines: [
      'Chegamos ao último capítulo do plantão!',
      'Aqui aparecem as situações que mais confundem no dia a dia. Cada decisão faz parte de uma rede de cuidado.',
      'Antes de escolher, pergunte a si: qual detalhe justifica esta escolha?'
    ],
    focus: 'Observe, compare e escolha com calma. A explicação depois de cada item faz parte da missão.',
    tips: ['Qual detalhe justifica a sua escolha?', 'Material, uso e condição: junte tudo.', 'Errou? A explicação também é parte da missão.'],
    closing: 'Missão concluída! Compartilhe o que aprendeu com a equipe e leve suas dúvidas para a conversa com o DEPE.' }
] as const;

export const cheers = ['Mandou bem!', 'Isso mesmo!', 'Olhar atento!', 'Excelente escolha!', 'Cuidado certeiro!'];
export const streakLine = (n: number) => `${n} de primeira! Continue observando cada condição.`;
