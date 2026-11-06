---
slug: "ameacas-internas-e-cadeia-de-suprimentos"
title: "Ameaças internas e cadeia de suprimentos"
kind: lesson
difficulty: 2
est_minutes: 10
xp: 40
status: complete
prerequisites: ["ataques-comuns-dos-mitm-forca-bruta"]
lab_slug: null
exercises:
  - type: single_choice
    xp: 10
    question: "Qual alternativa descreve o foco principal da lição “Ameaças internas e cadeia de suprimentos”?"
    options:
      - "Fazer o primeiro lab real: abrir o terminal do attacker e capturar uma flag simples."
      - "Praticar navegação, permissões, processos e filtragem de texto num sistema real."
      - "Usar `ping`, `dig`, `curl` e `nc` contra alvos do lab."
      - "Entender riscos vindos de dentro e de terceiros."
    answerIndex: 3
    explanation: "O objetivo desta lição é: Entender riscos vindos de dentro e de terceiros. As demais alternativas descrevem focos de outras lições ou práticas fora do escopo."
  - type: true_false
    xp: 10
    statement: "O princípio do menor privilégio reduz o impacto de uma conta comprometida."
    answer: true
    explanation: "Cada identidade deve ter apenas as permissões necessárias para sua função."
  - type: multi_choice
    xp: 10
    question: "Quais destes conceitos são estudados em “Ameaças internas e cadeia de suprimentos”?"
    options:
      - "métodos (GET, POST, PUT, DELETE)"
      - "insider malicioso e negligente"
      - "fornecedores"
      - "ps aux, top/htop, PID, kill, systemctl status"
    answerIndexes:
      - 1
      - 2
    explanation: "Os conceitos corretos são: insider malicioso e negligente, fornecedores. Os outros itens pertencem a outras lições."
---

# Ameaças internas e cadeia de suprimentos

> **Objetivo:** Entender riscos vindos de dentro e de terceiros.

Nem toda ameaça vem de fora. Um funcionário descuidado ou descontente pode vazar dados. E nenhum software é uma ilha: bibliotecas, imagens de container e fornecedores trazem risco. Ataques à cadeia de suprimentos comprometem um componente confiável para atingir muitos clientes. Práticas: revisão periódica de acessos, logs, fixar versões, verificar assinaturas e manter um inventário de dependências (SBOM).

## Por que isso importa

Um vocabulário comum permite priorizar riscos, justificar controles e conversar com áreas técnicas e de negócio. Sem modelo mental, cada incidente parece um caso isolado. Nesta lição, o foco é **Ameaças internas e cadeia de suprimentos**, dentro do módulo **Ameaças**. Compreender o conceito evita o uso cego de ferramentas e facilita diagnosticar problemas.

## Conceitos-chave

- **insider malicioso e negligente**
- **fornecedores**
- **dependências de software**
- **SBOM**
- **revisão de acessos**
- **princípios de verificação de integridade**

Use os conceitos para analisar um sistema fictício: identifique ativos, ameaças, vulnerabilidades e impactos. Depois escolha controles proporcionais ao risco, não apenas a ferramenta da moda. Estude com calma e faça os exercícios sem pressa. Se errar, leia a explicação e tente entender a causa do erro antes de avançar.

## Erros comuns

- confundir vulnerabilidade com risco.
- tratar compliance como segurança completa.
- ignorar o impacto no negócio.
- Avançar sem testar se você consegue explicar o conceito com as próprias palavras.

## Checklist de domínio

- [ ] Consigo explicar **insider malicioso e negligente** com minhas próprias palavras.
- [ ] Consigo explicar **fornecedores** com minhas próprias palavras.
- [ ] Consigo explicar **dependências de software** com minhas próprias palavras.


### Aplique agora

1. Resuma **insider malicioso e negligente** em uma frase e compare com a explicação da lição.
2. Em um ambiente autorizado, observe **fornecedores** na prática e anote a saída relevante.
3. Descreva uma forma concreta de defesa ou de verificação relacionada a **Ameaças internas e cadeia de suprimentos**.

## Resumo

Entender riscos vindos de dentro e de terceiros. Segurança é gestão de risco: entender o ativo e o impacto vale mais do que listar vulnerabilidades sem contexto. Pratique em ambiente controlado e documente o que aprendeu.
