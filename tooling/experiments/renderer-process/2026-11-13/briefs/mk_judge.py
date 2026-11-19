# Usage: mk_judge.py <code> <round>  — writes judges/<code>-<round>.brief.md (in the language), from the sample judges/<code>-<round>.sample.txt
import sys
S='/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad'
c,r=sys.argv[1:3]
T={
'nl':"""Je bent een ervaren Nederlandse eindredacteur. In het bestand hieronder staan genummerde korte zinnetjes die mensen hebben geschreven voor een scherm in een app. Elk zinnetje moet duidelijk maken wanneer iets telkens opnieuw gebeurt.

Bestand: {SAMPLE}

Doe voor elk zinnetje het volgende.
1. Oordeel: **natuurlijk** / **stroef** / **vreemd**. De maatstaf is of een zorgvuldige Nederlandstalige schrijver het zo op een scherm zou zetten.
2. Begrip: zeg in je eigen woorden wanneer het volgens jou precies gebeurt, alleen op grond van het zinnetje (eerste en laatste tijdstip, dagen, datums enzovoort). Als het op twee manieren gelezen kan worden, geef beide.
3. Als je het stroef of vreemd vindt: schrijf op hoe jij het zou zeggen.

Zet aan het eind de problemen op een rij die in meerdere zinnetjes terugkomen (notatie, woordvolgorde, woordkeus) en noem de tien zinnetjes met de grootste problemen. Complimenten zijn niet nodig. Wees eerlijk en concreet.

Schrijf het verslag in het Nederlands, sla het op als {OUT} en stuur dezelfde tekst als je laatste bericht. Lees of wijzig geen andere bestanden.""",
'it':"""Sei un redattore italiano di grande esperienza. Nel file indicato qui sotto ci sono brevi frasi numerate, scritte da persone per lo schermo di un'app. Ogni frase deve far capire quando una cosa si ripete.

File: {SAMPLE}

Per ogni frase:
1. Giudizio: **naturale** / **legnosa** / **strana**. Il criterio è se una persona che scrive con cura in italiano la metterebbe così su uno schermo.
2. Comprensione: di' con parole tue quando, secondo te, la cosa avviene esattamente, basandoti solo sulla frase (primo e ultimo momento, giorni, date e così via). Se si può leggere in due modi, indicali entrambi.
3. Se la giudichi legnosa o strana, riscrivila come la scriveresti tu.

Alla fine elenca i problemi che ricorrono in più frasi (grafia, ordine delle parole, scelta dei termini) e indica le dieci frasi più problematiche. Niente complimenti: sii franco e concreto.

Scrivi il rapporto in italiano, salvalo in {OUT} e invia lo stesso testo come messaggio finale. Non leggere né modificare altri file.""",
'pl':"""Jesteś doświadczonym polskim redaktorem. W pliku wskazanym niżej są ponumerowane krótkie sformułowania, które ludzie napisali na ekran aplikacji. Każde ma informować, kiedy coś się powtarza.

Plik: {SAMPLE}

Dla każdego sformułowania:
1. Ocena: **naturalne** / **sztywne** / **dziwne**. Miarą jest to, czy staranny polski autor tak właśnie napisałby to na ekranie.
2. Rozumienie: napisz własnymi słowami, kiedy dokładnie – twoim zdaniem – to się dzieje, wyłącznie na podstawie tego sformułowania (pierwsza i ostatnia chwila, dni, daty itd.). Jeśli da się je odczytać na dwa sposoby, podaj oba.
3. Jeśli uznasz je za sztywne albo dziwne, napisz, jak ty byś to ujął.

Na końcu wypisz problemy, które powtarzają się w wielu sformułowaniach (zapis, szyk, dobór słów), i wskaż dziesięć najbardziej kłopotliwych. Bez pochwał; pisz szczerze i konkretnie.

Napisz raport po polsku, zapisz go w pliku {OUT} i wyślij ten sam tekst jako ostatnią wiadomość. Nie czytaj ani nie zmieniaj innych plików.""",
'cs':"""Jsi zkušený český redaktor. V souboru uvedeném níže jsou očíslované krátké texty, které lidé napsali na obrazovku aplikace. Každý má říct, kdy se něco opakuje.

Soubor: {SAMPLE}

U každého textu:
1. Hodnocení: **přirozené** / **toporné** / **divné**. Měřítkem je, zda by to pečlivý český pisatel takhle na obrazovku napsal.
2. Porozumění: napiš vlastními slovy, kdy přesně se to podle tebe děje, jen na základě toho textu (první a poslední okamžik, dny, data atd.). Pokud se dá číst dvojím způsobem, uveď oba.
3. Pokud ho hodnotíš jako toporný nebo divný, napiš, jak bys to řekl ty.

Na konci shrň problémy, které se opakují ve více textech (zápis, slovosled, volba slov), a vyjmenuj deset nejproblematičtějších textů. Pochvaly nejsou potřeba; piš upřímně a konkrétně.

Zprávu napiš česky, ulož ji do souboru {OUT} a stejný text pošli jako poslední zprávu. Žádné jiné soubory nečti ani neměň.""",
'ar':"""أنت محرّر عربي متمرّس. في الملف المذكور أدناه عبارات قصيرة مرقّمة كتبها أناس لتظهر على شاشة تطبيق. كل عبارة يُراد بها أن تُفهِم القارئ متى يتكرّر أمرٌ ما.

الملف: {SAMPLE}

لكل عبارة:
1. الحكم: **طبيعية** / **متكلَّفة** / **غريبة**. المعيار: هل يكتبها هكذا على الشاشة كاتبٌ عربي متأنٍّ؟
2. الفهم: اذكر بكلماتك متى يحدث الأمر بالضبط كما فهمته من العبارة وحدها (أول وقت وآخر وقت، والأيام، والتواريخ…). وإن احتملت قراءتين فاذكرهما.
3. إن حكمت بأنها متكلَّفة أو غريبة فأعد كتابتها كما كنت ستكتبها.

وفي الختام اجمع المشكلات التي تتكرّر في أكثر من عبارة (الإملاء، ترتيب الكلمات، اختيار الألفاظ، اتجاه الأرقام)، وسمِّ أكثر عشر عبارات إشكالًا. لا حاجة إلى المديح؛ كن صريحًا ومحدَّدًا.

اكتب التقرير بالعربية واحفظه في {OUT} وأرسل النص نفسه في رسالتك الأخيرة. لا تقرأ ولا تغيّر أيّ ملف آخر.""",
'he':"""את/ה עורכ/ת לשון מנוסה בעברית. בקובץ שלהלן יש ניסוחים קצרים וממוספרים שאנשים כתבו למסך של אפליקציה. כל ניסוח אמור להבהיר מתי דבר חוזר על עצמו.

הקובץ: {SAMPLE}

לכל ניסוח:
1. הערכה: **טבעי** / **מסורבל** / **מוזר**. אמת המידה: האם כותב קפדן בעברית היה כותב זאת כך על מסך.
2. הבנה: כתוב/כתבי במילים שלך מתי בדיוק הדבר קורה לפי הבנתך, על סמך הניסוח בלבד (הרגע הראשון והאחרון, ימים, תאריכים וכו'). אם אפשר לקרוא אותו בשתי דרכים, ציין/צייני את שתיהן.
3. אם הערכת שהוא מסורבל או מוזר, כתוב/כתבי איך היית מנסח/ת אותו.

בסוף, רכז/י את הבעיות שחוזרות בכמה ניסוחים (כתיב, סדר מילים, בחירת מילים, כיוון המספרים), ומנה/י את עשרת הניסוחים הבעייתיים ביותר. אין צורך במחמאות; כתוב/כתבי בכנות ובאופן קונקרטי.

כתוב/כתבי את הדוח בעברית, שמור/שמרי אותו בקובץ {OUT} ושלח/י את אותו הטקסט כהודעה האחרונה. אין לקרוא או לשנות קבצים אחרים.""",
}
open(f'{S}/judges/{c}-{r}.brief.md','w').write(T[c].replace('{SAMPLE}',f'{S}/judges/{c}-{r}.sample.txt').replace('{OUT}',f'{S}/judges/{c}-{r}.md')+'\n')
