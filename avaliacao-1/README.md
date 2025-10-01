# Avaliação 1 - Frameworks Modernos para Desenvolvimento de Sistemas

## Descrição do Projeto
Este projeto é uma aplicação web desenvolvida com **Vue 3** e **Vuetify 3** para a disciplina de *Frameworks Modernos para Desenvolvimento de Sistemas* (TADS UNEMAT).  
O objetivo é demonstrar o domínio de conceitos como:

- **vue-router**
- **componentes**
- **diretivas** (`v-for`, `v-if`, `v-model`, etc.)
- **persistência de dados** em *localStorage*

O valor total da avaliação é de **10,0 pontos** e deve ser entregue até **05/10/2025 às 23h59 (horário de Cuiabá)**.

---

## Tema Escolhido
O tema escolhido para a aplicação foi uma **Biblioteca de Jogos/Filmes**.  
A aplicação inclui:

- Um **CRUD** (Criar, Ler, Atualizar, Remover) para gerenciar itens (título, gênero, nota).
- Uma página de **listagem** com busca e ordenação.
- Uma página **"Sobre"** que mostra estatísticas básicas (contagem por gênero).

---

## Requisitos Implementados

- **Páginas e Rotas (3+)**: A aplicação possui 3 páginas/rotas, incluindo um CRUD simples.  
- **Roteamento**: Implementado com *vue-router*.  
- **Componentização**: Foram criados e reutilizados componentes, utilizando *props* para comunicação.  
- **Diretivas e Bindings**: Emprego correto de `v-for`, `v-if/v-else`, `v-bind`, `v-on` e `v-model`.  
- **UI com Vuetify 3**: A interface foi construída utilizando componentes do Vuetify, como *layout*, *app bar*, *cards* e *forms*.  
- **Persistência**: Os dados são salvos e lidos do *localStorage* do navegador, e a interface é sincronizada quando há alterações.  
- **CRUD**: Implementação completa das funcionalidades de criação, leitura, atualização e remoção de uma entidade (filmes/jogos).  

---

## Como Instalar e Executar

Este projeto deve ser executável via:

```bash
npm run dev
```

## Pré-requisitos
- **Node.js**: Verifique a versão utilizada.  
- **Git**: Para clonar o repositório.  

---

## Clonar o repositório
```bash
git clone https://github.com/eduarda-izidorio/Frameworks_-_2025_02.git
cd [nome-do-repositório]


## Instalar dependências
```bash
npm install
```

## Executar o projeto
```bash
npm run dev
```


A aplicação será iniciada em:  
👉 [http://localhost:5173/](http://localhost:5173/) (ou em outra porta disponível).

## Estrutura de Rotas e Componentes

### Rotas
- `/` : Página de listagem de filmes/jogos em cards.  
- `/crud` : Página de CRUD.  
- `/sobre` : Página "Sobre" do sistema.  

### Componentes Reutilizáveis
- `components/CardItem.vue` : Exibe os dados de cada item na listagem.  

---

## Identificação do Grupo
- **Aluno 1**: [Nome completo e Matrícula]  
- **Aluno 2**: [Nome completo e Matrícula]  
- **Aluno 3**: [Nome completo e Matrícula]  
