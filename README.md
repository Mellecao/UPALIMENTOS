# UP Alimentos - Site Institucional

Site institucional moderno para UP Alimentos, com animação WebGL de amendoins 3D com física, storytelling com scroll e design responsivo.

## 🚀 Características

- **Background WebGL interativo** com ~300 amendoins 3D usando three.js
- **Física realista** com Matter.js (2D physics mapeado para instâncias 3D)
- **Interação com mouse** que aplica força radial nos amendoins
- **Scroll storytelling** com GSAP e ScrollTrigger
- **Loading screen** com progresso real de carregamento
- **Menu popup** moderno com animações e acessibilidade
- **Design responsivo** otimizado para mobile e desktop
- **Acessibilidade completa** com suporte a:
  - `prefers-reduced-motion` (reduz animações)
  - `prefers-reduced-data` (reduz uso de recursos)
  - Navegação por teclado
  - Focus trap no menu
  - ARIA labels
- **Performance otimizada** com InstancedMesh e draw calls reduzidos

## 🎨 Design

### Paleta de Cores
- **Bege Claro**: #FDF6E7 (fundo e conforto)
- **Marrom Escuro**: #3F1700 (textos e confiança)
- **Branco**: #F8FCFF (respiro e contraste)
- **Laranja**: #FF6B35 (energia e CTAs)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 400, 600, 700, 800

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Como rodar localmente

1. Instalar dependências:
```bash
npm install
```

2. Iniciar servidor de desenvolvimento:
```bash
npm run dev
```

3. Abrir no navegador:
```
http://localhost:5173
```

### Build para produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

### Preview da build

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
UPALIMENTOS/
├── index.html              # HTML principal com estrutura semântica
├── package.json            # Dependências e scripts
├── Logo up.svg             # Logo da marca
├── peanut.glb              # Modelo 3D do amendoim
├── src/
│   ├── main.js            # JavaScript principal (WebGL, física, animações)
│   └── styles.css         # Estilos CSS com variáveis e responsividade
└── README.md              # Este arquivo
```

## 🛠️ Tecnologias

- **Vite** - Build tool e dev server
- **Three.js** - Renderização 3D WebGL
- **Matter.js** - Motor de física 2D
- **GSAP** - Animações e ScrollTrigger
- **HTML5/CSS3/ES6+** - Código moderno e semântico

## 🎯 Funcionalidades Principais

### 1. Background WebGL com Física
- 300 amendoins (180 no mobile) renderizados com InstancedMesh
- Física realista com gravidade, colisão e atrito
- Interação com mouse que empurra os amendoins
- Rotação e movimento suave

### 2. Loading Screen
- Progresso real baseado no LoadingManager do three.js
- Animação de transição suave com GSAP
- Logo pulsante durante carregamento

### 3. Menu Popup
- Overlay full-screen com animações
- Focus trap para acessibilidade
- Fechar com ESC ou clique fora
- Animação stagger nos links

### 4. Scroll Storytelling
- 7 seções contando a história da marca:
  - Hero (chamada principal)
  - Manifesto (propósito)
  - Origem (história de Tupã)
  - Amiga do Produtor (valores)
  - Qualidade (diferenciais)
  - Para Lojistas (B2B)
  - Contato (formulário)
- Animações suaves conforme scroll
- Efeitos de fade, slide e scale

### 5. Formulário de Contato
- Campos para qualificação B2B
- Validação HTML5
- Design acessível e responsivo

## ♿ Acessibilidade

O site foi desenvolvido seguindo as melhores práticas de acessibilidade:

- **ARIA labels** em todos os elementos interativos
- **Focus visível** com outline laranja
- **Navegação por teclado** completa
- **Screen reader friendly** com textos alternativos
- **Reduced motion** para usuários sensíveis a animações
- **Reduced data** para economizar recursos
- **Alto contraste** suportado
- **Fallback** para falhas de WebGL

## 📱 Responsividade

- **Desktop**: Layout completo com 300 amendoins
- **Tablet**: Layout adaptado com espaçamentos ajustados
- **Mobile**: 180 amendoins, layout vertical, menu full-screen
- **Breakpoints**: 768px (tablet) e 480px (mobile)

## 🎨 Customização

### Ajustar quantidade de amendoins
Editar em `src/main.js`:
```javascript
const config = {
  peanutCount: 300,        // Desktop
  peanutCountMobile: 180,  // Mobile
  // ...
};
```

### Ajustar cores
Editar variáveis CSS em `src/styles.css`:
```css
:root {
  --color-bege: #FDF6E7;
  --color-marrom: #3F1700;
  --color-branco: #F8FCFF;
  --color-laranja: #FF6B35;
}
```

### Ajustar física
Editar em `src/main.js`:
```javascript
const config = {
  gravity: 0.5,
  friction: 0.1,
  restitution: 0.6,
  mouseForceStrength: 0.0015,
  // ...
};
```

## 🚀 Performance

### Otimizações implementadas:
- InstancedMesh para reduzir draw calls
- PixelRatio limitado a 2x
- Luzes simples sem sombras pesadas
- Detecção de dispositivo para ajustar recursos
- Reduced motion/data para economizar
- Lazy loading de animações scroll

### Métricas esperadas:
- **FPS**: 60fps em desktop, 30-60fps em mobile
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## 📝 Próximos Passos

Possíveis melhorias futuras:
- [ ] Adicionar catálogo de produtos
- [ ] Integrar formulário com backend
- [ ] Adicionar área de atacado/distribuição
- [ ] Implementar sistema de idiomas (PT/EN)
- [ ] Adicionar analytics
- [ ] Otimizar GLB com compressão Draco
- [ ] Adicionar mais animações scroll
- [ ] Criar página de press kit

## 📄 Licença

© 2026 UP Alimentos. Todos os direitos reservados.

---

Desenvolvido com ❤️ para UP Alimentos
