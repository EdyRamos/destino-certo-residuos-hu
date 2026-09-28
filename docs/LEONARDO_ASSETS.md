# Lista de artes para gerar no Leonardo AI

Atualizado em 28/09/2026. O jogo já funciona sem estas artes: cada uma que chegar substitui automaticamente o provisório (poses da Nery, cenários e medalhas têm reserva automática).

## Como entregar

1. Salve cada PNG em `docs/art/` com **exatamente** o nome de arquivo indicado (ex.: `white_09-v1.png`).
2. Rode `npm run art` (converte para WebP, remove fundo branco liso, liga ao jogo e ao gabarito).
3. Se uma arte ficar ruim, gere de novo e salve como `-v2.png`: a versão mais alta sempre vence.

## Configuração recomendada no Leonardo

- **Consistência de estilo:** use como *Style Reference* uma das artes já aprovadas: `docs/art/white_02-v1.png` (luvas) ou `docs/art/hamper-v1.png`.
- **Nery:** use `docs/art/nery-welcome-v1.png` como *Character Reference* (ou *Image Guidance*), força média/alta, para manter rosto, cabelo e roupa.
- **Fundo:** se o modelo oferecer **Transparência / PNG transparente**, ative. Se não, peça fundo **branco liso** (`plain pure white background`): o script remove o fundo branco sozinho. Evite fundo cinza, degradê ou sombra projetada no chão.
- **Tamanhos:** itens e medalhas 1024×1024 (1:1); Nery 832×1216 (2:3, retrato); cenários 1536×864 ou maior (16:9).
- **Não pode:** texto, letras, logotipos, marcas, marcas-d'água, molduras, e nenhum recipiente/saco colorido junto do item (entregaria a resposta).
- **Negative prompt** (use em todos): `text, letters, words, logo, watermark, signature, frame, border, multiple objects, trash can, waste bin, colored bag, container, hands, person, blood splatter, gore, dark background, gradient background, floor shadow, blurry, lowres, deformed`
  - Na Nery, remova `hands, person` do negativo e acrescente `extra fingers, deformed hands, logo on coat, text on coat`.

## Prioridade A — deixam o jogo com cara de jogo

### A1. Poses da Nery (6)

Base comum para colar no início de cada prompt:

> Nery, friendly adult Brazilian female hospital educator, warm brown eyes, brown hair in a neat bun with a few loose strands, stylized 3D character like a premium animated movie, plain white lab coat with blank chest (no logo, no text) over dark teal scrubs, white clogs, full body, centered, soft studio lighting, plain pure white background, generous margin around the figure.

| Arquivo | Pose (acrescente depois da base) | Onde aparece |
|---|---|---|
| `nery-celebrate-v1.png` | celebrating joyfully, one fist raised in victory, big open smile, eyes squinting with happiness, slight jump | acerto |
| `nery-thinking-v1.png` | thoughtful, index finger on chin, looking slightly up, tablet held under the other arm, curious half smile | dica durante as tentativas |
| `nery-encourage-v1.png` | gentle reassuring smile, one hand on her chest, other palm open toward the viewer, kind eyebrows | erro / "vamos aprender com essa" |
| `nery-explain-v1.png` | explaining, pointing with her right index finger to the side, holding a tablet with a blank glowing green screen in the other hand | explicação e abertura das missões |
| `nery-wave-v1.png` | waving hello with one hand, warm welcoming smile, slight head tilt | tela inicial e conclusão |
| `nery-trophy-v1.png` | proudly holding a shiny golden trophy cup (no text, no engraving) with both hands, joyful | fim da carreira |

Opcional: `nery-welcome-v2.png` com a mesma pose da atual (mão aberta apresentando, tablet na outra mão), **sem logo no jaleco**, para todas as poses ficarem iguais.

### A2. Itens que ainda estão com recorte do PDF (24)

Estilo comum para colar **depois** de cada assunto:

> Polished stylized 3D render for a friendly animated hospital training game, physically believable materials, soft studio light, front three-quarter view, single isolated object, clear silhouette, plain pure white background, object fills about 80% of the frame, no text, no labels.

| Arquivo | Assunto (início do prompt) |
|---|---|
| `white_09-v1.png` | a single long clinical specimen swab: thin white plastic shaft, one small cotton tip, no tube |
| `white_10-v1.png` | simplified educational illustration of a placenta, disk-shaped muted burgundy tissue with branching surface vessels and a short pale umbilical cord, restrained and non-graphic, no blood spill |
| `white_13-v1.png` | a white plaster forearm splint, removed and empty, rough plaster bandage texture, a modest dry dark red blood stain absorbed into the plaster, no drips |
| `white_14-v1.png` | a used IV infusion giving set: coiled transparent tubing, drip chamber, blue roller clamp, needleless connector, empty, no bag, no needle |
| `white_16-v1.png` | two small disposable gauze pads and a short piece of rolled bandage with modest absorbed blood stains, open mesh texture, no liquid |
| `hamper_03-v1.png` | a folded reusable white cotton surgical compress, thick woven cloth with sewn edges and a fabric loop, a modest dark red absorbed blood stain, no free liquid |
| `hamper_04-v1.png` | a folded reusable white cotton surgical compress, thick woven cloth with sewn edges and a fabric loop, perfectly clean, no stains |
| `hamper_06-v1.png` | a reusable blue woven cotton surgical gown, folded, recognizable long sleeves, tie tapes and ribbed cuffs, stitched seams |
| `hamper_07-v1.png` | a pale blue reusable hospital patient gown, folded loosely, short sleeves and neckline visible, woven cotton with stitched hems |
| `hamper_09-v1.png` | a folded light beige reusable hospital blanket, thick soft woven textile with a stitched border |
| `red_01-v1.png` | restrained, non-graphic educational anatomical model of a human forearm and hand, pale neutral tone, proximal end covered by a small plain white cloth, no wounds, no bone, no blood |
| `green_02-v1.png` | one empty clean transparent disposable plastic drinking cup with subtle ribs |
| `green_03-v1.png` | one empty rigid translucent cylindrical plastic saline bottle with sealed top and molded graduations, no liquid, no tubing |
| `green_07-v1.png` | one clean empty transparent plastic water bottle and one clean unbranded aluminum can side by side |
| `green_09-v1.png` | one empty small translucent PLASTIC twist-off saline ampoule, flexible polyethylene body with a flat twist-off tab, clearly plastic, not glass |
| `black_02-v1.png` | one open white styrofoam takeaway food tray with a few small dried food stains, no utensils |
| `black_03-v1.png` | a short piece of beige adhesive tape curled back on itself beside a small peeled plain adhesive label |
| `black_04-v1.png` | one folded disposable adult diaper with side tabs, white absorbent padding and pale blue outer layer, clean |
| `black_05-v1.png` | a white plaster forearm splint, removed and empty, rough layered plaster bandage texture, no blood, no stains |
| `black_07-v1.png` | a short cotton hygiene swab with two white cotton tips, one on each end of a blue shaft, clean |
| `sharp_03-v1.png` | one used spring-loaded safety lancet, compact blue and white plastic body, tiny steel point at the tip, no blood |
| `sharp_04-v1.png` | three clear broken laboratory glass fragments with sharp angular edges, no liquid |
| `sharp_05-v1.png` | one stainless steel double-edged razor blade, flat rectangle with central cutouts, no handle, no blood |
| `sharp_06-v1.png` | one butterfly needle infusion set: short exposed steel needle, two blue flexible wings, short coiled transparent tube with connector |

Cuidados de conteúdo: a figura precisa bater com a condição do enunciado. Por exemplo, a tala com sangue (`white_13`) e a tala limpa (`black_05`) só se distinguem pela mancha; o mesmo vale para as compressas `hamper_03` e `hamper_04`. Seringa sem agulha não pode ter agulha. Nada de mãos segurando os objetos.

### A3. Cenários dos capítulos (4)

Base comum:

> Soft stylized 3D environment illustration for a friendly animated hospital training game, bright Brazilian university hospital, clean and calm, light green and white palette, gentle depth of field, empty space in the center for interface elements, no people, no text, no signs, no logos, no waste bins, no trash bags.

| Arquivo | Cena |
|---|---|
| `bg-home-v1.png` | modern hospital main lobby with large windows, morning sunlight, indoor plants, polished floor |
| `bg-cap1-v1.png` | nursing station at the start of the morning shift, organized counter, computer monitors turned off, warm sunrise light |
| `bg-cap2-v1.png` | tidy patient ward room during the afternoon, empty made bed, privacy curtain, IV pole, soft daylight |
| `bg-cap3-v1.png` | long hospital corridor in the early evening, warm ceiling lights reflecting on the floor, calm teamwork atmosphere |

## Prioridade B — medalhas e conquistas (7)

Base comum:

> Glossy stylized 3D game achievement medal, round metallic medallion with a short ribbon, centered emblem, soft studio light, plain pure white background, no text, no letters, no numbers.

| Arquivo | Emblema e cor |
|---|---|
| `badge-cap1-v1.png` | a magnifying glass over a leaf, green enamel, silver rim (conquista "Olhar atento") |
| `badge-cap2-v1.png` | an eye with a small check mark, teal enamel, silver rim ("Atenção aos detalhes") |
| `badge-cap3-v1.png` | a heart held by two stylized hands, warm green enamel, gold rim ("Cuidado em equipe") |
| `badge-career-v1.png` | a shield with a leaf and a star, gold, bigger and more ornate ("Carreira completa") |
| `badge-perfect-v1.png` | a faceted blue gem, gold rim ("Fase perfeita") |
| `badge-streak-v1.png` | five small check marks in an arc, green and gold ("Sequência de primeira") |
| `badge-learn-v1.png` | a glowing light bulb, yellow and silver ("Aprendeu com o erro") |

## Prioridade C — casos suspensos, só para o gabarito (7)

Só valem a pena depois que o DEPE decidir esses casos. Use o mesmo estilo dos itens (A2).

| Arquivo | Assunto |
|---|---|
| `white_04-v1.png` | one empty plastic enteral nutrition bottle with a spike port cap, no liquid |
| `white_07-v1.png` | one empty collapsed flexible IV saline bag with ports, no liquid, no tubing |
| `white_12-v1.png` | one opened empty sterilization peel pouch, paper on one side and transparent plastic film on the other |
| `red_02-v1.png` | one sealed full blood component bag with dark red contents and intact ports, non-graphic |
| `red_03-v1.png` | three small glass vaccine vials with rubber stoppers and aluminum seals, no needles |
| `green_06-v1.png` | one clean empty disposable plastic syringe without needle, plunger partly pulled |
| `green_08-v1.png` | one rigid blue reusable gel ice pack, rectangular, no text |

## O que não precisa do Leonardo

Os coletores de vidro (`vial-glass` e `vial-chemical`) usam as fotos reais dos recipientes do HU enviadas pela equipe; salve-as como `docs/art/vial-glass-v2.png` e `docs/art/vial-chemical-v2.png`.


Música e efeitos sonoros são gerados pelo próprio jogo (Web Audio, sem arquivos nem internet). Se quiserem uma trilha gravada no futuro, entregue um MP3 ou OGG curto em loop, com licença livre, e eu integro.
