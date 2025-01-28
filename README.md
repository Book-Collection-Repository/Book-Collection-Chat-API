
# **API de Tempo Real - Book Collection**

Esta API é parte integrante do sistema **Book Collection**, um projeto web desenvolvido para o Trabalho de Conclusão de Curso (TCC). O sistema **Book Collection** funciona como uma rede social para leitores, permitindo a comunicação entre usuários, organização de leituras e descoberta de novas aventuras literárias. Esta API foca na implementação de funcionalidades de tempo real, utilizando a *Arquitetura Orientada a Eventos*.

## **Tecnologias utlizadas**
- **Node.js**

- **TypeScript**

- **Socket.IO** (comunicação em tempo real)

- **Prisma ORM** (gerenciamento de banco de dados)

- **PostgreSQL** (banco de dados relacional)

- **Redis** (cache e gerenciamento de eventos em tempo real)

## **Arquitetura Orientada a Eventos**

Uma **Arquitetura Orientada a Eventos** é um padrão 
arquitetural que utiliza eventos como principal mecanismo para interação entre diferentes partes de um sistema.

Para tanto, a API implementada segue essa arquitetura orientada a eventos, com a implementação das seguintes camadas:

- **Routes:** Define os endpoints disponíveis para cada funcionalidade.

- **Controllers:** Processa as requisições, gerencia a lógica de negócios e coordena os serviços necessários.

- **Services:** Contém a lógica principal de interação com o banco de dados e manipulação dos dados.

- **Middlewares:** Responsáveis por validações e autenticações nas rotas.

Esta API compartilha o mesmo banco de dados da API principal do sistema.

## **Entidades Implementadas**

- **Notification**

- **Messages**

- **Chat**

## **Documentação da API**

#### **Rotas do Chat:**

#### Retorna todos os Chats
```http
  GET /chat/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |

#### Retorna um Chat específico

```http
  GET /chat/${chatId}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `chatId`      | `string` | **Obrigatório**. O ID do chat que você quer. |

#### Criar um Chat
```http
  POST /chat/${receiverId}
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `receiverId` | `string` | **Obrigatório**. O ID do usuário com que se deseja conversar. |

#### Remover um Chat específico

```http
  DELETE /chat/${chatId}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `chatId`      | `string` | **Obrigatório**. O ID do chat que você quer remover. |

#### **Rotas de Messages:**

#### Retorna todas as mensagens de um Chat
```http
  GET /messages/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |

#### Criar uma Message
```http
  POST /message/${chatId}
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `chatId` | `string` | **Obrigatório**. O ID do chat a qual a mensagem se refere. |

#### Remover uma Message

```http
  DELETE /message/${idMessage}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `idMessage`      | `string` | **Obrigatório**. O ID da message que você quer remover. |

#### **Rotas de Notificações:**

#### Retorna todas as notificações
```http
  GET /notification/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |

#### Criar uma notificação
```http
  POST /notification/
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |

#### **Rotas de Redis:**

#### Retorna todos os usuários online
```http
  GET /redis/users/online
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |

#### Retorna alertas de novas notificações
```http
  GET /redis/alert/notification
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |

#### Retorna alertas de novas mensagens
```http
  GET /redis/alert/newMessage
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |


#### Cria alertas de novas notificações
```http
  POST /redis/alert/notification
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |

#### Cria alertas de novas mensagens
```http
  POST /redis/alert/newMessage
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API. |

## **Configurações de exercução**

### **Pré-requisitos**

- **Node.js** (versão 16 ou superior)

- **PostgreSQL** (versão 12 ou superior)

- **Redis**

### **Instalação**
1. Clone o repositório do Asclepius-Mobile:

```bash
https://github.com/Book-Collection-Repository/Book-Collection-Chat-API
```
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo **.env**;

4. Execute as migrações do Prisma:

```bash
npx prisma migrate dev
```

5. Inicie o Servidor:

```bash
npm run dev
```

## **Metodologia de Desenvolvimento**
A API foi desenvolvida utilizando a metodologia **TDD (Test-Driven Development)** em conjunto com Jest para testes unitários e de integração.

## **Contribuição**
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## **Autor**
Este projeto foi desenvolvido como parte do TCC de [Douglas Silva](https://github.com/7-Dodi).

## **Demais repositórios**

- **Frontend:** [Link do repositório](https://github.com/Book-Collection-Repository/Book-Collection-Web-Frontend) 
- **Api Principal:** [Link do repositório](https://github.com/Book-Collection-Repository/Book-Collection-API)

## **Lincença**
[MIT License](https://opensource.org/license/mit)