// What a reader is told, in each language: that an app shows when each
// task runs, and that for each moment listed they say whether the task runs
// at exactly that moment, reading the description once as on a screen.
// Nothing about cron, patterns, rules or how the text was made, and nothing
// in English but English's own prompt. Each language's words are its own.

const prompts = {
  cs: {
    format: 'Odpověz jedním řádkem na každou otázku, například:\nA1: ano\n' +
      'A2: ne',
    intro: 'Aplikace u každé úlohy ukazuje, kdy se spouští. U každého data ' +
      'a času uvedeného pod úlohou řekni, zda se úloha spustí přesně v tu ' +
      'chvíli. Každý popis si přečti jednou, jako na obrazovce, a odpovídej ' +
      'podle toho, co ti říká.',
    locale: 'cs-CZ',
    no: ['ne'],
    system: 'Čteš texty na obrazovce a odpovídáš na otázky k nim. ' +
      'Odpovídej jen v požadovaném tvaru.',
    task: (letter, text) => `Úloha ${letter}: „${text}“`,
    yes: ['ano']
  },
  de: {
    format: 'Antworte mit einer Zeile pro Frage, zum Beispiel:\nA1: ja\n' +
      'A2: nein',
    intro: 'Eine Anwendung zeigt bei jeder Aufgabe an, wann sie ausgeführt ' +
      'wird. Gib für jeden Zeitpunkt, der unter einer Aufgabe steht, an, ob ' +
      'die Aufgabe genau zu diesem Zeitpunkt ausgeführt wird. Lies jede ' +
      'Beschreibung einmal, wie auf einem Bildschirm, und antworte nach dem, ' +
      'was sie dir sagt.',
    locale: 'de-DE',
    no: ['nein'],
    system: 'Du liest Texte auf einem Bildschirm und beantwortest Fragen ' +
      'dazu. Antworte nur im verlangten Format.',
    task: (letter, text) => `Aufgabe ${letter}: „${text}“`,
    yes: ['ja']
  },
  en: {
    format: 'Answer with one line per question, like this:\nA1: yes\nA2: no',
    intro: 'An app shows, for each task, when the task runs. For each date ' +
      'and time listed under a task, say whether the task runs at exactly ' +
      'that moment. Read each description once, as you would on a screen, ' +
      'and answer from what it tells you.',
    locale: 'en-US',
    no: ['no'],
    system: 'You read text on a screen and answer questions about it. ' +
      'Answer only in the format asked for.',
    task: (letter, text) => `Task ${letter}: “${text}”`,
    yes: ['yes']
  },
  es: {
    format: 'Responde con una línea por pregunta, así:\nA1: sí\nA2: no',
    intro: 'Una aplicación muestra, para cada tarea, cuándo se ejecuta. ' +
      'Para cada fecha y hora que aparece bajo una tarea, di si la tarea se ' +
      'ejecuta exactamente en ese momento. Lee cada descripción una vez, ' +
      'como en una pantalla, y responde según lo que te dice.',
    locale: 'es-ES',
    no: ['no'],
    system: 'Lees textos en una pantalla y respondes preguntas sobre ellos. ' +
      'Responde solo en el formato pedido.',
    task: (letter, text) => `Tarea ${letter}: «${text}»`,
    yes: ['sí', 'si']
  },
  fr: {
    format: 'Réponds par une ligne par question, comme ceci :\nA1 : oui\n' +
      'A2 : non',
    intro: 'Une application indique, pour chaque tâche, quand elle ' +
      's’exécute. Pour chaque date et heure indiquée sous une tâche, dis si ' +
      'la tâche s’exécute exactement à ce moment-là. Lis chaque description ' +
      'une fois, comme sur un écran, et réponds d’après ce qu’elle te dit.',
    locale: 'fr-FR',
    no: ['non'],
    system: 'Tu lis des textes sur un écran et tu réponds à des questions à ' +
      'leur sujet. Réponds uniquement dans le format demandé.',
    task: (letter, text) => `Tâche ${letter} : « ${text} »`,
    yes: ['oui']
  },
  id: {
    format: 'Jawab dengan satu baris untuk setiap pertanyaan, seperti ' +
      'ini:\nA1: ya\nA2: tidak',
    intro: 'Sebuah aplikasi menampilkan, untuk setiap tugas, kapan tugas ' +
      'itu dijalankan. Untuk setiap tanggal dan waktu yang tertera di bawah ' +
      'sebuah tugas, katakan apakah tugas itu dijalankan tepat pada saat ' +
      'itu. Baca setiap keterangan satu kali, seperti di layar, dan jawab ' +
      'menurut apa yang dikatakannya.',
    locale: 'id-ID',
    no: ['tidak'],
    system: 'Anda membaca teks di layar dan menjawab pertanyaan tentang ' +
      'teks itu. Jawab hanya dalam format yang diminta.',
    task: (letter, text) => `Tugas ${letter}: “${text}”`,
    yes: ['ya']
  },
  it: {
    format: 'Rispondi con una riga per domanda, così:\nA1: sì\nA2: no',
    intro: 'Un’applicazione mostra, per ogni attività, quando viene ' +
      'eseguita. Per ogni data e ora elencata sotto un’attività, di’ se ' +
      'l’attività viene eseguita esattamente in quel momento. Leggi ogni ' +
      'descrizione una volta, come su uno schermo, e rispondi in base a ciò ' +
      'che ti dice.',
    locale: 'it-IT',
    no: ['no'],
    system: 'Leggi testi su uno schermo e rispondi a domande su di essi. ' +
      'Rispondi solo nel formato richiesto.',
    task: (letter, text) => `Attività ${letter}: «${text}»`,
    yes: ['sì', 'si']
  },
  ja: {
    format: '質問ごとに1行で、次のように答えてください。\nA1: はい\nA2: いいえ',
    intro: 'あるアプリでは、タスクごとに実行されるタイミングが表示されます。各タスクの下に' +
      'ある日時について、タスクがちょうどその時刻に実行されるかどうかを答えてください。' +
      '説明は画面で読むときのように一度だけ読み、そこから読み取れることに基づいて答えて' +
      'ください。',
    locale: 'ja-JP',
    no: ['いいえ'],
    system: 'あなたは画面上の文章を読み、それについての質問に答えます。指定された形式だけで' +
      '答えてください。',
    task: (letter, text) => `タスク${letter}：「${text}」`,
    yes: ['はい']
  },
  ko: {
    format: '질문마다 한 줄씩, 다음과 같이 답하세요.\nA1: 예\nA2: 아니요',
    intro: '어떤 앱은 작업마다 그 작업이 언제 실행되는지를 보여 줍니다. 각 작업 아래에 ' +
      '적힌 날짜와 시각마다, 작업이 정확히 그 순간에 실행되는지 답하세요. 설명은 화면에서 ' +
      '읽듯이 한 번만 읽고, 거기에 적힌 대로 답하세요.',
    locale: 'ko-KR',
    no: ['아니요', '아니오'],
    system: '당신은 화면에 표시된 글을 읽고 그에 관한 질문에 답합니다. 요청한 형식으로만 ' +
      '답하세요.',
    task: (letter, text) => `작업 ${letter}: “${text}”`,
    yes: ['예', '네']
  },
  pl: {
    format: 'Odpowiedz jednym wierszem na każde pytanie, na przykład:\n' +
      'A1: tak\nA2: nie',
    intro: 'Aplikacja pokazuje przy każdym zadaniu, kiedy jest ono ' +
      'uruchamiane. Dla każdej daty i godziny podanej pod zadaniem ' +
      'powiedz, czy zadanie uruchamia się dokładnie w tej chwili. Każdy ' +
      'opis przeczytaj raz, jak na ekranie, i odpowiadaj według tego, co ' +
      'ci mówi.',
    locale: 'pl-PL',
    no: ['nie'],
    system: 'Czytasz teksty na ekranie i odpowiadasz na pytania o nie. ' +
      'Odpowiadaj tylko w podanym formacie.',
    task: (letter, text) => `Zadanie ${letter}: „${text}”`,
    yes: ['tak']
  },
  pt: {
    format: 'Responda com uma linha por pergunta, assim:\nA1: sim\nA2: não',
    intro: 'Um aplicativo mostra, para cada tarefa, quando ela é executada. ' +
      'Para cada data e hora listada abaixo de uma tarefa, diga se a tarefa ' +
      'é executada exatamente nesse momento. Leia cada descrição uma vez, ' +
      'como numa tela, e responda de acordo com o que ela diz.',
    locale: 'pt-BR',
    no: ['não', 'nao'],
    system: 'Você lê textos em uma tela e responde perguntas sobre eles. ' +
      'Responda somente no formato pedido.',
    task: (letter, text) => `Tarefa ${letter}: “${text}”`,
    yes: ['sim']
  },
  uk: {
    format: 'Відповідай одним рядком на кожне запитання, наприклад:\n' +
      'A1: так\nA2: ні',
    intro: 'Застосунок показує для кожного завдання, коли воно ' +
      'запускається. Для кожної дати й часу під завданням скажи, чи ' +
      'запускається завдання саме в цю мить. Прочитай кожен опис один раз, ' +
      'як на екрані, і відповідай за тим, що він тобі каже.',
    locale: 'uk-UA',
    no: ['ні'],
    system: 'Ти читаєш тексти на екрані й відповідаєш на запитання про ' +
      'них. Відповідай лише у вказаному форматі.',
    task: (letter, text) => `Завдання ${letter}: «${text}»`,
    yes: ['так']
  },
  zh: {
    format: '每个问题回答一行，例如：\nA1：是\nA2：否',
    intro: '某个应用会为每个任务显示它在什么时候运行。对于每个任务下面列出的日期和时间，' +
      '请说明该任务是否恰好在那个时刻运行。每条说明像在屏幕上那样读一遍，根据它告诉你' +
      '的内容作答。',
    locale: 'zh-CN',
    no: ['否'],
    system: '你阅读屏幕上的文字并回答相关问题。只按要求的格式回答。',
    task: (letter, text) => `任务${letter}：“${text}”`,
    yes: ['是']
  }
};

// A moment as the language writes a date and a time.
function momentText(prompt, moment, seconds) {
  const date = new Date(Date.UTC(moment.year, moment.month - 1, moment.date,
    moment.hour, moment.minute, moment.second));

  return new Intl.DateTimeFormat(prompt.locale, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'long',
    ...seconds ? {second: '2-digit'} : {},
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric'
  }).format(date);
}

const LETTERS = 'ABCDEFGHIJ';

/**
 * The message for one reader: the intro, each task's description with the
 * moments to answer for, and the answer format. `tasks` is a list of
 * {text, moments, seconds}.
 */
function messageFor(code, tasks) {
  const prompt = prompts[code];
  const blocks = tasks.map(function block(task, index) {
    const letter = LETTERS[index];
    const lines = task.moments.map((moment, number) =>
      `${letter}${number + 1}. ${momentText(prompt, moment, task.seconds)}`);

    return [prompt.task(letter, task.text), ...lines].join('\n');
  });

  return [prompt.intro, ...blocks, prompt.format].join('\n\n');
}

/**
 * A reader's answers, by question: {"A1": true, ...}; an answer that is
 * neither yes nor no is left out.
 */
function answersFrom(code, text) {
  const prompt = prompts[code];
  const answers = {};

  text.split('\n').forEach(function line(raw) {
    const found = (/^\s*\**([A-J])\s*(\d+)\**\s*[.:：]\s*(.+)$/u).exec(raw);

    if (!found) {
      return;
    }

    const said = found[3].trim().toLowerCase().replace(/[.!*。]+$/u, '');
    const key = `${found[1]}${found[2]}`;

    if (prompt.yes.some((word) => said.startsWith(word))) {
      answers[key] = true;
    }
    else if (prompt.no.some((word) => said.startsWith(word))) {
      answers[key] = false;
    }
  });

  return answers;
}

export {LETTERS, answersFrom, messageFor, prompts};
