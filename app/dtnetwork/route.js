const MAX_BODY_BYTES = 100_000;

function normalizePhone(value) {
  if (value === undefined || value === null) return "";
  return String(value).replace(/\D/g, "");
}

function normalizeName(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export async function POST(request) {
  const requestId = crypto.randomUUID();

  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("application/json")) {
      return Response.json(
        {
          success: false,
          request_id: requestId,
          error: "Content-Type deve ser application/json",
        },
        { status: 415 }
      );
    }

    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > MAX_BODY_BYTES) {
      return Response.json(
        {
          success: false,
          request_id: requestId,
          error: "Payload muito grande",
        },
        { status: 413 }
      );
    }

    const data = await request.json();

    const name = normalizeName(data?.name);
    const phone = normalizePhone(data?.phone);

    if (!name || !phone) {
      return Response.json(
        {
          success: false,
          request_id: requestId,
          error: "Os campos name e phone são obrigatórios",
        },
        { status: 400 }
      );
    }

    if (phone.length < 10 || phone.length > 15) {
      return Response.json(
        {
          success: false,
          request_id: requestId,
          error: "Telefone inválido",
        },
        { status: 400 }
      );
    }

    const zaapUrl = process.env.ZAAP_WEBHOOK_URL;

    if (!zaapUrl) {
      return Response.json(
        {
          success: false,
          request_id: requestId,
          error: "Integração Zaap não configurada",
        },
        { status: 500 }
      );
    }

    const zaapResponse = await fetch(zaapUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
      }),
      cache: "no-store",
    });

    await zaapResponse.text();

    return Response.json(
      {
        success: zaapResponse.ok,
        request_id: requestId,
        zaap_status: zaapResponse.status,
        message: zaapResponse.ok
          ? "Payload encaminhado ao Zaap com sucesso"
          : "O Zaap respondeu com erro",
      },
      {
        status: zaapResponse.ok ? 200 : 502,
      }
    );
  } catch (error) {
    console.error(`[${requestId}] Erro no webhook`, error);

    return Response.json(
      {
        success: false,
        request_id: requestId,
        error: "Erro interno ao processar webhook",
      },
      { status: 500 }
    );
  }
}
