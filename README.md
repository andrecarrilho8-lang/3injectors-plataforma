# 3Injectors Community — Plataforma

Landing page da 3Injectors Community. Site estático, sem build: um `index.html`
autocontido (CSS e JS inline) mais as imagens em WebP.

## Rodar localmente

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

Abrir o arquivo direto pelo `file://` também funciona.

## Deploy

Vercel detecta como estático e publica a raiz. Sem build command, sem output directory.
`vercel.json` só define cache longo para as imagens.

## Identidade

| | |
|---|---|
| Navy | `#010818` → `#0B2447` |
| Champanhe | `#EBBF8C` |
| Títulos / logo | Poppins 200–300 |
| Corpo | Manrope 300–400 |

## Estrutura

- `index.html` — página inteira: markup, design system em CSS e o motor de scroll
- `hero-trio.webp` — plano dos três fundadores (hero e fechamento)
- `dr-braz.webp`, `dr-bravo.webp`, `dr-coimbra.webp` — retratos individuais
- `anatomy.webp`, `appbg.webp`, `beam.webp` — fundos de apoio

## Motor de scroll

Scroll nativo preservado (`position:sticky` depende dele — por isso
`overflow-x:clip` no `body`, nunca `hidden`). A suavidade vem de interpolar os
valores animados dentro do `requestAnimationFrame`, não de mover a página.

Efeitos: hero fixado onde o texto se dissolve enquanto os fundadores entram em
foco, manifesto que acende palavra por palavra, acervo em scroll horizontal
travado, parallax nos fundos e trilho de progresso nos passos.
Tudo respeita `prefers-reduced-motion`.

## Pendências de conteúdo

Marcados no HTML com a classe `.ph`:

- 3 depoimentos, com nome, especialidade e cidade
- número total de médicos na comunidade (`[X]`, em dois lugares)
- URLs reais dos botões de plano, App Store e Google Play
