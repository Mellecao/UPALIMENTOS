# UP Alimentos - Guia de Uso

## 🎯 Para Desenvolvedores

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Mellecao/UPALIMENTOS.git
cd UPALIMENTOS
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no navegador:
```
http://localhost:5173
```

### Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview da build de produção

### Estrutura do Código

#### JavaScript (src/main.js)

O arquivo está organizado em seções claramente marcadas:

1. **Configuration & State**: Configurações globais e estado da aplicação
2. **Utility Functions**: Funções auxiliares (detecção mobile, preferências)
3. **Loading Manager**: Gerenciamento de carregamento de assets
4. **Three.js Scene**: Configuração da cena 3D
5. **Matter.js Physics**: Motor de física
6. **Peanuts Loading**: Carregamento e criação dos amendoins
7. **Mouse Interaction**: Interação com mouse
8. **Animation Loop**: Loop principal de animação
9. **Scroll Animations**: Animações de scroll com GSAP
10. **Menu Interactions**: Lógica do menu popup
11. **Form Handling**: Manipulação do formulário
12. **Window Resize**: Redimensionamento responsivo

#### CSS (src/styles.css)

Organizado em seções temáticas:

1. CSS Variables (cores, espaçamentos, transições)
2. Reset and Base Styles
3. Loading Screen
4. Navigation
5. Menu Overlay
6. Main Content & Sections
7. Hero Section
8. Buttons
9. Feature/Benefit Grids
10. Contact Form
11. Footer
12. Responsive (media queries)
13. Accessibility (reduced motion, focus, high contrast)

### Customização

#### Ajustar Quantidade de Amendoins

Em `src/main.js`, linha ~15:
```javascript
const config = {
  peanutCount: 300,          // Quantidade no desktop
  peanutCountMobile: 180,    // Quantidade no mobile
  // ...
};
```

#### Ajustar Cores

Em `src/styles.css`, linha ~8:
```css
:root {
  --color-bege: #FDF6E7;
  --color-marrom: #3F1700;
  --color-branco: #F8FCFF;
  --color-laranja: #FF6B35;
  --color-laranja-hover: #FF8555;
}
```

#### Ajustar Física

Em `src/main.js`, linha ~15:
```javascript
const config = {
  // ...
  gravity: 0.5,              // Gravidade (0 = sem gravidade, 1 = normal)
  friction: 0.1,             // Atrito (0 = sem atrito, 1 = muito atrito)
  restitution: 0.6,          // "Elasticidade" (0 = não quica, 1 = quica muito)
  mouseForceStrength: 0.0015, // Força do mouse
  mouseForceRadius: 200,     // Raio de influência do mouse (px)
};
```

#### Ajustar Textos

Todos os textos estão em `index.html`. Exemplo:

```html
<h1 class="hero-title">Energia que eleva o dia.</h1>
<p class="hero-subtitle">Amendoins premium com origem na Alta Paulista.</p>
```

#### Adicionar Novas Seções

1. Adicione o HTML em `index.html`:
```html
<section id="nova-secao" class="section">
  <div class="container">
    <div class="section-content">
      <h2 class="section-title">Título da Nova Seção</h2>
      <p class="section-text">Conteúdo...</p>
    </div>
  </div>
</section>
```

2. Adicione animação em `src/main.js` (função `initScrollAnimations`):
```javascript
gsap.from('#nova-secao .section-content', {
  scrollTrigger: {
    trigger: '#nova-secao',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1,
  },
  opacity: 0,
  y: 100,
});
```

## 👥 Para Usuários do Site

### Navegação

#### Menu Principal

1. Clique no botão **☰** (hamburguer) no canto superior direito
2. O menu abre com links para todas as seções
3. Clique em qualquer link para ir direto à seção
4. Feche com o botão **✕** ou pressionando **ESC**

**Atalhos de teclado**:
- **Tab**: Navegar entre links
- **Enter/Space**: Ativar link
- **ESC**: Fechar menu

#### Scrolling

- Role a página para baixo para ver as diferentes seções
- As seções aparecem suavemente conforme você rola
- Os amendoins no fundo se movem com física realista

### Interação com Amendoins

- Mova o mouse sobre os amendoins
- Eles serão "empurrados" suavemente para longe do cursor
- No mobile, não há interação (para economia de bateria)

### Formulário de Contato

1. Role até o final da página
2. Preencha todos os campos obrigatórios:
   - Nome
   - E-mail
   - Telefone
   - Cidade
   - Tipo de estabelecimento
3. (Opcional) Adicione uma mensagem
4. Clique em "Enviar mensagem"

**Nota**: O formulário atualmente mostra um alerta. Para produção, será necessário conectar a um backend.

### Acessibilidade

#### Navegação por Teclado

Todo o site pode ser navegado apenas com teclado:
- **Tab**: Próximo elemento
- **Shift+Tab**: Elemento anterior
- **Enter/Space**: Ativar botão/link
- **ESC**: Fechar menu

#### Leitores de Tela

O site é totalmente compatível com leitores de tela:
- Todos os elementos têm labels apropriados
- Estrutura semântica correta
- Landmarks ARIA para navegação rápida

#### Movimento Reduzido

Se você tem sensibilidade a movimento:
1. Ative "Reduzir movimento" nas preferências do sistema
2. O site automaticamente:
   - Reduz quantidade de amendoins
   - Simplifica animações
   - Remove efeitos de parallax

#### Economia de Dados

Se você está com dados limitados:
1. Ative "Economia de dados" nas preferências do sistema/navegador
2. O site automaticamente:
   - Reduz quantidade de amendoins
   - Otimiza recursos

## 🎨 Design System

### Cores

| Nome | Hex | Uso |
|------|-----|-----|
| Bege Claro | #FDF6E7 | Fundo principal, conforto |
| Marrom Escuro | #3F1700 | Textos, confiança |
| Branco | #F8FCFF | Respiro, contraste |
| Laranja | #FF6B35 | Energia, CTAs, destaques |

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Pesos**: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)

| Elemento | Desktop | Mobile |
|----------|---------|--------|
| H1 (Hero) | 4rem | 2rem |
| H2 (Sections) | 3rem | 2rem |
| H3 (Cards) | 1.25rem | 1.25rem |
| Body Large | 1.25rem | 1.125rem |
| Body | 1rem | 1rem |
| Small | 0.875rem | 0.875rem |

### Espaçamentos

- **XS**: 0.5rem (8px)
- **SM**: 1rem (16px)
- **MD**: 2rem (32px)
- **LG**: 4rem (64px)
- **XL**: 6rem (96px)

### Sombras

- **SM**: `0 2px 8px rgba(63, 23, 0, 0.1)`
- **MD**: `0 4px 16px rgba(63, 23, 0, 0.15)`
- **LG**: `0 8px 32px rgba(63, 23, 0, 0.2)`

## 🔧 Troubleshooting

### Loading Screen Fica Presa

**Problema**: A tela de loading não desaparece

**Soluções**:
1. Aguarde até 10 segundos (timeout automático)
2. Verifique console do navegador (F12) para erros
3. Teste em outro navegador (Chrome, Firefox, Safari)
4. Desabilite extensões do navegador

### Amendoins Não Aparecem

**Problema**: Fundo fica com gradient mas sem amendoins

**Causa**: WebGL não suportado ou desabilitado

**Soluções**:
1. Atualize o navegador para versão mais recente
2. Ative aceleração de hardware:
   - Chrome: `chrome://settings/` → Avançado → Sistema
   - Firefox: `about:preferences` → Performance
3. Teste em outro dispositivo

### Performance Lenta

**Problema**: Site está lento ou travando

**Soluções**:
1. Feche outras abas do navegador
2. Ative "Reduzir movimento" nas preferências do sistema
3. Use em device mais potente
4. Reduza manualmente `peanutCount` no código

### Animações Não Funcionam

**Problema**: Elementos não animam no scroll

**Causa**: JavaScript desabilitado ou "Reduzir movimento" ativo

**Soluções**:
1. Habilite JavaScript no navegador
2. Verifique preferências de movimento do sistema
3. Force reload (Ctrl+Shift+R)

## 📱 Compatibilidade

### Navegadores Suportados

| Navegador | Desktop | Mobile |
|-----------|---------|--------|
| Chrome | ✅ 90+ | ✅ 90+ |
| Firefox | ✅ 88+ | ✅ 88+ |
| Safari | ✅ 14+ | ✅ 14+ |
| Edge | ✅ 90+ | ❌ |
| Opera | ✅ 76+ | ✅ 76+ |

### Dispositivos Testados

- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android phones)

### Requisitos Mínimos

- **Navegador moderno** com suporte a ES6+
- **WebGL 1.0** (para amendoins 3D)
- **JavaScript habilitado**
- **1366x768** (desktop), **375x667** (mobile)

## 🚀 Produção

### Build

```bash
npm run build
```

Gera otimizado em `dist/`:
- HTML, CSS, JS minificados
- Assets com hash para cache
- Tree-shaking aplicado
- ~250KB gzipped total

### Deploy

#### Vercel

1. Conecte repositório GitHub
2. Deploy automático a cada push
3. Configuração zero

#### Netlify

1. Arraste pasta `dist/` para netlify.com/drop
2. Ou conecte repositório para CI/CD

#### GitHub Pages

1. Build: `npm run build`
2. Push `dist/` para branch `gh-pages`
3. Ative GitHub Pages nas settings

### Ambiente de Produção

Recomendações:
- **HTTPS obrigatório**
- **CDN** para assets estáticos
- **Compression** (gzip/brotli)
- **Cache headers** apropriados
- **Monitoring** (Sentry, LogRocket)

## 📞 Suporte

### Problemas Técnicos

- Abra uma issue no GitHub
- Inclua: navegador, OS, console errors
- Screenshots se aplicável

### Dúvidas

- Consulte README.md
- Consulte ARCHITECTURE.md
- Revise código (bem comentado)

---

**Última atualização**: Fevereiro 2026
