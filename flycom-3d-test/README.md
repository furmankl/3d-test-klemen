# Tehnični preizkus: Frontend 3D razvijalec (Vue + Three.js)

**Trajanje: 5 ur**

## Namen

Tvoja naloga je nadgraditi začetno aplikacijo za upravljanje preproste 3D-scene. Primer je poenostavljen, vendar posnema vsakodnevno delo z internimi GIS/3D-orodji: uporabnik v 3D-pogledu raziskuje prostorske objekte, jih izbira, filtrira in ureja, uporabniški vmesnik pa mora ves čas odražati stanje pregledovalnika.

Osnovni projekt je že postavljen in prikaže delujočo Three.js sceno. Čas želimo nameniti tvojemu razmišljanju, implementaciji in sodelovanju, ne odpravljanju težav z okoljem.

## Zagon projekta

Potrebuješ aktualno LTS-različico Node.js (priporočeno Node.js 20 ali 22) in npm.

```bash
npm install
npm run dev
```

Pred oddajo preveri še:

```bash
npm run build
npm run typecheck
npm run lint
npm run test
```

## Pravila in dovoljeni viri

- Za reševanje imaš natanko **5 ur**.
- Orodja umetne inteligence (npr. ChatGPT, Copilot, Claude in podobna) **niso dovoljena**.
- Uporabljaš lahko uradno dokumentacijo, MDN, Stack Overflow in dokumentacijo uporabljenih knjižnic.
- Uporabiš lahko odprtokodne knjižnice, če znaš pojasniti izbiro. Osnova rešitve mora ostati Vue 3 + Three.js.
- Ne uporabljaj UI-ogrodja ali Tailwinda.
- Obstoječo kodo lahko in jo je smiselno preoblikovati. V njej so namerno prisotne nekatere nedoslednosti in priložnosti za izboljšavo.

Pri Flycom Technologies delamo kot ekipa. Če naletiš na nejasnost ali nimaš vseh informacij, vprašaj. To ni le sprejemljivo, ampak zaželeno: zanima nas tudi, kako razmišljaš in sodeluješ.

## Obvezne naloge

1. Omogoči izbiro objekta s klikom neposredno v 3D-sceni (npr. z `Raycaster`).
2. Omogoči izbiro objekta v seznamu.
3. Sinhroniziraj izbiro med seznamom, Pinia stanjem, podrobnostmi in 3D-pogledom.
4. Izbrani 3D-objekt jasno vizualno poudari.
5. Iz uporabniškega vmesnika omogoči prikaz in skrivanje posameznih objektov.
6. Omogoči urejanje imena, barve in vidnosti izbranega objekta.
7. Dokončaj obrazec za dodajanje novega objekta. Podprti morajo biti kvader, krogla in valj.
8. Filter po tipu naj filtrira seznam **in** 3D-sceno. Smiselno obravnavaj tudi trenutno izbiro.
9. Dokončaj in izboljšaj stanja nalaganja, shranjevanja in napak v lokalnem mock API-ju.
10. Omogoči zanesljivo ponastavitev na začetne podatke.
11. Poišči in odpravi opažene napake ali šibke točke v začetni kodi.
12. Kjer je smiselno, izboljšaj arhitekturo, uporabniško izkušnjo in vizualno predstavitev.

## Tehnične zahteve

- Vue 3, Composition API, Vite in TypeScript
- Three.js s perspektivno kamero in `OrbitControls`
- Pinia kot enotni vir aplikacijskega stanja
- jasna ločitev med podatkovnimi modeli Vue in instancami Three.js
- močno tipizirani modeli ter razumljive komponente/composables
- asinhrono branje in shranjevanje prek priloženega lokalnega mock API-ja
- obstojni podatki v `localStorage` in varna obravnava neveljavnih shranjenih podatkov
- pravilno sproščanje geometrij, materialov, kontrolnikov, dogodkov in animacijske zanke
- delujoč `build`, `typecheck`, `lint` in testi
- brez skrivnosti, zunanjih API-ključev ali odvisnosti od internih storitev

Ne pričakujemo produkcijsko obsežnega sistema ali pravega oblaka točk. Pričakujemo pa razumljivo rešitev, ki kaže, kako bi gradil večji 3D-pregledovalnik z objekti, meritvami, klasifikacijami ali sloji.

## Vizualna zasnova in UX

Končni vmesnik naj bo jasen, učinkovit, odziven in primeren za delo s prostorskimi oziroma 3D-podatki. Uporabnik mora brez ugibanja razumeti, kateri objekt je izbran, kateri je skrit, kateri filter je aktiven ter ali aplikacija nalaga ali shranjuje.

Predstavljaj si, da pri nalogi sodeluješ z UX/UI-oblikovalcem. Če je zahteva dvoumna, zapiši predpostavko, predlagaj smiselno interakcijo in pojasni kompromis. Cenimo implementacijo, ki jo je mogoče skupaj iterirati, bolj kot nepovezano vizualno olepševanje.

## Neobvezne naloge

Če ti ostane čas, lahko dodaš eno ali več izboljšav:

- fokus kamere na izbrani objekt,
- pogled od zgoraj ali preklop perspektivne/ortografske kamere,
- preprosto meritev razdalje med dvema objektoma,
- podporo tipkovnici in izboljšano dostopnost,
- dodatne smiselne teste,
- optimizacijo za večje število objektov,
- zgodovino razveljavitve ali potrditveno pogovorno okno ob ponastavitvi.

Neobvezne naloge rešuj šele, ko je osnovni tok stabilen.

## Kaj ocenjujemo

- pravilnost in povezanost osnovnih funkcionalnosti,
- razumevanje Vue, reaktivnosti in upravljanja stanja,
- razumevanje Three.js, raycastinga in življenjskega cikla WebGL-virov,
- arhitekturo, tipizacijo, berljivost in robustnost,
- obravnavo napak in robnih primerov,
- uporabniško izkušnjo in sposobnost sodelovanja z oblikovalcem,
- razlago odločitev ter zavedanje kompromisov.

**Kakovost je pomembnejša od števila dokončanih funkcij.** Nepopolna, vendar dobro strukturirana, stabilna in jasno pojasnjena rešitev je povsem sprejemljiva.

## Oddaja

Oddaj ZIP projekta ali povezavo do javnega Git-repozitorija. Ne vključuj mape `node_modules` ali izhoda `dist`.

README dopolni s kratkim poročilom:

- kaj si implementiral,
- katere težave ali nedoslednosti si našel,
- česa nisi dokončal,
- kaj bi z več časa izboljšal,
- katere pomembnejše arhitekturne odločitve in odprtokodne knjižnice si izbral ter zakaj.

Želimo ti uspešen testni dan!
