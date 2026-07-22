# DTNetwork → Zaap Bridge

Ponte independente entre a DTNetwork e o Zaap.

## Fluxo

DTNetwork → `/api/webhook` → valida payload → envia novo POST JSON → Zaap

## Endpoint

Após o deploy:

```text
POST https://SEU-DOMINIO.vercel.app/api/webhook
```

## Payload esperado

A DTNetwork pode enviar o payload completo. A ponte extrai apenas:

```json
{
  "name": "Guilherme",
  "phone": "5561991432700"
}
```

## Configuração na Vercel

Criar uma variável de ambiente:

```text
ZAAP_WEBHOOK_URL
```

Valor:

```text
https://app.zaapoficial.com.br/token?id=SEU_ID
```

Use a variável nos ambientes:

- Production
- Preview
- Development

## Teste de saúde

```text
GET /api/health
```

Deve retornar:

```json
{
  "success": true,
  "status": "online"
}
```

## Teste do webhook

```bash
curl -X POST "https://SEU-DOMINIO.vercel.app/api/webhook"   -H "Content-Type: application/json"   -d '{
    "name": "Guilherme",
    "phone": "5561991432700"
  }'
```

## Segurança

A URL do Zaap não fica hardcoded no código da aplicação. Ela deve ser configurada como variável de ambiente na Vercel.

O endpoint valida:

- método HTTP;
- Content-Type;
- tamanho do payload;
- existência de nome;
- existência de telefone;
- formato básico do telefone;
- existência da URL do Zaap.

O projeto é independente e não utiliza nenhum sistema de produção existente.
