# CNPJ Consulta

Frontend React moderno para consultar dados públicos de CNPJs brasileiros via API pública CNPJ.ws

## 🚀 Features

- **Consulta em tempo real** de CNPJs na base pública da Receita Federal
- **Resumo informativo** com razão social, endereço, situação cadastral, contato
- **Renderização dinâmica** de todos os dados retornados pela API (objetos, listas, primitivos)
- **Formatação automática** de CNPJ, CEP, datas, booleanos e valores monetários
- **JSON bruto** com syntax highlighting
- **Copiar JSON** com feedback visual
- **Contador de campos** preenchidos
- **Interface responsiva** e acessível
- **Sem dependências externas** de ícones (SVG inline)

## 🛠️ Tech Stack

- React 18
- Vite
- Tailwind CSS v4
- API: https://publica.cnpj.ws/cnpj/{cnpj}

## 📦 Instalação

```bash
npm install
```

## 🏃 Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

## 🔨 Build

```bash
npm run build
```

## 📁 Estrutura

```
src/
├── App.jsx                 # App principal
├── components/
│   ├── icons.jsx          # Ícones SVG inline
│   ├── SummaryCard.jsx    # Card com resumo da empresa
│   └── DynamicJsonView.jsx # Renderizador dinâmico de JSON
└── utils/
    └── format.js          # Formatadores (CNPJ, CEP, datas, moeda)
```

## 📊 Exemplo de Uso

1. Digite um CNPJ (ex: 22.294.942/0001-62)
2. Clique em "Consultar"
3. Veja o resumo com informações principais
4. Explore a seção "Todos os dados retornados" com dados expandíveis
5. Copie o JSON ou veja o bruto

## 📝 Notas

- A API retorna dados variáveis conforme o CNPJ
- Todos os dados são renderizados automaticamente
- Formatação inteligente de campos comuns (datas, moeda, etc.)

---

Desenvolvido com ❤️ por Alysson Oliveira
